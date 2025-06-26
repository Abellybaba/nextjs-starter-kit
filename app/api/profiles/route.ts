import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { profiles, links, galleryImages, services, products, testimonials, blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch all profiles for authenticated user OR fetch profile by username (public access)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // If username is provided, fetch public profile (no auth required)
    if (username) {
      const profile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.username, username))
        .limit(1);

      if (profile.length === 0) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      const profileData = profile[0];

      // Fetch related data for the profile
      const [profileLinks, gallery, profileServices, profileProducts, profileTestimonials, profileBlogPosts] = await Promise.all([
        db.select().from(links).where(eq(links.profileId, profileData.id)).orderBy(links.position),
        db.select().from(galleryImages).where(eq(galleryImages.profileId, profileData.id)).orderBy(galleryImages.position),
        db.select().from(services).where(eq(services.profileId, profileData.id)).orderBy(services.position),
        db.select().from(products).where(eq(products.profileId, profileData.id)).orderBy(products.position),
        db.select().from(testimonials).where(eq(testimonials.profileId, profileData.id)).orderBy(testimonials.position),
        db.select().from(blogPosts).where(eq(blogPosts.profileId, profileData.id)),
      ]);

      const profileWithData = {
        ...profileData,
        links: profileLinks.filter(link => link.isActive), // Only show active links for public view
        gallery,
        services: profileServices,
        products: profileProducts,
        testimonials: profileTestimonials,
        blogPosts: profileBlogPosts,
      };

      return NextResponse.json(profileWithData);
    }

    // Otherwise, fetch authenticated user's profiles
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch profiles with all related data
    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, result.session.userId));

    // Fetch related data for each profile
    const profilesWithData = await Promise.all(
      userProfiles.map(async (profile) => {
        const [profileLinks, gallery, profileServices, profileProducts, profileTestimonials, profileBlogPosts] = await Promise.all([
          db.select().from(links).where(eq(links.profileId, profile.id)).orderBy(links.position),
          db.select().from(galleryImages).where(eq(galleryImages.profileId, profile.id)).orderBy(galleryImages.position),
          db.select().from(services).where(eq(services.profileId, profile.id)).orderBy(services.position),
          db.select().from(products).where(eq(products.profileId, profile.id)).orderBy(products.position),
          db.select().from(testimonials).where(eq(testimonials.profileId, profile.id)).orderBy(testimonials.position),
          db.select().from(blogPosts).where(eq(blogPosts.profileId, profile.id)),
        ]);

        return {
          ...profile,
          links: profileLinks,
          gallery,
          services: profileServices,
          products: profileProducts,
          testimonials: profileTestimonials,
          blogPosts: profileBlogPosts,
        };
      })
    );

    return NextResponse.json(profilesWithData);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new profile
export async function POST(request: NextRequest) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      displayName,
      username,
      bio,
      avatar,
      theme,
      template,
      businessHours,
    } = body;

    // Check if username is already taken
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const newProfile = await db
      .insert(profiles)
      .values({
        id: crypto.randomUUID(),
        userId: result.session.userId,
        type,
        displayName,
        username,
        bio,
        avatar,
        theme: theme || "default",
        template: template || "modern",
        businessHours: businessHours || null,
      })
      .returning();

    return NextResponse.json(newProfile[0]);
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

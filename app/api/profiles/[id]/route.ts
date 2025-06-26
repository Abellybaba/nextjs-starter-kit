import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { profiles, links, galleryImages, services, products, testimonials, blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Fetch single profile with all data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, params.id), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch all related data
    const [profileLinks, gallery, profileServices, profileProducts, profileTestimonials, profileBlogPosts] = await Promise.all([
      db.select().from(links).where(eq(links.profileId, params.id)).orderBy(links.position),
      db.select().from(galleryImages).where(eq(galleryImages.profileId, params.id)).orderBy(galleryImages.position),
      db.select().from(services).where(eq(services.profileId, params.id)).orderBy(services.position),
      db.select().from(products).where(eq(products.profileId, params.id)).orderBy(products.position),
      db.select().from(testimonials).where(eq(testimonials.profileId, params.id)).orderBy(testimonials.position),
      db.select().from(blogPosts).where(eq(blogPosts.profileId, params.id)),
    ]);

    const profileWithData = {
      ...profile[0],
      links: profileLinks,
      gallery,
      services: profileServices,
      products: profileProducts,
      testimonials: profileTestimonials,
      blogPosts: profileBlogPosts,
    };

    return NextResponse.json(profileWithData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      displayName,
      username,
      bio,
      avatar,
      theme,
      template,
      businessHours,
      views,
    } = body;

    // Verify ownership
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, params.id), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if username is taken by another profile
    if (username && username !== existingProfile[0].username) {
      const usernameCheck = await db
        .select()
        .from(profiles)
        .where(eq(profiles.username, username))
        .limit(1);

      if (usernameCheck.length > 0) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    const updatedProfile = await db
      .update(profiles)
      .set({
        displayName,
        username,
        bio,
        avatar,
        theme,
        template,
        businessHours,
        views,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, params.id))
      .returning();

    return NextResponse.json(updatedProfile[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete profile and all related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, params.id), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Delete profile (cascade will handle related data)
    await db.delete(profiles).where(eq(profiles.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

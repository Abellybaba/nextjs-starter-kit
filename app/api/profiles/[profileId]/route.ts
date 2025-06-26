import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { profiles, links, galleryImages, services, products, testimonials, blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Fetch single profile with all data
export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
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
      .where(and(eq(profiles.id, params.profileId), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch all related data
    const [profileLinks, gallery, profileServices, profileProducts, profileTestimonials, profileBlogPosts] = await Promise.all([
      db.select().from(links).where(eq(links.profileId, params.profileId)).orderBy(links.position),
      db.select().from(galleryImages).where(eq(galleryImages.profileId, params.profileId)).orderBy(galleryImages.position),
      db.select().from(services).where(eq(services.profileId, params.profileId)).orderBy(services.position),
      db.select().from(products).where(eq(products.profileId, params.profileId)).orderBy(products.position),
      db.select().from(testimonials).where(eq(testimonials.profileId, params.profileId)).orderBy(testimonials.position),
      db.select().from(blogPosts).where(eq(blogPosts.profileId, params.profileId)),
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
  { params }: { params: { profileId: string } }
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
      .where(and(eq(profiles.id, params.profileId), eq(profiles.userId, result.session.userId)))
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
      .where(eq(profiles.id, params.profileId))
      .returning();

    return NextResponse.json(updatedProfile[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update profile fields (public access for view tracking)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const body = await request.json();
    const { views } = body;

    // If only updating views, allow public access for analytics
    if (views !== undefined && Object.keys(body).length === 1) {
      const updatedProfile = await db
        .update(profiles)
        .set({
          views,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, params.profileId))
        .returning();

      if (updatedProfile.length === 0) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      return NextResponse.json({ views: updatedProfile[0].views });
    }

    // For other updates, require authentication
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
      .where(and(eq(profiles.id, params.profileId), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update other profile fields
    const updatedProfile = await db
      .update(profiles)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, params.profileId))
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
  { params }: { params: { profileId: string } }
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
      .where(and(eq(profiles.id, params.profileId), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Delete profile (cascade will handle related data)
    await db.delete(profiles).where(eq(profiles.id, params.profileId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

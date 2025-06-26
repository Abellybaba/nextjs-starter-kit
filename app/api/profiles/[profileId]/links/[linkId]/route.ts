import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { profiles, links } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PUT - Update link
export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string; linkId: string } }
) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify profile ownership
    const profile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, params.profileId), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, url, icon, thumbnailUrl, isActive, featured, clicks } = body;

    const updatedLink = await db
      .update(links)
      .set({
        title,
        url,
        icon,
        thumbnailUrl,
        isActive,
        featured,
        clicks,
        updatedAt: new Date(),
      })
      .where(and(eq(links.id, params.linkId), eq(links.profileId, params.profileId)))
      .returning();

    if (updatedLink.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLink[0]);
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; linkId: string } }
) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify profile ownership
    const profile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, params.profileId), eq(profiles.userId, result.session.userId)))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await db
      .delete(links)
      .where(and(eq(links.id, params.linkId), eq(links.profileId, params.profileId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Increment link clicks (public access for analytics)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { profileId: string; linkId: string } }
) {
  try {
    const body = await request.json();
    const { clicks } = body;

    // This endpoint is public (no auth required) for tracking clicks
    // Get current link data
    const currentLink = await db
      .select()
      .from(links)
      .where(and(eq(links.id, params.linkId), eq(links.profileId, params.profileId)))
      .limit(1);

    if (currentLink.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Increment the clicks count
    const newClickCount = (currentLink[0].clicks || 0) + (clicks || 1);

    const updatedLink = await db
      .update(links)
      .set({
        clicks: newClickCount,
        updatedAt: new Date(),
      })
      .where(and(eq(links.id, params.linkId), eq(links.profileId, params.profileId)))
      .returning();

    return NextResponse.json({ clicks: updatedLink[0].clicks });
  } catch (error) {
    console.error("Error updating link clicks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

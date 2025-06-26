import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { profiles, links } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST - Add new link to profile
export async function POST(
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
    const { title, url, icon, thumbnailUrl, featured } = body;

    // Get current max position
    const maxPosition = await db
      .select({ maxPos: links.position })
      .from(links)
      .where(eq(links.profileId, params.profileId))
      .orderBy(links.position);

    const position = maxPosition.length > 0 ? (maxPosition[maxPosition.length - 1].maxPos || 0) + 1 : 0;

    const newLink = await db
      .insert(links)
      .values({
        id: crypto.randomUUID(),
        profileId: params.profileId,
        title,
        url,
        icon,
        thumbnailUrl,
        featured: featured || false,
        position,
      })
      .returning();

    return NextResponse.json(newLink[0]);
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update link order
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
    const { linkOrder } = body; // Array of { id, position }

    // Update positions
    await Promise.all(
      linkOrder.map((item: { id: string; position: number }) =>
        db
          .update(links)
          .set({ position: item.position })
          .where(eq(links.id, item.id))
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating link order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

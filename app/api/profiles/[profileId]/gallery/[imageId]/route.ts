import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { galleryImages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; imageId: string } }
) {
  try {
    const { profileId, imageId } = params;

    await db
      .delete(galleryImages)
      .where(
        and(
          eq(galleryImages.id, imageId),
          eq(galleryImages.profileId, profileId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}

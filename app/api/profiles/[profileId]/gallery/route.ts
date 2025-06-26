import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { galleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const body = await request.json();
    const { url, altText } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const id = nanoid();
    
    // Get current max position
    const existingImages = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.profileId, profileId));
    
    const maxPosition = Math.max(...existingImages.map(img => img.position || 0), -1);

    const [newImage] = await db
      .insert(galleryImages)
      .values({
        id,
        profileId,
        url,
        altText: altText || null,
        position: maxPosition + 1,
      })
      .returning();

    return NextResponse.json(newImage);
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      { error: "Failed to add gallery image" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const body = await request.json();
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Images array is required" }, { status: 400 });
    }

    // Delete all existing gallery images for this profile
    await db.delete(galleryImages).where(eq(galleryImages.profileId, profileId));

    // Insert new images with positions
    if (images.length > 0) {
      await db.insert(galleryImages).values(
        images.map((img, index) => ({
          id: img.id || nanoid(),
          profileId,
          url: img.url,
          altText: img.altText || null,
          position: index,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}

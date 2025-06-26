import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string; productId: string } }
) {
  try {
    const { profileId, productId } = params;
    const body = await request.json();
    const { name, description, price, imageUrl, linkUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [updatedProduct] = await db
      .update(products)
      .set({
        name,
        description: description || null,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(products.id, productId),
          eq(products.profileId, profileId)
        )
      )
      .returning();

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; productId: string } }
) {
  try {
    const { profileId, productId } = params;

    await db
      .delete(products)
      .where(
        and(
          eq(products.id, productId),
          eq(products.profileId, profileId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

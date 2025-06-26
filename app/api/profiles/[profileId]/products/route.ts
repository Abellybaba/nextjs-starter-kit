import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const body = await request.json();
    const { name, description, price, imageUrl, linkUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const id = nanoid();
    
    // Get current max position
    const existingProducts = await db
      .select()
      .from(products)
      .where(eq(products.profileId, profileId));
    
    const maxPosition = Math.max(...existingProducts.map(product => product.position || 0), -1);

    const [newProduct] = await db
      .insert(products)
      .values({
        id,
        profileId,
        name,
        description: description || null,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        position: maxPosition + 1,
      })
      .returning();

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
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
    const { products: productsData } = body;

    if (!Array.isArray(productsData)) {
      return NextResponse.json({ error: "Products array is required" }, { status: 400 });
    }

    // Delete all existing products for this profile
    await db.delete(products).where(eq(products.profileId, profileId));

    // Insert new products with positions
    if (productsData.length > 0) {
      await db.insert(products).values(
        productsData.map((product, index) => ({
          id: product.id || nanoid(),
          profileId,
          name: product.name,
          description: product.description || null,
          price: product.price ? parseFloat(product.price) : null,
          imageUrl: product.imageUrl || null,
          linkUrl: product.linkUrl || null,
          position: index,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { error: "Failed to update products" },
      { status: 500 }
    );
  }
}

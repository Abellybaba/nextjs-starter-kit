import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string; serviceId: string } }
) {
  try {
    const { profileId, serviceId } = params;
    const body = await request.json();
    const { title, description, price } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [updatedService] = await db
      .update(services)
      .set({
        title,
        description: description || null,
        price: price || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(services.id, serviceId),
          eq(services.profileId, profileId)
        )
      )
      .returning();

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; serviceId: string } }
) {
  try {
    const { profileId, serviceId } = params;

    await db
      .delete(services)
      .where(
        and(
          eq(services.id, serviceId),
          eq(services.profileId, profileId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

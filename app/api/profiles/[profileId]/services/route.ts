import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const body = await request.json();
    const { title, description, price } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const id = nanoid();
    
    // Get current max position
    const existingServices = await db
      .select()
      .from(services)
      .where(eq(services.profileId, profileId));
    
    const maxPosition = Math.max(...existingServices.map(service => service.position || 0), -1);

    const [newService] = await db
      .insert(services)
      .values({
        id,
        profileId,
        title,
        description: description || null,
        price: price || null,
        position: maxPosition + 1,
      })
      .returning();

    return NextResponse.json(newService);
  } catch (error) {
    console.error("Error adding service:", error);
    return NextResponse.json(
      { error: "Failed to add service" },
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
    const { services: servicesData } = body;

    if (!Array.isArray(servicesData)) {
      return NextResponse.json({ error: "Services array is required" }, { status: 400 });
    }

    // Delete all existing services for this profile
    await db.delete(services).where(eq(services.profileId, profileId));

    // Insert new services with positions
    if (servicesData.length > 0) {
      await db.insert(services).values(
        servicesData.map((service, index) => ({
          id: service.id || nanoid(),
          profileId,
          title: service.title,
          description: service.description || null,
          price: service.price || null,
          position: index,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating services:", error);
    return NextResponse.json(
      { error: "Failed to update services" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string; testimonialId: string } }
) {
  try {
    const { profileId, testimonialId } = params;
    const body = await request.json();
    const { quote, author, company } = body;

    if (!quote || !author) {
      return NextResponse.json({ error: "Quote and author are required" }, { status: 400 });
    }

    const [updatedTestimonial] = await db
      .update(testimonials)
      .set({
        quote,
        author,
        company: company || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(testimonials.id, testimonialId),
          eq(testimonials.profileId, profileId)
        )
      )
      .returning();

    if (!updatedTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; testimonialId: string } }
) {
  try {
    const { profileId, testimonialId } = params;

    await db
      .delete(testimonials)
      .where(
        and(
          eq(testimonials.id, testimonialId),
          eq(testimonials.profileId, profileId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const body = await request.json();
    const { quote, author, company } = body;

    if (!quote || !author) {
      return NextResponse.json({ error: "Quote and author are required" }, { status: 400 });
    }

    const id = nanoid();
    
    // Get current max position
    const existingTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.profileId, profileId));
    
    const maxPosition = Math.max(...existingTestimonials.map(t => t.position || 0), -1);

    const [newTestimonial] = await db
      .insert(testimonials)
      .values({
        id,
        profileId,
        quote,
        author,
        company: company || null,
        position: maxPosition + 1,
      })
      .returning();

    return NextResponse.json(newTestimonial);
  } catch (error) {
    console.error("Error adding testimonial:", error);
    return NextResponse.json(
      { error: "Failed to add testimonial" },
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
    const { testimonials: testimonialsData } = body;

    if (!Array.isArray(testimonialsData)) {
      return NextResponse.json({ error: "Testimonials array is required" }, { status: 400 });
    }

    // Delete all existing testimonials for this profile
    await db.delete(testimonials).where(eq(testimonials.profileId, profileId));

    // Insert new testimonials with positions
    if (testimonialsData.length > 0) {
      await db.insert(testimonials).values(
        testimonialsData.map((testimonial, index) => ({
          id: testimonial.id || nanoid(),
          profileId,
          quote: testimonial.quote,
          author: testimonial.author,
          company: testimonial.company || null,
          position: index,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating testimonials:", error);
    return NextResponse.json(
      { error: "Failed to update testimonials" },
      { status: 500 }
    );
  }
}

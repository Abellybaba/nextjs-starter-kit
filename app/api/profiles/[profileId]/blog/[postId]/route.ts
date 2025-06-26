import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string; postId: string } }
) {
  try {
    const { profileId, postId } = params;
    const body = await request.json();
    const { title, content, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const [updatedBlogPost] = await db
      .update(blogPosts)
      .set({
        title,
        content,
        imageUrl: imageUrl || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(blogPosts.id, postId),
          eq(blogPosts.profileId, profileId)
        )
      )
      .returning();

    if (!updatedBlogPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; postId: string } }
) {
  try {
    const { profileId, postId } = params;

    await db
      .delete(blogPosts)
      .where(
        and(
          eq(blogPosts.id, postId),
          eq(blogPosts.profileId, profileId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

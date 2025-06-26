import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const body = await request.json();
    const { title, content, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const id = nanoid();

    const [newBlogPost] = await db
      .insert(blogPosts)
      .values({
        id,
        profileId,
        title,
        content,
        imageUrl: imageUrl || null,
        publishedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newBlogPost);
  } catch (error) {
    console.error("Error adding blog post:", error);
    return NextResponse.json(
      { error: "Failed to add blog post" },
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
    const { blogPosts: blogPostsData } = body;

    if (!Array.isArray(blogPostsData)) {
      return NextResponse.json({ error: "Blog posts array is required" }, { status: 400 });
    }

    // Delete all existing blog posts for this profile
    await db.delete(blogPosts).where(eq(blogPosts.profileId, profileId));

    // Insert new blog posts
    if (blogPostsData.length > 0) {
      await db.insert(blogPosts).values(
        blogPostsData.map((post) => ({
          id: post.id || nanoid(),
          profileId,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl || null,
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating blog posts:", error);
    return NextResponse.json(
      { error: "Failed to update blog posts" },
      { status: 500 }
    );
  }
}

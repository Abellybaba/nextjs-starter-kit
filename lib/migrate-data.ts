import { db } from "@/db/drizzle";
import { profiles, links, galleryImages, services, products, testimonials, blogPosts } from "@/db/schema";
import { UserProfile } from "@/utils/types";

export async function migrateLocalStorageToDatabase(userId: string, localStorageProfiles: UserProfile[]) {
  try {
    console.log(`Starting migration for user ${userId}`);
    
    for (const profile of localStorageProfiles) {
      console.log(`Migrating profile: ${profile.displayName}`);
      
      // 1. Create the main profile
      const newProfile = await db
        .insert(profiles)
        .values({
          id: profile.id,
          userId,
          type: profile.type,
          displayName: profile.displayName,
          username: profile.username,
          bio: profile.bio || "",
          avatar: profile.avatar,
          verified: profile.verified,
          theme: profile.theme,
          template: profile.template,
          views: profile.views,
          businessHours: profile.businessHours || null,
        })
        .returning();

      const profileId = newProfile[0].id;

      // 2. Migrate links
      if (profile.links && profile.links.length > 0) {
        const linkData = profile.links.map((link, index) => ({
          id: link.id,
          profileId,
          title: link.title,
          url: link.url,
          icon: link.icon,
          thumbnailUrl: link.thumbnailUrl,
          clicks: link.clicks,
          isActive: link.isActive,
          featured: link.featured || false,
          position: index,
        }));

        await db.insert(links).values(linkData);
        console.log(`Migrated ${linkData.length} links`);
      }

      // 3. Migrate gallery images
      if (profile.gallery && profile.gallery.length > 0) {
        const galleryData = profile.gallery.map((image, index) => ({
          id: image.id,
          profileId,
          url: image.url,
          altText: image.altText,
          position: index,
        }));

        await db.insert(galleryImages).values(galleryData);
        console.log(`Migrated ${galleryData.length} gallery images`);
      }

      // 4. Migrate services (vCard only)
      if (profile.type === "VCARD" && profile.services && profile.services.length > 0) {
        const servicesData = profile.services.map((service, index) => ({
          id: service.id,
          profileId,
          title: service.title,
          description: service.description,
          price: service.price,
          position: index,
        }));

        await db.insert(services).values(servicesData);
        console.log(`Migrated ${servicesData.length} services`);
      }

      // 5. Migrate products (vCard only)
      if (profile.type === "VCARD" && profile.products && profile.products.length > 0) {
        const productsData = profile.products.map((product, index) => ({
          id: product.id,
          profileId,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          linkUrl: product.linkUrl,
          position: index,
        }));

        await db.insert(products).values(productsData);
        console.log(`Migrated ${productsData.length} products`);
      }

      // 6. Migrate testimonials (vCard only)
      if (profile.type === "VCARD" && profile.testimonials && profile.testimonials.length > 0) {
        const testimonialsData = profile.testimonials.map((testimonial, index) => ({
          id: testimonial.id,
          profileId,
          quote: testimonial.quote,
          author: testimonial.author,
          company: testimonial.company,
          position: index,
        }));

        await db.insert(testimonials).values(testimonialsData);
        console.log(`Migrated ${testimonialsData.length} testimonials`);
      }

      // 7. Migrate blog posts (vCard only)
      if (profile.type === "VCARD" && profile.blogPosts && profile.blogPosts.length > 0) {
        const blogPostsData = profile.blogPosts.map((post) => ({
          id: post.id,
          profileId,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          publishedAt: new Date(post.publishedAt),
        }));

        await db.insert(blogPosts).values(blogPostsData);
        console.log(`Migrated ${blogPostsData.length} blog posts`);
      }

      console.log(`✅ Successfully migrated profile: ${profile.displayName}`);
    }

    console.log(`🎉 Migration completed for user ${userId}`);
    return { success: true, migratedProfiles: localStorageProfiles.length };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

export async function clearLocalStorageData() {
  // This should be called after successful migration
  if (typeof window !== "undefined") {
    localStorage.removeItem("vlink-profiles");
    localStorage.removeItem("vlink-active-profile-id");
    console.log("✅ Local storage data cleared");
  }
}

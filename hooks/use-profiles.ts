import { useState, useEffect, useCallback } from "react";
import { UserProfile, GalleryImage, Service, Product, Testimonial, BlogPost } from "@/utils/types";

interface LinkData {
  title: string;
  url: string;
  icon?: string;
  thumbnailUrl?: string;
  featured?: boolean;
}

interface LinkUpdates {
  title?: string;
  url?: string;
  icon?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  featured?: boolean;
  clicks?: number;
}

interface UseProfilesResult {
  profiles: UserProfile[];
  activeProfileId: string | null;
  loading: boolean;
  error: string | null;
  setActiveProfileId: (id: string) => void;
  refreshProfiles: () => Promise<void>;
  createProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateProfile: (id: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  // Links
  addLink: (profileId: string, linkData: LinkData) => Promise<void>;
  updateLink: (profileId: string, linkId: string, updates: LinkUpdates) => Promise<void>;
  deleteLink: (profileId: string, linkId: string) => Promise<void>;
  reorderLinks: (profileId: string, linkOrder: { id: string; position: number }[]) => Promise<void>;
  // Gallery
  addGalleryImage: (profileId: string, imageData: { url: string; altText?: string }) => Promise<void>;
  updateGallery: (profileId: string, images: GalleryImage[]) => Promise<void>;
  deleteGalleryImage: (profileId: string, imageId: string) => Promise<void>;
  // Services
  addService: (profileId: string, serviceData: { title: string; description?: string; price?: string }) => Promise<void>;
  updateServices: (profileId: string, services: Service[]) => Promise<void>;
  deleteService: (profileId: string, serviceId: string) => Promise<void>;
  // Products
  addProduct: (profileId: string, productData: { name: string; description?: string; price?: number; imageUrl?: string; linkUrl?: string }) => Promise<void>;
  updateProducts: (profileId: string, products: Product[]) => Promise<void>;
  deleteProduct: (profileId: string, productId: string) => Promise<void>;
  // Testimonials
  addTestimonial: (profileId: string, testimonialData: { quote: string; author: string; company?: string }) => Promise<void>;
  updateTestimonials: (profileId: string, testimonials: Testimonial[]) => Promise<void>;
  deleteTestimonial: (profileId: string, testimonialId: string) => Promise<void>;
  // Blog Posts
  addBlogPost: (profileId: string, postData: { title: string; content: string; imageUrl?: string }) => Promise<void>;
  updateBlogPosts: (profileId: string, blogPosts: BlogPost[]) => Promise<void>;
  deleteBlogPost: (profileId: string, postId: string) => Promise<void>;
  // Migration
  migrateFromLocalStorage: () => Promise<{ success: boolean; migratedCount: number }>;
}

export function useProfiles(): UseProfilesResult {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profiles");
      
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }
      
      const data = await response.json();
      setProfiles(data);
      
      // Set active profile if none selected
      if (!activeProfileId && data.length > 0) {
        setActiveProfileId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  }, [activeProfileId]);

  // Load profiles from database
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simply load profiles from database
        const response = await fetch("/api/profiles");
        
        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
          
          // Set active profile if none selected and profiles exist
          if (!activeProfileId && data.length > 0) {
            setActiveProfileId(data[0].id);
          }
        } else {
          // If API fails, user starts fresh (no localStorage fallback)
          console.log("No profiles found or API error, user starts fresh");
          setProfiles([]);
          setActiveProfileId(null);
        }
      } catch (error) {
        console.error("Error loading profiles:", error);
        // Don't show error for fresh users, just start fresh
        setProfiles([]);
        setActiveProfileId(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [activeProfileId]);

  const createProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create profile");
      }

      const newProfile = await response.json();
      setProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  const updateProfile = async (id: string, updates: Partial<UserProfile>) => {
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updatedProfile } : p));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      setProfiles(prev => prev.filter(p => p.id !== id));
      
      // If deleted profile was active, select another one
      if (activeProfileId === id) {
        const remainingProfiles = profiles.filter(p => p.id !== id);
        setActiveProfileId(remainingProfiles[0]?.id || null);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  };

  const addLink = async (profileId: string, linkData: LinkData) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkData),
      });

      if (!response.ok) {
        throw new Error("Failed to add link");
      }

      // Refresh the specific profile
      await refreshProfiles();
    } catch (error) {
      console.error("Error adding link:", error);
      throw error;
    }
  };

  const updateLink = async (profileId: string, linkId: string, updates: LinkUpdates) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/links/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update link");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error updating link:", error);
      throw error;
    }
  };

  const deleteLink = async (profileId: string, linkId: string) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/links/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error deleting link:", error);
      throw error;
    }
  };

  const reorderLinks = async (profileId: string, linkOrder: { id: string; position: number }[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkOrder }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder links");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error reordering links:", error);
      throw error;
    }
  };

  // Gallery methods
  const addGalleryImage = async (profileId: string, imageData: { url: string; altText?: string }) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        throw new Error("Failed to add gallery image");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error adding gallery image:", error);
      throw error;
    }
  };

  const updateGallery = async (profileId: string, images: GalleryImage[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/gallery`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) {
        throw new Error("Failed to update gallery");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error updating gallery:", error);
      throw error;
    }
  };

  const deleteGalleryImage = async (profileId: string, imageId: string) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/gallery/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete gallery image");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      throw error;
    }
  };

  // Services methods
  const addService = async (profileId: string, serviceData: { title: string; description?: string; price?: string }) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  };

  const updateServices = async (profileId: string, services: Service[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });

      if (!response.ok) {
        throw new Error("Failed to update services");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error updating services:", error);
      throw error;
    }
  };

  const deleteService = async (profileId: string, serviceId: string) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  };

  // Products methods
  const addProduct = async (profileId: string, productData: { name: string; description?: string; price?: number; imageUrl?: string; linkUrl?: string }) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProducts = async (profileId: string, products: Product[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        throw new Error("Failed to update products");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error updating products:", error);
      throw error;
    }
  };

  const deleteProduct = async (profileId: string, productId: string) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  // Testimonials methods
  const addTestimonial = async (profileId: string, testimonialData: { quote: string; author: string; company?: string }) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        throw new Error("Failed to add testimonial");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error adding testimonial:", error);
      throw error;
    }
  };

  const updateTestimonials = async (profileId: string, testimonials: Testimonial[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/testimonials`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonials }),
      });

      if (!response.ok) {
        throw new Error("Failed to update testimonials");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error updating testimonials:", error);
      throw error;
    }
  };

  const deleteTestimonial = async (profileId: string, testimonialId: string) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/testimonials/${testimonialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      throw error;
    }
  };

  // Blog Posts methods
  const addBlogPost = async (profileId: string, postData: { title: string; content: string; imageUrl?: string }) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to add blog post");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error adding blog post:", error);
      throw error;
    }
  };

  const updateBlogPosts = async (profileId: string, blogPosts: BlogPost[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/blog`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogPosts }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog posts");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error updating blog posts:", error);
      throw error;
    }
  };

  const deleteBlogPost = async (profileId: string, postId: string) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}/blog/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      await refreshProfiles();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  };

  const migrateFromLocalStorage = async () => {
    try {
      setLoading(true);
      
      const localProfiles = localStorage.getItem("vlink-profiles");
      if (!localProfiles) {
        throw new Error("No localStorage data found to migrate");
      }

      const profilesData = JSON.parse(localProfiles);
      if (profilesData.length === 0) {
        throw new Error("No profiles found in localStorage");
      }

      console.log("Starting manual migration...");
      
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profiles: profilesData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Migration failed");
      }

      console.log("Migration successful!");
      
      // Clear localStorage after successful migration
      localStorage.removeItem("vlink-profiles");
      localStorage.removeItem("vlink-active-profile-id");
      
      // Reload profiles from database
      await refreshProfiles();
      
      return { success: true, migratedCount: profilesData.length };
    } catch (error) {
      console.error("Manual migration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profiles,
    activeProfileId,
    loading,
    error,
    setActiveProfileId,
    refreshProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    // Gallery
    addGalleryImage,
    updateGallery,
    deleteGalleryImage,
    // Services
    addService,
    updateServices,
    deleteService,
    // Products
    addProduct,
    updateProducts,
    deleteProduct,
    // Testimonials
    addTestimonial,
    updateTestimonials,
    deleteTestimonial,
    // Blog Posts
    addBlogPost,
    updateBlogPosts,
    deleteBlogPost,
    // Migration
    migrateFromLocalStorage,
  };
}

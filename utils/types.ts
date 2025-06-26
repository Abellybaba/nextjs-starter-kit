// import { z } from "zod";
// import { FC } from 'react';

// export type userCreateProps = z.infer<typeof userCreateSchema>;

// const userCreateSchema = z.object({
//   email: z.string().email({ message: "Invalid email" }).describe("user email"),
//   first_name: z
//     .string()
//     .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" })
//     .min(3, { message: "First name is required" })
//     .describe("user first name"),
//   last_name: z
//     .string()
//     .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" })
//     .min(3, { message: "Last name is required" })
//     .describe("user last name"),
//   profile_image_url: z
//     .string()
//     .url({ message: "Invalid URL" })
//     .optional()
//     .describe("user profile image URL"),
//   user_id: z.string().describe("user ID"),
// });

// export type userUpdateProps = z.infer<typeof userUpdateSchema>;

// const userUpdateSchema = z.object({
//   email: z
//     .string()
//     .email({ message: "Invalid email" })
//     .nonempty({ message: "Email is required" })
//     .describe("user email"),
//   first_name: z
//     .string()
//     .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" })
//     .describe("user first name"),
//   last_name: z
//     .string()
//     .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" })
//     .describe("user last name"),
//   profile_image_url: z
//     .string()
//     .url({ message: "Invalid URL" })
//     .optional()
//     .describe("user profile image URL"),
//   user_id: z.string().describe("user ID"),
// });

export type ProfileType = 'VLINK' | 'VCARD';

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  featured?: boolean;
  thumbnailUrl?: string;
  clicks: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  price?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  linkUrl?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  quote: string;
  company?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishedAt: string; // Changed to string to store ISO date
}

export type DayAvailability = {
  isOpen: boolean;
  start: string;
  end: string;
};

export type BusinessHours = {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
};

export type UserProfile = {
    id: string;
    type: ProfileType;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    theme: string;
    bio: string;
    template: string;
    views: number;
    links: LinkItem[];
    gallery: GalleryImage[];
    services: Service[];
    products: Product[];
    testimonials: Testimonial[];
    blogPosts: BlogPost[];
    businessHours?: BusinessHours;
};

export interface Template {
  name: string;
  component:  React.ComponentType<any>;
  type: ProfileType;
  image: string;
}

 // Define the platform type
export interface Platform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  // Add other properties that platforms might have
  displayName?: string;
  url?: string;
}

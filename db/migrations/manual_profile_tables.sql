-- Migration: Add profile management tables
-- This migration adds tables for the link-in-bio functionality

CREATE TABLE IF NOT EXISTS "profiles" (
    "id" text PRIMARY KEY NOT NULL,
    "userId" text NOT NULL,
    "type" varchar(10) DEFAULT 'VLINK' NOT NULL,
    "displayName" text NOT NULL,
    "username" varchar(50) NOT NULL,
    "bio" text,
    "avatar" text,
    "verified" boolean DEFAULT false NOT NULL,
    "theme" varchar(20) DEFAULT 'default' NOT NULL,
    "template" varchar(30) DEFAULT 'modern' NOT NULL,
    "views" integer DEFAULT 0 NOT NULL,
    "businessHours" json,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "profiles_username_unique" UNIQUE ("username")
);

CREATE TABLE IF NOT EXISTS "links" (
    "id" text PRIMARY KEY NOT NULL,
    "profileId" text NOT NULL,
    "title" text NOT NULL,
    "url" text NOT NULL,
    "icon" varchar(50),
    "thumbnailUrl" text,
    "clicks" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "gallery_images" (
    "id" text PRIMARY KEY NOT NULL,
    "profileId" text NOT NULL,
    "url" text NOT NULL,
    "altText" text,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "services" (
    "id" text PRIMARY KEY NOT NULL,
    "profileId" text NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "price" text,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "products" (
    "id" text PRIMARY KEY NOT NULL,
    "profileId" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "price" real,
    "imageUrl" text,
    "linkUrl" text,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "testimonials" (
    "id" text PRIMARY KEY NOT NULL,
    "profileId" text NOT NULL,
    "quote" text NOT NULL,
    "author" text NOT NULL,
    "company" text,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
    "id" text PRIMARY KEY NOT NULL,
    "profileId" text NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "imageUrl" text,
    "publishedAt" timestamp DEFAULT now() NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
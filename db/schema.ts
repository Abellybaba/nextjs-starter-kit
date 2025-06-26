import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  json,
  real,
} from "drizzle-orm/pg-core";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// User Profiles Table
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 10 }).notNull().default("VLINK"), // "VLINK" | "VCARD"
  displayName: text("displayName").notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  verified: boolean("verified").notNull().default(false),
  theme: varchar("theme", { length: 20 }).notNull().default("default"),
  template: varchar("template", { length: 30 }).notNull().default("modern"),
  views: integer("views").notNull().default(0),
  businessHours: json("businessHours"), // JSON for business hours object
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Links Table
export const links = pgTable("links", {
  id: text("id").primaryKey(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: varchar("icon", { length: 50 }),
  thumbnailUrl: text("thumbnailUrl"),
  clicks: integer("clicks").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  position: integer("position").notNull().default(0), // For ordering
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Gallery Images Table
export const galleryImages = pgTable("gallery_images", {
  id: text("id").primaryKey(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("altText"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Services Table (for vCard profiles)
export const services = pgTable("services", {
  id: text("id").primaryKey(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Products Table (for vCard profiles)
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price"),
  imageUrl: text("imageUrl"),
  linkUrl: text("linkUrl"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Testimonials Table (for vCard profiles)
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  company: text("company"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Blog Posts Table (for vCard profiles)
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  publishedAt: timestamp("publishedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Subscription Table (for Polar.sh integration)
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  polarSubscriptionId: text("polarSubscriptionId").unique(),
  status: varchar("status", { length: 20 }).notNull(),
  tier: varchar("tier", { length: 20 }).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Subscription table for Polar webhook data
export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(),
  modifiedAt: timestamp("modifiedAt"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  recurringInterval: text("recurringInterval").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: timestamp("canceledAt"),
  startedAt: timestamp("startedAt").notNull(),
  endsAt: timestamp("endsAt"),
  endedAt: timestamp("endedAt"),
  customerId: text("customerId").notNull(),
  productId: text("productId").notNull(),
  discountId: text("discountId"),
  checkoutId: text("checkoutId").notNull(),
  customerCancellationReason: text("customerCancellationReason"),
  customerCancellationComment: text("customerCancellationComment"),
  metadata: text("metadata"), // JSON string
  customFieldData: text("customFieldData"), // JSON string
  userId: text("userId").references(() => user.id),
});

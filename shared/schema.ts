import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the Nutritional Info structure
export type NutritionalInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

// Meals Table
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // breakfast, lunch, dinner
  imageUrl: text("image_url").notNull(),
  nutritionalInfo: jsonb("nutritional_info").$type<NutritionalInfo>().notNull(),
  tags: text("tags").array().notNull(),
  ingredients: text("ingredients").array().notNull().default([]),
  steps: text("steps").array().notNull().default([]),
});

// Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  mealCount: integer("meal_count").notNull().default(0),
});

// User table (keeping this from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schemas
export const insertMealSchema = createInsertSchema(meals).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Strongly-typed exports
export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Meal = typeof meals.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

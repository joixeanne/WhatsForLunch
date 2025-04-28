import { meals, type Meal, type InsertMeal, categories, type Category, type InsertCategory, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User operations (keeping from original schema)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Meal operations
  getMeals(): Promise<Meal[]>;
  getMealsByCategory(category: string): Promise<Meal[]>;
  getMeal(id: number): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private meals: Map<number, Meal>;
  private categories: Map<number, Category>;
  private userId: number;
  private mealId: number;
  private categoryId: number;

  constructor() {
    this.users = new Map();
    this.meals = new Map();
    this.categories = new Map();
    this.userId = 1;
    this.mealId = 1;
    this.categoryId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Meal operations
  async getMeals(): Promise<Meal[]> {
    return Array.from(this.meals.values());
  }
  
  async getMealsByCategory(category: string): Promise<Meal[]> {
    return Array.from(this.meals.values()).filter(
      (meal) => meal.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  async getMeal(id: number): Promise<Meal | undefined> {
    return this.meals.get(id);
  }
  
  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = this.mealId++;
    const meal: Meal = { ...insertMeal, id };
    this.meals.set(id, meal);
    
    // Update meal count for the category
    const category = Array.from(this.categories.values()).find(
      (cat) => cat.slug.toLowerCase() === meal.category.toLowerCase()
    );
    
    if (category) {
      category.mealCount += 1;
      this.categories.set(category.id, category);
    }
    
    return meal;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug.toLowerCase() === slug.toLowerCase()
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  private initializeData() {
    // Initialize categories
    const breakfastCategory: InsertCategory = {
      name: "Breakfast",
      slug: "breakfast",
      description: "Start your day right",
      imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666",
      mealCount: 3
    };
    
    const lunchCategory: InsertCategory = {
      name: "Lunch",
      slug: "lunch",
      description: "Midday energy boost",
      imageUrl: "https://images.unsplash.com/photo-1547496502-affa22d38842",
      mealCount: 3
    };
    
    const dinnerCategory: InsertCategory = {
      name: "Dinner",
      slug: "dinner",
      description: "Evening satisfaction",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      mealCount: 3
    };
    
    this.createCategory(breakfastCategory);
    this.createCategory(lunchCategory);
    this.createCategory(dinnerCategory);
    
    // Initialize meals
    // Breakfast meals
    this.createMeal({
      name: "Avocado Toast",
      description: "Toasted sourdough bread topped with mashed avocado, cherry tomatoes, and a sprinkle of feta cheese.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
      nutritionalInfo: {
        calories: 450,
        protein: 15,
        carbs: 28,
        fats: 32
      },
      tags: ["vegetarian", "high-fat"]
    });
    
    this.createMeal({
      name: "Greek Yogurt Bowl",
      description: "Creamy Greek yogurt topped with fresh berries, honey, and homemade granola.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
      nutritionalInfo: {
        calories: 320,
        protein: 20,
        carbs: 42,
        fats: 8
      },
      tags: ["vegetarian", "high-protein"]
    });
    
    this.createMeal({
      name: "Breakfast Burrito",
      description: "Scrambled eggs, black beans, avocado, and salsa wrapped in a warm tortilla.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1613270572704-9a2c01255510",
      nutritionalInfo: {
        calories: 550,
        protein: 22,
        carbs: 48,
        fats: 28
      },
      tags: ["high-protein", "high-calorie"]
    });
    
    // Lunch meals
    this.createMeal({
      name: "Quinoa Salad Bowl",
      description: "Colorful mixture of quinoa, roasted vegetables, chickpeas, and a lemon-herb dressing.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      nutritionalInfo: {
        calories: 480,
        protein: 18,
        carbs: 52,
        fats: 22
      },
      tags: ["vegetarian", "high-fiber"]
    });
    
    this.createMeal({
      name: "Grilled Chicken Wrap",
      description: "Grilled chicken strips with crunchy vegetables and chipotle mayo in a spinach wrap.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1600335895229-6e75511892c8",
      nutritionalInfo: {
        calories: 650,
        protein: 38,
        carbs: 45,
        fats: 30
      },
      tags: ["high-protein", "high-calorie"]
    });
    
    this.createMeal({
      name: "Mediterranean Hummus Bowl",
      description: "Creamy hummus with cucumber, tomato, olives, feta, and warm pita bread.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf",
      nutritionalInfo: {
        calories: 420,
        protein: 12,
        carbs: 48,
        fats: 22
      },
      tags: ["vegetarian", "low-calorie"]
    });
    
    // Dinner meals
    this.createMeal({
      name: "Grilled Salmon",
      description: "Fresh grilled salmon with roasted asparagus and lemon-dill sauce.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975",
      nutritionalInfo: {
        calories: 680,
        protein: 42,
        carbs: 12,
        fats: 48
      },
      tags: ["high-protein", "low-carb", "high-fat"]
    });
    
    this.createMeal({
      name: "Vegetable Stir Fry",
      description: "Crisp vegetables and tofu in a savory ginger-garlic sauce over brown rice.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      nutritionalInfo: {
        calories: 520,
        protein: 28,
        carbs: 62,
        fats: 18
      },
      tags: ["vegetarian", "high-fiber"]
    });
    
    this.createMeal({
      name: "Pasta Primavera",
      description: "Al dente pasta with seasonal vegetables in a light cream sauce.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3",
      nutritionalInfo: {
        calories: 750,
        protein: 22,
        carbs: 98,
        fats: 26
      },
      tags: ["vegetarian", "high-carb"]
    });
  }
}

export const storage = new MemStorage();

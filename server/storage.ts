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
    // Ensure ingredients and steps are arrays if not provided
    const mealWithDefaults = {
      ...insertMeal,
      ingredients: insertMeal.ingredients || [],
      steps: insertMeal.steps || []
    };
    const meal: Meal = { ...mealWithDefaults, id };
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
    // Ensure mealCount has a default value
    const categoryWithDefaults = {
      ...insertCategory,
      mealCount: insertCategory.mealCount || 0
    };
    const category: Category = { ...categoryWithDefaults, id };
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
      tags: ["vegetarian", "high-fat"],
      ingredients: [
        "2 slices of sourdough bread",
        "1 ripe avocado",
        "1/2 cup cherry tomatoes, halved",
        "2 tbsp crumbled feta cheese",
        "1 tbsp extra virgin olive oil",
        "1 tsp lemon juice",
        "Salt and pepper to taste",
        "Red pepper flakes (optional)"
      ],
      steps: [
        "Toast the sourdough bread slices until golden and crispy.",
        "Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.",
        "Mash the avocado with a fork and add lemon juice, salt, and pepper.",
        "Spread the mashed avocado evenly on the toasted bread.",
        "Top with halved cherry tomatoes and crumbled feta cheese.",
        "Drizzle with olive oil and sprinkle with red pepper flakes if desired.",
        "Serve immediately while the toast is still warm."
      ]
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
      tags: ["vegetarian", "high-protein"],
      ingredients: [
        "1 cup Greek yogurt",
        "1/2 cup mixed berries (strawberries, blueberries, raspberries)",
        "2 tbsp honey",
        "1/4 cup homemade granola",
        "1 tbsp chia seeds",
        "1 tbsp sliced almonds",
        "1 tsp vanilla extract",
        "Fresh mint leaves (optional)"
      ],
      steps: [
        "In a bowl, mix Greek yogurt with vanilla extract until well combined.",
        "Wash and prepare the mixed berries.",
        "Pour the yogurt mixture into a serving bowl.",
        "Top with mixed berries, granola, chia seeds, and sliced almonds.",
        "Drizzle honey over the top.",
        "Garnish with mint leaves if desired.",
        "Serve immediately or refrigerate for up to 2 hours."
      ]
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
      tags: ["high-protein", "high-calorie"],
      ingredients: [
        "2 large eggs",
        "1 large flour tortilla",
        "1/4 cup black beans, rinsed and drained",
        "1/4 avocado, sliced",
        "2 tbsp salsa",
        "2 tbsp shredded cheddar cheese",
        "1 tbsp chopped cilantro",
        "Salt and pepper to taste",
        "1 tsp olive oil"
      ],
      steps: [
        "Heat olive oil in a small pan over medium heat.",
        "Whisk eggs with salt and pepper, then pour into the pan.",
        "Scramble the eggs until just set, then remove from heat.",
        "Warm the tortilla in a separate dry pan or microwave for 10 seconds.",
        "Layer black beans down the center of the tortilla.",
        "Add scrambled eggs, avocado slices, and shredded cheese.",
        "Top with salsa and chopped cilantro.",
        "Fold in the sides of the tortilla, then roll up tightly.",
        "Return to pan to crisp the outside if desired, then serve warm."
      ]
    });
    
    // Additional breakfast meals
    this.createMeal({
      name: "Blueberry Pancakes",
      description: "Fluffy buttermilk pancakes studded with fresh blueberries and served with maple syrup.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
      nutritionalInfo: {
        calories: 420,
        protein: 10,
        carbs: 65,
        fats: 15
      },
      tags: ["vegetarian", "high-carb"],
      ingredients: [
        "1 cup all-purpose flour",
        "1 tbsp sugar",
        "1 tsp baking powder",
        "1/4 tsp baking soda",
        "1/4 tsp salt",
        "1 cup buttermilk",
        "1 large egg",
        "2 tbsp melted butter",
        "1 cup fresh blueberries",
        "Maple syrup for serving"
      ],
      steps: [
        "In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.",
        "In another bowl, whisk buttermilk, egg, and melted butter.",
        "Pour wet ingredients into dry ingredients and stir until just combined.",
        "Gently fold in blueberries.",
        "Heat a griddle or non-stick pan over medium heat and lightly grease.",
        "Pour 1/4 cup batter for each pancake and cook until bubbles form on surface.",
        "Flip and cook until golden brown on both sides.",
        "Serve with maple syrup and additional blueberries if desired."
      ]
    });
    
    this.createMeal({
      name: "Spinach and Feta Omelette",
      description: "Light and fluffy omelette filled with sautéed spinach, crumbled feta cheese, and diced tomatoes.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71",
      nutritionalInfo: {
        calories: 380,
        protein: 25,
        carbs: 8,
        fats: 28
      },
      tags: ["vegetarian", "low-carb", "high-protein"],
      ingredients: [
        "3 large eggs",
        "2 cups fresh spinach",
        "1/4 cup crumbled feta cheese",
        "1/4 cup diced tomatoes",
        "1 tbsp olive oil",
        "1 small garlic clove, minced",
        "Salt and pepper to taste",
        "Fresh herbs (optional)"
      ],
      steps: [
        "Heat olive oil in a non-stick pan over medium heat.",
        "Add minced garlic and sauté for 30 seconds until fragrant.",
        "Add spinach and cook until wilted, about 1-2 minutes. Remove from pan and set aside.",
        "Beat eggs in a bowl with salt and pepper.",
        "Add a little more oil to the pan if needed, then pour in the beaten eggs.",
        "Cook until the edges start to set, then use a spatula to gently pull the edges toward the center.",
        "When the omelette is mostly set but still slightly runny on top, add the spinach, feta, and tomatoes to one half.",
        "Fold the other half over the filling and cook for another minute.",
        "Slide onto a plate and garnish with fresh herbs if desired."
      ]
    });
    
    this.createMeal({
      name: "Overnight Chia Pudding",
      description: "Creamy chia seed pudding prepared with almond milk and topped with fresh fruits and nuts.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1517247542513-7eec3a73b582",
      nutritionalInfo: {
        calories: 320,
        protein: 12,
        carbs: 42,
        fats: 18
      },
      tags: ["vegetarian", "dairy-free", "high-fiber"],
      ingredients: [
        "1/4 cup chia seeds",
        "1 cup unsweetened almond milk",
        "1 tbsp maple syrup or honey",
        "1/2 tsp vanilla extract",
        "Pinch of salt",
        "Mixed berries for topping",
        "Sliced almonds or other nuts",
        "Coconut flakes (optional)"
      ],
      steps: [
        "In a jar or container, combine chia seeds, almond milk, sweetener, vanilla, and salt.",
        "Stir well to combine, making sure no chia seeds clump together.",
        "Cover and refrigerate overnight, or for at least 4 hours.",
        "Stir again before serving to break up any remaining clumps.",
        "Top with fresh berries, nuts, and coconut flakes.",
        "Serve chilled."
      ]
    });
    
    this.createMeal({
      name: "Protein-Packed Smoothie Bowl",
      description: "Thick, creamy smoothie bowl with protein powder, frozen fruits, and crunchy toppings.",
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1501747761769-4d846a429d37",
      nutritionalInfo: {
        calories: 390,
        protein: 28,
        carbs: 55,
        fats: 10
      },
      tags: ["vegetarian", "high-protein", "high-fiber"],
      ingredients: [
        "1 frozen banana",
        "1 cup frozen mixed berries",
        "1 scoop (about 25g) protein powder",
        "1/2 cup unsweetened plant milk",
        "1 tbsp almond butter",
        "Toppings: granola, sliced banana, berries, chia seeds, coconut flakes"
      ],
      steps: [
        "Add frozen banana, berries, protein powder, plant milk, and almond butter to a blender.",
        "Blend until smooth and thick. Add more liquid if needed, but keep it thick enough to eat with a spoon.",
        "Pour into a bowl.",
        "Arrange toppings in an attractive pattern over the smoothie base.",
        "Serve immediately."
      ]
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

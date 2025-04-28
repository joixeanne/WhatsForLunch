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
      mealCount: 8
    };
    
    const lunchCategory: InsertCategory = {
      name: "Lunch",
      slug: "lunch",
      description: "Midday energy boost",
      imageUrl: "https://images.unsplash.com/photo-1547496502-affa22d38842",
      mealCount: 8
    };
    
    const dinnerCategory: InsertCategory = {
      name: "Dinner",
      slug: "dinner",
      description: "Evening satisfaction",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      mealCount: 6
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
      tags: ["vegetarian", "high-fiber"],
      ingredients: [
        "1 cup cooked quinoa",
        "1 cup roasted vegetables (bell peppers, zucchini, eggplant)",
        "1/2 cup chickpeas, rinsed and drained",
        "1/4 cup crumbled feta cheese",
        "2 tbsp olive oil",
        "1 tbsp lemon juice",
        "1 clove garlic, minced",
        "1 tsp dried herbs (oregano, basil, thyme)",
        "Salt and pepper to taste",
        "Fresh herbs for garnish"
      ],
      steps: [
        "Cook quinoa according to package instructions and let cool.",
        "In a large bowl, combine quinoa, roasted vegetables, and chickpeas.",
        "In a small bowl, whisk together olive oil, lemon juice, minced garlic, dried herbs, salt, and pepper.",
        "Pour the dressing over the quinoa mixture and toss gently to combine.",
        "Top with crumbled feta cheese and fresh herbs.",
        "Serve at room temperature or chilled."
      ]
    });
    
    // Additional lunch meals
    this.createMeal({
      name: "Asian-Inspired Chicken Salad",
      description: "Crisp mixed greens with grilled chicken, mandarin oranges, and a sesame-ginger dressing.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      nutritionalInfo: {
        calories: 420,
        protein: 35,
        carbs: 25,
        fats: 20
      },
      tags: ["high-protein", "low-carb"],
      ingredients: [
        "4 cups mixed greens",
        "6 oz grilled chicken breast, sliced",
        "1/2 cup mandarin orange segments",
        "1/4 cup sliced almonds",
        "2 tbsp chopped green onions",
        "1/4 cup crispy wonton strips",
        "2 tbsp sesame oil",
        "1 tbsp rice vinegar",
        "1 tsp soy sauce",
        "1 tsp honey",
        "1/2 tsp grated fresh ginger",
        "1 tsp toasted sesame seeds"
      ],
      steps: [
        "In a large bowl, toss mixed greens with half of the green onions.",
        "Arrange grilled chicken slices, mandarin oranges, and almonds on top.",
        "In a small bowl, whisk together sesame oil, rice vinegar, soy sauce, honey, and ginger.",
        "Drizzle the dressing over the salad.",
        "Top with crispy wonton strips, remaining green onions, and sesame seeds.",
        "Serve immediately."
      ]
    });
    
    this.createMeal({
      name: "Turkey Avocado Sandwich",
      description: "Hearty sandwich with sliced turkey, avocado, bacon, and lettuce on whole grain bread.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847",
      nutritionalInfo: {
        calories: 550,
        protein: 32,
        carbs: 38,
        fats: 28
      },
      tags: ["high-protein", "high-fat"],
      ingredients: [
        "2 slices whole grain bread",
        "4 oz sliced turkey breast",
        "2 slices cooked bacon",
        "1/2 ripe avocado, sliced",
        "2 lettuce leaves",
        "2 slices tomato",
        "1 tbsp mayonnaise",
        "1 tsp Dijon mustard",
        "Salt and pepper to taste"
      ],
      steps: [
        "Lightly toast the bread slices if desired.",
        "Spread mayonnaise on one slice of bread and mustard on the other.",
        "Layer lettuce, turkey slices, bacon, avocado, and tomato slices on one piece of bread.",
        "Season with salt and pepper to taste.",
        "Top with the second piece of bread and slice diagonally.",
        "Serve with a side of chips or fruit."
      ]
    });
    
    this.createMeal({
      name: "Roasted Vegetable Pita Pocket",
      description: "Warm pita bread filled with hummus, roasted vegetables, and a drizzle of tahini sauce.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
      nutritionalInfo: {
        calories: 380,
        protein: 12,
        carbs: 48,
        fats: 16
      },
      tags: ["vegetarian", "low-fat"],
      ingredients: [
        "1 whole wheat pita pocket",
        "3 tbsp hummus",
        "1 cup mixed roasted vegetables (bell peppers, zucchini, eggplant)",
        "1/4 cup baby spinach leaves",
        "2 tbsp crumbled feta cheese",
        "1 tbsp tahini sauce",
        "1 tsp lemon juice",
        "1/4 tsp za'atar spice blend (optional)",
        "Salt and pepper to taste"
      ],
      steps: [
        "Warm the pita pocket in a toaster or oven until slightly crisp but still flexible.",
        "Cut the pita in half to create two pockets.",
        "Spread hummus inside each pita half.",
        "Fill with roasted vegetables and baby spinach.",
        "Top with crumbled feta cheese.",
        "In a small bowl, mix tahini sauce with lemon juice and a splash of water to thin it out.",
        "Drizzle the tahini sauce over the filling.",
        "Sprinkle with za'atar spice blend if using, and season with salt and pepper.",
        "Serve immediately while still warm."
      ]
    });
    
    this.createMeal({
      name: "Tuna Nicoise Salad",
      description: "Classic French salad with tuna, green beans, potatoes, olives, and a dijon vinaigrette.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      nutritionalInfo: {
        calories: 440,
        protein: 28,
        carbs: 30,
        fats: 24
      },
      tags: ["high-protein", "dairy-free"],
      ingredients: [
        "4 oz seared or canned tuna",
        "2 cups mixed greens",
        "6 small new potatoes, boiled and halved",
        "1 cup green beans, blanched",
        "2 hard-boiled eggs, quartered",
        "1/4 cup Kalamata olives",
        "8 cherry tomatoes, halved",
        "2 tbsp olive oil",
        "1 tbsp red wine vinegar",
        "1 tsp Dijon mustard",
        "1 small shallot, minced",
        "1 tsp fresh thyme leaves",
        "Salt and pepper to taste"
      ],
      steps: [
        "Arrange mixed greens on a large plate or shallow bowl.",
        "Top with arranged sections of potatoes, green beans, eggs, olives, and tomatoes.",
        "Place tuna in the center of the salad.",
        "In a small bowl, whisk together olive oil, red wine vinegar, Dijon mustard, shallot, and thyme.",
        "Season the dressing with salt and pepper.",
        "Drizzle the dressing over the salad.",
        "Serve with additional dressing on the side."
      ]
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
      tags: ["high-protein", "high-calorie"],
      ingredients: [
        "1 large spinach tortilla wrap",
        "6 oz grilled chicken breast, sliced",
        "1/2 cup shredded lettuce",
        "1/4 cup diced tomatoes",
        "1/4 cup sliced bell peppers",
        "1/4 cup shredded carrots",
        "2 tbsp chipotle mayo",
        "1 tbsp lime juice",
        "1/4 tsp ground cumin",
        "Salt and pepper to taste",
        "Fresh cilantro leaves (optional)"
      ],
      steps: [
        "Season chicken with salt, pepper, and cumin, then grill until fully cooked.",
        "Slice the chicken into strips and set aside.",
        "Warm the spinach tortilla in a pan or microwave for 10 seconds.",
        "Spread chipotle mayo over the tortilla.",
        "Arrange chicken strips down the center of the tortilla.",
        "Top with lettuce, tomatoes, bell peppers, and carrots.",
        "Sprinkle with lime juice and cilantro if using.",
        "Fold in the sides of the tortilla, then roll up tightly.",
        "Cut in half diagonally and serve with additional chipotle mayo on the side."
      ]
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
      tags: ["vegetarian", "low-calorie"],
      ingredients: [
        "1 cup prepared hummus",
        "1/2 cucumber, diced",
        "1 cup cherry tomatoes, halved",
        "1/4 cup Kalamata olives, pitted and sliced",
        "1/4 cup crumbled feta cheese",
        "2 tbsp extra virgin olive oil",
        "1 tbsp fresh lemon juice",
        "1 tsp dried oregano",
        "1/4 cup fresh parsley, chopped",
        "1 warm pita bread, cut into triangles",
        "Salt and pepper to taste"
      ],
      steps: [
        "Spread hummus in a shallow bowl, creating a well in the center.",
        "Arrange cucumber, tomatoes, olives, and feta cheese around the hummus.",
        "In a small bowl, mix olive oil, lemon juice, oregano, salt, and pepper.",
        "Drizzle the dressing over the entire bowl.",
        "Sprinkle with chopped parsley.",
        "Serve with warm pita bread triangles on the side.",
        "For best presentation, place the pita bread around the edge of the bowl."
      ]
    });
    
    // Additional lunch meals
    this.createMeal({
      name: "Lentil Soup with Crusty Bread",
      description: "Hearty lentil soup with vegetables, herbs, and a side of warm crusty bread.",
      category: "lunch",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554",
      nutritionalInfo: {
        calories: 410,
        protein: 18,
        carbs: 60,
        fats: 10
      },
      tags: ["vegetarian", "high-fiber"],
      ingredients: [
        "1 cup dried lentils, rinsed",
        "1 onion, diced",
        "2 carrots, diced",
        "2 celery stalks, diced",
        "3 cloves garlic, minced",
        "1 tbsp olive oil",
        "4 cups vegetable broth",
        "1 can (14 oz) diced tomatoes",
        "1 tsp ground cumin",
        "1/2 tsp dried thyme",
        "1 bay leaf",
        "2 cups baby spinach",
        "1 tbsp lemon juice",
        "Salt and pepper to taste",
        "Fresh parsley for garnish",
        "Crusty bread for serving"
      ],
      steps: [
        "Heat olive oil in a large pot over medium heat.",
        "Add onion, carrots, and celery; sauté until softened, about 5 minutes.",
        "Add garlic and cook for another minute until fragrant.",
        "Stir in lentils, diced tomatoes, cumin, thyme, and bay leaf.",
        "Pour in vegetable broth and bring to a boil.",
        "Reduce heat and simmer, covered, for 25-30 minutes until lentils are tender.",
        "Remove bay leaf and stir in spinach until wilted.",
        "Add lemon juice, salt, and pepper to taste.",
        "Garnish with fresh parsley and serve with warm crusty bread."
      ]
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
      tags: ["high-protein", "low-carb", "high-fat"],
      ingredients: [
        "2 salmon fillets (6 oz each)",
        "1 bunch asparagus, trimmed",
        "2 tbsp olive oil, divided",
        "1 lemon, half sliced and half juiced",
        "2 cloves garlic, minced",
        "1 tbsp fresh dill, chopped",
        "1 tbsp dijon mustard",
        "1/4 cup Greek yogurt",
        "Salt and pepper to taste",
        "1 tbsp capers (optional)"
      ],
      steps: [
        "Preheat grill or oven to 400°F (200°C).",
        "Season salmon fillets with salt, pepper, and 1 tbsp olive oil.",
        "Toss asparagus with remaining olive oil, minced garlic, salt, and pepper.",
        "For the sauce, mix Greek yogurt, lemon juice, dijon mustard, and chopped dill in a small bowl.",
        "If grilling, place salmon skin-side down and cook for 4-5 minutes per side. If baking, place salmon and lemon slices on a baking sheet and cook for 12-15 minutes.",
        "Grill or roast asparagus until tender, about 5-7 minutes.",
        "Plate the salmon with asparagus on the side, drizzle with lemon-dill sauce.",
        "Garnish with additional dill, capers (if using), and lemon wedges."
      ]
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
      tags: ["vegetarian", "high-fiber"],
      ingredients: [
        "1 block (14 oz) extra-firm tofu, pressed and cubed",
        "1 red bell pepper, sliced",
        "1 yellow bell pepper, sliced",
        "2 cups broccoli florets",
        "1 carrot, julienned",
        "1 cup snap peas",
        "1 cup mushrooms, sliced",
        "3 cloves garlic, minced",
        "1 tbsp fresh ginger, grated",
        "3 tbsp low-sodium soy sauce",
        "1 tbsp rice vinegar",
        "1 tbsp sesame oil",
        "1 tbsp cornstarch mixed with 2 tbsp water",
        "2 tbsp vegetable oil",
        "2 cups cooked brown rice",
        "Green onions and sesame seeds for garnish"
      ],
      steps: [
        "Press tofu to remove excess water, then cut into 1-inch cubes.",
        "Heat 1 tbsp vegetable oil in a large wok or pan over medium-high heat.",
        "Add tofu and cook until golden brown on all sides, about 5-7 minutes. Remove and set aside.",
        "Add remaining vegetable oil to the pan. Add garlic and ginger, stir for 30 seconds until fragrant.",
        "Add vegetables in order of firmness (carrots first, then broccoli, peppers, and finally mushrooms and snap peas), stirring frequently.",
        "Cook vegetables until crisp-tender, about 5-7 minutes.",
        "In a small bowl, whisk together soy sauce, rice vinegar, sesame oil, and cornstarch mixture.",
        "Return tofu to the pan, add the sauce, and stir to coat everything evenly.",
        "Cook for another 2 minutes until sauce thickens.",
        "Serve over brown rice, garnished with green onions and sesame seeds."
      ]
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
      tags: ["vegetarian", "high-carb"],
      ingredients: [
        "12 oz fettuccine or penne pasta",
        "1 cup cherry tomatoes, halved",
        "1 zucchini, diced",
        "1 yellow squash, diced",
        "1 red bell pepper, sliced",
        "1 cup asparagus, cut into 1-inch pieces",
        "1 cup broccoli florets",
        "1/2 cup frozen peas",
        "3 cloves garlic, minced",
        "1 small onion, diced",
        "2 tbsp olive oil",
        "1/2 cup heavy cream",
        "1/4 cup vegetable broth",
        "1/2 cup grated Parmesan cheese",
        "2 tbsp fresh basil, chopped",
        "1 tbsp fresh parsley, chopped",
        "1 tsp lemon zest",
        "Salt and pepper to taste",
        "Red pepper flakes (optional)"
      ],
      steps: [
        "Cook pasta according to package instructions until al dente. Reserve 1/2 cup pasta water before draining.",
        "Meanwhile, heat olive oil in a large skillet over medium-high heat.",
        "Add onion and cook until softened, about 3 minutes.",
        "Add garlic and cook for 30 seconds until fragrant.",
        "Add harder vegetables first (broccoli, asparagus) and cook for 3 minutes.",
        "Add bell pepper, zucchini, and yellow squash. Cook for another 3-4 minutes until all vegetables are tender-crisp.",
        "Add cherry tomatoes and frozen peas, cook for 1 minute.",
        "Reduce heat to medium-low, add heavy cream and vegetable broth, simmer for 2 minutes.",
        "Add drained pasta to the skillet along with half the Parmesan cheese and toss to combine.",
        "If needed, add reserved pasta water a little at a time to reach desired consistency.",
        "Stir in fresh herbs and lemon zest.",
        "Season with salt, pepper, and red pepper flakes if desired.",
        "Serve hot, garnished with remaining Parmesan cheese and additional fresh herbs."
      ]
    });
    
    // Additional dinner meals
    this.createMeal({
      name: "Beef and Broccoli Stir Fry",
      description: "Tender slices of beef with crisp broccoli in a savory soy-ginger sauce.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df",
      nutritionalInfo: {
        calories: 580,
        protein: 40,
        carbs: 32,
        fats: 32
      },
      tags: ["high-protein", "low-carb"],
      ingredients: [
        "1 lb flank steak, thinly sliced against the grain",
        "4 cups broccoli florets",
        "1 red bell pepper, sliced",
        "1 small onion, sliced",
        "3 cloves garlic, minced",
        "1 tbsp fresh ginger, grated",
        "1/4 cup low-sodium soy sauce",
        "2 tbsp oyster sauce",
        "1 tbsp honey",
        "1 tbsp rice vinegar",
        "1 tbsp cornstarch",
        "2 tbsp vegetable oil, divided",
        "1/2 cup beef broth",
        "2 cups cooked jasmine rice",
        "Sesame seeds and green onions for garnish"
      ],
      steps: [
        "In a bowl, mix soy sauce, oyster sauce, honey, rice vinegar, and cornstarch to make the sauce.",
        "Heat 1 tbsp oil in a large wok or skillet over high heat.",
        "Add beef in a single layer and cook for 2-3 minutes until browned. Work in batches if needed. Remove and set aside.",
        "Add remaining oil to the wok. Add garlic and ginger, stir for 30 seconds.",
        "Add broccoli, bell pepper, and onion. Stir-fry for 4-5 minutes until vegetables are crisp-tender.",
        "Return beef to the wok. Pour in the sauce and beef broth.",
        "Cook, stirring constantly, until sauce thickens, about 2 minutes.",
        "Serve over jasmine rice, garnished with sesame seeds and sliced green onions."
      ]
    });
    
    this.createMeal({
      name: "Baked Chicken Parmesan",
      description: "Crispy baked chicken cutlets topped with marinara sauce and melted mozzarella.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8",
      nutritionalInfo: {
        calories: 620,
        protein: 48,
        carbs: 42,
        fats: 28
      },
      tags: ["high-protein", "high-calorie"],
      ingredients: [
        "2 boneless, skinless chicken breasts, halved horizontally",
        "1/2 cup all-purpose flour",
        "2 large eggs, beaten",
        "1 cup panko breadcrumbs",
        "1/2 cup grated Parmesan cheese, divided",
        "1 tsp dried Italian herbs",
        "1/2 tsp garlic powder",
        "2 tbsp olive oil",
        "1 1/2 cups marinara sauce",
        "1 cup shredded mozzarella cheese",
        "2 tbsp fresh basil, chopped",
        "8 oz spaghetti or linguine pasta",
        "Salt and pepper to taste"
      ],
      steps: [
        "Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.",
        "Season chicken cutlets with salt and pepper on both sides.",
        "Set up breading station: flour in one dish, beaten eggs in another, and mix panko with 1/4 cup Parmesan, Italian herbs, and garlic powder in a third dish.",
        "Dredge each chicken piece in flour, then dip in egg, and finally coat in the panko mixture, pressing to adhere.",
        "Place breaded chicken on the baking sheet, drizzle with olive oil.",
        "Bake for 15 minutes, until golden and crispy.",
        "Meanwhile, cook pasta according to package directions.",
        "Remove chicken from oven, top each piece with marinara sauce and sprinkle with mozzarella and remaining Parmesan.",
        "Return to oven and bake for another 5-7 minutes, until cheese is melted and bubbly.",
        "Drain pasta and toss with a little olive oil or additional marinara sauce.",
        "Serve chicken over pasta, garnished with fresh basil."
      ]
    });
    
    this.createMeal({
      name: "Shrimp Scampi",
      description: "Succulent shrimp sautéed in a garlic butter sauce, served over linguine pasta.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1560717845-968823efbee1",
      nutritionalInfo: {
        calories: 580,
        protein: 32,
        carbs: 52,
        fats: 26
      },
      tags: ["high-protein", "seafood"],
      ingredients: [
        "1 lb large shrimp, peeled and deveined",
        "8 oz linguine pasta",
        "4 tbsp unsalted butter",
        "4 tbsp olive oil",
        "5 cloves garlic, minced",
        "1/4 tsp red pepper flakes",
        "1/4 cup dry white wine",
        "1 lemon, juiced and zested",
        "1/4 cup fresh parsley, chopped",
        "Salt and pepper to taste",
        "Grated Parmesan cheese for serving"
      ],
      steps: [
        "Cook linguine according to package instructions until al dente. Reserve 1/2 cup pasta water before draining.",
        "Meanwhile, pat shrimp dry with paper towels and season with salt and pepper.",
        "In a large skillet, heat 2 tbsp olive oil over medium-high heat.",
        "Add shrimp in a single layer and cook for 1-2 minutes per side until pink and just cooked through. Transfer to a plate.",
        "Reduce heat to medium-low, add remaining oil and butter to the skillet.",
        "Add garlic and red pepper flakes, cook for 1 minute until fragrant.",
        "Pour in white wine and lemon juice, simmer for 2-3 minutes until slightly reduced.",
        "Return shrimp to the skillet, add drained pasta and toss to combine.",
        "Add lemon zest, parsley, and additional pasta water if needed to loosen the sauce.",
        "Adjust seasoning with salt and pepper.",
        "Serve hot with grated Parmesan cheese on top."
      ]
    });
    
    this.createMeal({
      name: "Stuffed Bell Peppers",
      description: "Colorful bell peppers stuffed with a flavorful mixture of ground turkey, rice, and vegetables.",
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1603903631918-a6499746a72d",
      nutritionalInfo: {
        calories: 410,
        protein: 28,
        carbs: 40,
        fats: 16
      },
      tags: ["high-protein", "low-fat"],
      ingredients: [
        "4 large bell peppers (any color), tops removed and seeded",
        "1 lb lean ground turkey",
        "1 cup cooked brown rice",
        "1 small onion, diced",
        "2 cloves garlic, minced",
        "1 zucchini, diced",
        "1 cup canned diced tomatoes, drained",
        "1 tbsp tomato paste",
        "1 tsp dried oregano",
        "1 tsp ground cumin",
        "1/2 cup shredded mozzarella cheese",
        "2 tbsp olive oil",
        "1/4 cup fresh parsley, chopped",
        "Salt and pepper to taste"
      ],
      steps: [
        "Preheat oven to 375°F (190°C).",
        "Bring a large pot of water to a boil. Add bell peppers and cook for 3-5 minutes until slightly softened. Drain and set aside.",
        "Heat olive oil in a large skillet over medium heat. Add onion and cook until softened, about 3 minutes.",
        "Add garlic and cook for another 30 seconds until fragrant.",
        "Add ground turkey, breaking it up with a spoon, and cook until no longer pink, about 5-7 minutes.",
        "Stir in zucchini, diced tomatoes, tomato paste, oregano, cumin, salt, and pepper. Cook for 3-4 minutes.",
        "Remove from heat and stir in cooked rice and half the parsley.",
        "Place bell peppers in a baking dish. Fill each pepper with the turkey and rice mixture.",
        "Top with shredded mozzarella cheese.",
        "Cover with foil and bake for 25 minutes. Remove foil and bake for another 10 minutes until cheese is golden and bubbly.",
        "Garnish with remaining parsley before serving."
      ]
    });
  }
}

export const storage = new MemStorage();

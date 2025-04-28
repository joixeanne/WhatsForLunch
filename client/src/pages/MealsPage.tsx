import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useParams } from "wouter";
import { MealCard } from "@/components/ui/meal-card";
import { pageTransition, staggerContainer } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { Meal } from "@shared/schema";

export default function MealsPage() {
  const [, navigate] = useLocation();
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: meals = [], isLoading } = useQuery({
    queryKey: [`/api/meals/${category}`],
  });

  useEffect(() => {
    if (meals.length) {
      let result = [...meals];

      // Apply search filter
      if (searchTerm) {
        result = result.filter(
          (meal: Meal) =>
            meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply category filter (vegetarian, high protein, low carb)
      if (activeFilter !== "all") {
        if (activeFilter === "vegetarian") {
          result = result.filter((meal: Meal) => meal.tags.includes("vegetarian"));
        } else if (activeFilter === "high-protein") {
          result = result.filter((meal: Meal) => meal.nutritionalInfo.protein >= 25);
        } else if (activeFilter === "low-carb") {
          result = result.filter((meal: Meal) => meal.nutritionalInfo.carbs <= 30);
        }
      }

      // Apply sorting
      if (sortBy === "calories-asc") {
        result.sort((a: Meal, b: Meal) => a.nutritionalInfo.calories - b.nutritionalInfo.calories);
      } else if (sortBy === "calories-desc") {
        result.sort((a: Meal, b: Meal) => b.nutritionalInfo.calories - a.nutritionalInfo.calories);
      } else if (sortBy === "protein-desc") {
        result.sort((a: Meal, b: Meal) => b.nutritionalInfo.protein - a.nutritionalInfo.protein);
      }

      setFilteredMeals(result);
    }
  }, [meals, searchTerm, sortBy, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16 px-4"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="font-bold text-3xl md:text-4xl capitalize">{category} Meals</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              onClick={() => navigate("/categories")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </Button>
            <div className="relative w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-auto focus:ring-2 focus:ring-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm font-medium ${
                activeFilter === "all" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "vegetarian" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm font-medium ${
                activeFilter === "vegetarian" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleFilterChange("vegetarian")}
            >
              Vegetarian
            </Button>
            <Button
              variant={activeFilter === "high-protein" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm font-medium ${
                activeFilter === "high-protein" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleFilterChange("high-protein")}
            >
              High Protein
            </Button>
            <Button
              variant={activeFilter === "low-carb" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm font-medium ${
                activeFilter === "low-carb" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleFilterChange("low-carb")}
            >
              Low Carb
            </Button>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="calories-asc">Calories (Low to High)</SelectItem>
              <SelectItem value="calories-desc">Calories (High to Low)</SelectItem>
              <SelectItem value="protein-desc">Highest Protein</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
            variants={staggerContainer}
          >
            {filteredMeals.length > 0 ? (
              filteredMeals.map((meal: Meal, index: number) => (
                <MealCard key={meal.id} meal={meal} delay={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No meals found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

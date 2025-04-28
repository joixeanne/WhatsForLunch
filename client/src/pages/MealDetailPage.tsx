import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Meal } from "@shared/schema";
import { pageTransition, fadeIn, slideUp } from "@/lib/animations";

export default function MealDetailPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  const { data: meal, isLoading, isError } = useQuery({
    queryKey: [`/api/meal/${id}`],
  });
  
  // Redirect to meals page if there's an error or no ID
  useEffect(() => {
    if (isError) {
      navigate("/categories");
    }
  }, [isError, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!meal) {
    return null; // This will be handled by the useEffect above
  }
  
  const mealData = meal as Meal;
  
  const handleBack = () => {
    navigate(`/meals/${mealData.category.toLowerCase()}`);
  };
  
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-16 px-4"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="outline"
          className="mb-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
          onClick={handleBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Meals
        </Button>
        
        <motion.div 
          className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden"
          variants={fadeIn}
        >
          <div className="relative h-64 sm:h-80 md:h-96">
            <img 
              src={mealData.imageUrl} 
              alt={mealData.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{mealData.name}</h1>
              <div className="flex flex-wrap gap-2">
                {mealData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-primary/80 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{mealData.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Nutritional Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-accent/30 dark:bg-accent/20 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-gray-800 dark:text-white">{mealData.nutritionalInfo.calories}</span>
                  <span className="text-gray-600 dark:text-gray-400">Calories</span>
                </div>
                <div className="bg-secondary/30 dark:bg-secondary/20 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-gray-800 dark:text-white">{mealData.nutritionalInfo.protein}g</span>
                  <span className="text-gray-600 dark:text-gray-400">Protein</span>
                </div>
                <div className="bg-primary/20 dark:bg-primary/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-gray-800 dark:text-white">{mealData.nutritionalInfo.carbs}g</span>
                  <span className="text-gray-600 dark:text-gray-400">Carbs</span>
                </div>
                <div className="bg-[#5D3A00]/20 dark:bg-[#5D3A00]/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-gray-800 dark:text-white">{mealData.nutritionalInfo.fats}g</span>
                  <span className="text-gray-600 dark:text-gray-400">Fats</span>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="mb-8"
              variants={slideUp}
            >
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              {mealData.ingredients && mealData.ingredients.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5">
                  {mealData.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 list-disc">{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No ingredients information available.</p>
              )}
            </motion.div>
            
            <motion.div 
              variants={slideUp}
            >
              <h2 className="text-2xl font-semibold mb-4">Preparation Steps</h2>
              {mealData.steps && mealData.steps.length > 0 ? (
                <ol className="space-y-4 pl-5">
                  {mealData.steps.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <div className="flex">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No preparation steps available.</p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
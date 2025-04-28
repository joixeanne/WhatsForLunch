import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CategoryCard } from "@/components/ui/category-card";
import { pageTransition, staggerContainer } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";

export default function CategoriesPage() {
  const [, navigate] = useLocation();
  
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  return (
    <motion.div 
      className="min-h-screen pt-24 pb-16 px-4"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-bold text-3xl md:text-4xl mb-8 text-center">Choose a Meal Category</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
          >
            {categories.map((category: any) => (
              <CategoryCard
                key={category.id}
                title={category.name}
                description={category.description}
                imageUrl={category.imageUrl}
                mealCount={category.mealCount}
                category={category.slug}
              />
            ))}
          </motion.div>
        )}
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold"
            onClick={() => navigate("/")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

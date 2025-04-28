import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Meal } from "@shared/schema";

type MealCardProps = {
  meal: Meal;
  delay?: number;
  isVisible?: boolean;
};

export function MealCard({ meal, delay = 0, isVisible = true }: MealCardProps) {
  const [, navigate] = useLocation();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: "easeOut" 
      }
    }
  };
  
  const handleClick = () => {
    navigate(`/meal/${meal.id}`);
  };
  
  return (
    <motion.div
      className={`bg-white dark:bg-[#1E1E1E] rounded-lg shadow-md overflow-hidden cursor-pointer ${isVisible ? "" : "hidden"}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <img src={meal.imageUrl} alt={meal.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-xl">{meal.name}</h3>
          <div className="bg-primary/20 text-primary dark:bg-primary/10 dark:text-primary rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{meal.description}</p>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Nutritional Facts</h4>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="text-center bg-accent/30 dark:bg-accent/20 p-2 rounded">
              <span className="block font-bold text-gray-800 dark:text-white">{meal.nutritionalInfo.calories}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Calories</span>
            </div>
            <div className="text-center bg-secondary/30 dark:bg-secondary/20 p-2 rounded">
              <span className="block font-bold text-gray-800 dark:text-white">{meal.nutritionalInfo.protein}g</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Protein</span>
            </div>
            <div className="text-center bg-primary/20 dark:bg-primary/10 p-2 rounded">
              <span className="block font-bold text-gray-800 dark:text-white">{meal.nutritionalInfo.carbs}g</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Carbs</span>
            </div>
            <div className="text-center bg-[#5D3A00]/20 dark:bg-[#5D3A00]/10 p-2 rounded">
              <span className="block font-bold text-gray-800 dark:text-white">{meal.nutritionalInfo.fats}g</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Fats</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

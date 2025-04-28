import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { pageTransition, fadeIn, slideUp } from "@/lib/animations";

export default function HomePage() {
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    navigate("/categories");
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center pt-16 pb-8 relative overflow-hidden"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/20 dark:from-chocolate/20 dark:to-primary/10 z-0"></div>
      
      <motion.div 
        className="z-10 text-center px-4"
        variants={fadeIn}
      >
        <h1 className="font-bold text-5xl md:text-7xl mb-6 text-primary">What's for Lunch</h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
          Discover delicious meals for every time of day with nutritional information at your fingertips.
        </p>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </motion.div>

      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 z-10"
        variants={fadeIn}
      >
        <motion.div 
          className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-md p-6 text-center"
          variants={slideUp}
          custom={0}
        >
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd" alt="Healthy meal" className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="font-semibold text-xl mb-2">Discover Recipes</h3>
          <p className="text-gray-600 dark:text-gray-300">Browse hundreds of meal options for breakfast, lunch, and dinner.</p>
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-md p-6 text-center"
          variants={slideUp}
          custom={1}
        >
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061" alt="Food preparation" className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="font-semibold text-xl mb-2">Nutritional Info</h3>
          <p className="text-gray-600 dark:text-gray-300">Get detailed nutritional facts for every meal to make healthy choices.</p>
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-md p-6 text-center"
          variants={slideUp}
          custom={2}
        >
          <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352" alt="Food variety" className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="font-semibold text-xl mb-2">Meal Planning</h3>
          <p className="text-gray-600 dark:text-gray-300">Plan your meals ahead of time for a balanced and healthy diet.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

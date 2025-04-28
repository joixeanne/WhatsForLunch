import { motion } from "framer-motion";
import { useLocation } from "wouter";

type CategoryCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  mealCount: number;
  category: string;
};

export function CategoryCard({ title, description, imageUrl, mealCount, category }: CategoryCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/meals/${category.toLowerCase()}`);
  };

  return (
    <motion.div
      className="category-card bg-white dark:bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="relative h-48">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-2xl">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="text-primary font-semibold">{mealCount} meals</span>
        <span className="text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
}

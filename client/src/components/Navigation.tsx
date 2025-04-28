import { useLocation } from "wouter";
import { ThemeToggle } from "./ui/theme-toggle";
import { motion } from "framer-motion";

export default function Navigation() {
  const [location] = useLocation();
  
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-sm dark:bg-dark-bg dark:bg-opacity-95 transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-primary font-bold text-2xl">What's for Lunch</a>
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}

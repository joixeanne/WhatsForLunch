import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-white dark:bg-[#1E1E1E] py-4 mt-auto transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          All rights reserved. De Leon, Matnao, Mendoza 2025
        </p>
      </div>
    </motion.footer>
  );
}
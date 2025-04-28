import { Moon, Sun } from "lucide-react";
import { useThemeToggle } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useThemeToggle();

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="relative inline-flex h-6 w-11 items-center rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.div>
    </div>
  );
}

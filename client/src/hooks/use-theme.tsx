import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Only return the current theme if the component has mounted to avoid hydration mismatch
  return { 
    theme: mounted ? theme : undefined,
    toggleTheme,
    isDarkMode: mounted && theme === "dark"
  };
}

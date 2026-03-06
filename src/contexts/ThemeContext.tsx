import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "dark";
  });

  useEffect(() => {

    if (typeof document !== "undefined") {
      document.body.setAttribute("data-theme", theme);
    }

    localStorage.setItem("theme", theme);

  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {

  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
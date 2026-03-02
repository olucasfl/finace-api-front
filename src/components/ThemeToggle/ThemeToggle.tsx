import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggle} onClick={toggleTheme}>
      {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      {theme === "dark" ? "Escuro" : "Claro"}
    </button>
  );
}
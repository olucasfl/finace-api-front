import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark');
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    if (dark) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDark(!dark);
  }

  return (
    <button className={styles.toggle} onClick={toggleTheme}>
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
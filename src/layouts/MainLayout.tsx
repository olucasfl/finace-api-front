import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-fintech-bg transition-colors">
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-primary">Finance App</h1>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-white dark:bg-fintech-card shadow"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="p-6">{children}</main>
    </div>
  )
}
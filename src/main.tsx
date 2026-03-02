import { BrowserRouter } from "react-router-dom";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/global.css";

function GlobalNumberFix() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const active = document.activeElement as HTMLInputElement;

      if (active?.type === "number") {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <GlobalNumberFix />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
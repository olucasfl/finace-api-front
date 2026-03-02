import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BudgetDetails from "./pages/BudgetDetails/BudgetDetails";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets/:id"
          element={
            <ProtectedRoute>
              <BudgetDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
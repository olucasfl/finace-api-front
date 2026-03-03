import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BudgetDetails from "./pages/BudgetDetails/BudgetDetails";
import BudgetAnalytics from "./pages/BudgetAnalytics/BudgetAnalytics";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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

        <Route path="/budgets/:id/analytics" element={<BudgetAnalytics />} />
      </Routes>
    </>
  );
}

export default App;
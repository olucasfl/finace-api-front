import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import BudgetDetails from "./pages/BudgetDetails/BudgetDetails";
import BudgetAnalytics from "./pages/BudgetAnalytics/BudgetAnalytics";

import ProtectedRoute from "./components/ProtectedRoute";
import Splash from "./components/Splash/Splash";

function App() {

  const token = localStorage.getItem("access_token");

  return (

    <Splash>

      <Routes>

        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

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

        <Route
          path="/budgets/:id/analytics"
          element={
            <ProtectedRoute>
              <BudgetAnalytics />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Splash>

  );

}

export default App;
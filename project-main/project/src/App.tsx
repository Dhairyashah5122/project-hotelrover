import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginForm } from "./components/LoginForm";
import { HotelsPage } from "./pages/HotelsPage";
import { HousekeepersPage } from "./pages/HousekeepersPage";
import { AssignmentsPage } from "./pages/AssignmentsPage";
import { ShiftsPage } from "./pages/ShiftsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SignUpForm } from "./components/Signup";
import { Logout } from "./components/Logout";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/signup" element={<SignUpForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/hotels" replace />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="housekeepers" element={<HousekeepersPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

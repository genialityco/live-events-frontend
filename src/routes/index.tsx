// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import OrganizationsPage from "../pages/OrganizationsPage";
import OrganizationEventsPage from "../pages/OrganizationEventsPage";
import EventAdminPage from "../pages/EventAdminPage";

import { Center, Loader } from "@mantine/core";
import { useAuth } from "../auth/useAuth";
import LoginPage from "../pages/LoginPage";
import AdminUsersPage from "../pages/AdminUsersPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin-users" element={<AdminUsersPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <OrganizationsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/organizations/:id/events"
        element={
          <RequireAuth>
            <OrganizationEventsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/events/:eventId/admin"
        element={
          <RequireAuth>
            <EventAdminPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

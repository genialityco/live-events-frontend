// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import OrganizationsPage from "../pages/user-menu/OrganizationsPage";
import OrgLayout from "../layouts/OrgLayout";
import EventPublicPage from "../pages/event-user/EventPublicPage";
import OrgPublicLanding from "../pages/org-user/OrgPublicLanding";
import OrgAdminDashboardLayout from "../pages/org-admin/OrgAdminDashboardLayout";
import AdminBranding from "../pages/org-admin/AdminBranding";
import AdminAppearance from "../pages/org-admin/AdminAppearance";
import AdminInfo from "../pages/org-admin/AdminInfo";
import AdminMembers from "../pages/org-admin/AdminMembers";
import AdminEvents from "../pages/org-admin/AdminEvents";
import EventAdminLayout from "../pages/event-admin/EventAdminLayout";
import EventAdminAttendees from "../pages/event-admin/EventAdminAttendees";
import EventAdminMail from "../pages/event-admin/EventAdminMail";
import EventAdminSettings from "../pages/event-admin/EventAdminSettings";
import EventAdminLoginLink from "../pages/event-admin/EventAdminLoginLink";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/organizations" element={<OrganizationsPage />} />

      <Route path="/organizations/:orgId" element={<OrgLayout />}>
        {/* Pública */}
        <Route index element={<OrgPublicLanding />} />

        {/* Mini “AppShell” del Admin */}
        <Route path="admin" element={<OrgAdminDashboardLayout />}>
          <Route index element={<Navigate to="events" replace />} />
          <Route path="settings/branding" element={<AdminBranding />} />
          <Route path="settings/appearance" element={<AdminAppearance />} />
          <Route path="settings/info" element={<AdminInfo />} />
          <Route path="members" element={<AdminMembers />} />
          {/* Atajo a la lista de eventos admin de esta organización */}
          <Route path="events" element={<AdminEvents />} />
        </Route>

        {/* Mini AppShell del Evento */}
        <Route path="events/:eventId/admin" element={<EventAdminLayout />}>
          <Route index element={<Navigate to="attendees" replace />} />
          <Route path="attendees" element={<EventAdminAttendees />} />
          <Route path="mail" element={<EventAdminMail />} />
          <Route path="settings" element={<EventAdminSettings />} />
          <Route path="login-link" element={<EventAdminLoginLink />} />
        </Route>

        {/* Eventos (público y admin por evento) */}
        <Route path="events/:eventId" element={<EventPublicPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

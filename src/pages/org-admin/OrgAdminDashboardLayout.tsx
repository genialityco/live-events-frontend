// src/pages/org-admin/OrgAdminDashboardLayout.tsx
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Group, Stack, NavLink, Title, Box } from "@mantine/core";
import {
  IconSettings,
  IconBrush,
  IconInfoCircle,
  IconUsers,
  IconCalendarEvent,
} from "@tabler/icons-react";

export default function OrgAdminDashboardLayout() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const base = `/organizations/${orgId}/admin`;

  const items = [
    {
      label: "Eventos",
      to: `${base}/events`,
      icon: <IconCalendarEvent size={16} />,
    },
    {
      label: "Branding - P",
      to: `${base}/settings/branding`,
      icon: <IconBrush size={16} />,
    },
    {
      label: "Apariencia - P",
      to: `${base}/settings/appearance`,
      icon: <IconSettings size={16} />,
    },
    {
      label: "Información - P",
      to: `${base}/settings/info`,
      icon: <IconInfoCircle size={16} />,
    },
    { label: "Miembros - P", to: `${base}/members`, icon: <IconUsers size={16} /> },
  ];

  return (
    <Group align="flex-start" gap="md" wrap="nowrap">
      {/* Sidebar */}
      <Card withBorder radius="md" w={{ base: "100%", sm: 260 }} p="sm">
        <Stack gap="xs">
          <Title order={5} mb="xs">
            Configuración
          </Title>
          {items.map((it) => (
            <NavLink
              key={it.to}
              label={it.label}
              leftSection={it.icon}
              active={location.pathname === it.to}
              onClick={() => navigate(it.to)}
            />
          ))}
        </Stack>
      </Card>

      {/* Contenido */}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Card withBorder radius="md" p="md">
          <Outlet />
        </Card>
      </Box>
    </Group>
  );
}

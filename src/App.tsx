// src/App.tsx
import "@mantine/core/styles.css";
import {
  AppShell,
  Group,
  Title,
  Menu,
  Avatar,
  Text,
  Image,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes";
import { useAuth } from "./auth/useAuth";
import {
  IconBuildingStore,
  IconCalendarEvent,
  IconHome,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { OrgBrandingProvider, useOrgBranding } from "./brand";

function HeaderBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { branding } = useOrgBranding();

  const goHome = () => navigate("/");

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group
          gap="sm"
          onClick={
            branding.orgId
              ? () => navigate(`/organizations/${branding.orgId}`)
              : goHome
          }
          style={{ cursor: "pointer" }}
        >
          {branding.logoUrl ? (
            <Image
              src={branding.logoUrl}
              alt={branding.name ?? "Logo"}
              h={24}
              fit="contain"
            />
          ) : null}
          <Title order={4}>{branding.name ?? "Mi Panel"}</Title>
        </Group>

        <Group gap="xs">
          <Menu shadow="md">
            <Menu.Target>
              <Group gap={6} style={{ cursor: "pointer" }}>
                <Avatar
                  radius="xl"
                  size={28}
                  src={user?.photoURL ?? undefined}
                />
                <Text size="sm">{user?.email ?? "Cuenta"}</Text>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Mi cuenta</Menu.Label>

              <Menu.Item onClick={goHome} leftSection={<IconHome size={16} />}>
                Inicio
              </Menu.Item>

              <Menu.Item
                onClick={() => navigate("/organizations")}
                leftSection={<IconBuildingStore size={16} />}
              >
                Mis Organizaciones
              </Menu.Item>

              <Menu.Item
                onClick={() => navigate("/events")}
                leftSection={<IconCalendarEvent size={16} />}
              >
                Mis Eventos
              </Menu.Item>

              <Menu.Item
                onClick={() => navigate("/profile")}
                leftSection={<IconUser size={16} />}
              >
                Perfil
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                onClick={logout}
                leftSection={<IconLogout size={16} />}
              >
                Cerrar sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default function App() {
  return (
    <OrgBrandingProvider>
      <AppShell header={{ height: 56 }} padding="md">
        <HeaderBar />
        <AppShell.Main>
          <AppRoutes />
        </AppShell.Main>
      </AppShell>
    </OrgBrandingProvider>
  );
}

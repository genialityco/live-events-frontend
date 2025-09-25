// src/App.tsx
import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  Group,
  Title,
  NavLink,
  ScrollArea,
  Button,
  Menu,
  Avatar,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes";
import { useAuth } from "./auth/useAuth";

export default function App() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title
              order={4}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Mi Panel
            </Title>
          </Group>

          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              onClick={() => navigate("/")}
              hiddenFrom="xs"
            >
              Inicio
            </Button>

            <Menu shadow="md" width={220}>
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
                <Menu.Item onClick={() => navigate("/")}>
                  Mis organizaciones
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={logout}>
                  Cerrar sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <ScrollArea type="auto" style={{ height: "100%" }}>
          <NavLink
            label="Organizaciones"
            component={Link}
            to="/"
            active={location.pathname === "/"}
            onClick={close}
          />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <AppRoutes />
      </AppShell.Main>
    </AppShell>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Group,
  Stack,
  NavLink,
  Title,
  Box,
  Text,
  Button,
} from "@mantine/core";
import {
  IconUsers,
  IconMail,
  IconSettings,
  IconLink,
  IconArrowUpRight,
  IconIdBadge2,
  IconPalette,
  IconToggleLeft,
  IconTicket,
} from "@tabler/icons-react";
import { useEffect, useState, useMemo } from "react";
import { fetchEventById } from "../../services/eventsService";

export default function EventAdminLayout() {
  const { orgId, eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [eventName, setEventName] = useState<string>("Evento");

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const ev = await fetchEventById(eventId!);
        setEventName(ev?.name ?? "Evento");
      } catch {
        setEventName("Evento");
      }
    })();
  }, [eventId]);

  const base = `/organizations/${orgId}/events/${eventId}/admin`;
  const settingsBase = `${base}/settings`;

  // URL pública del evento
  const publicUrl = useMemo(() => {
    if (!orgId || !eventId) return "#";
    return `${window.location.origin}/organizations/${orgId}/events/${eventId}`;
  }, [orgId, eventId]);

  // Helper para "activo"
  const isActive = (to: string) => location.pathname === to;
  const isInSection = (prefix: string) =>
    location.pathname.startsWith(prefix + "/") || location.pathname === prefix;

  const sidebarItems = [
    {
      label: "Asistentes",
      to: `${base}/attendees`,
      icon: <IconUsers size={16} />,
    },
    {
      label: "Enviar correo",
      to: `${base}/mail`,
      icon: <IconMail size={16} />,
    },
    {
      label: "Configuración general",
      to: settingsBase,
      icon: <IconSettings size={16} />,
      children: [
        {
          label: "Datos del evento",
          to: `${settingsBase}/details`,
          icon: <IconIdBadge2 size={14} />,
        },
        {
          label: "Apariencia del evento",
          to: `${settingsBase}/appearance`,
          icon: <IconPalette size={14} />,
        },
        {
          label: "Habilitar secciones del evento",
          to: `${settingsBase}/sections`,
          icon: <IconToggleLeft size={14} />,
        },
        {
          label: "Configuración de tickets",
          to: `${settingsBase}/tickets`,
          icon: <IconTicket size={14} />,
        },
      ],
    },
    {
      label: "Link de ingreso",
      to: `${base}/login-link`,
      icon: <IconLink size={16} />,
    },
  ] as const;

  return (
    <Stack gap="md">
      {/* Header local del mini shell */}
      <Card withBorder radius="md" p="md">
        <Group justify="space-between" align="center">
          <Title order={3}>{eventName}</Title>

          <Group gap="sm">
            <Text c="dimmed" size="sm">
              ID: {eventId}
            </Text>
            <Button
              variant="light"
              rightSection={<IconArrowUpRight size={16} />}
              component="a"
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              disabled={publicUrl === "#"}
            >
              Ir al evento
            </Button>
          </Group>
        </Group>
      </Card>

      <Group align="flex-start" gap="md" wrap="nowrap">
        {/* Sidebar */}
        <Card withBorder radius="md" w={{ base: "100%", sm: 260 }} p="sm">
          <Stack gap="xs">
            <Title order={5} mb="xs">
              Administración del evento
            </Title>

            {sidebarItems.map((item) => {
              const hasChildren =
                "children" in item && Array.isArray(item.children);
              if (!hasChildren) {
                return (
                  <NavLink
                    key={item.to}
                    label={item.label}
                    leftSection={item.icon}
                    active={isActive(item.to)}
                    onClick={() => navigate(item.to)}
                  />
                );
              }

              // NavLink con submenu
              const opened = isInSection(item.to);
              const anyChildActive =
                opened &&
                (item as any).children.some((child: any) => isActive(child.to));

              return (
                <NavLink
                  key={item.to}
                  label={item.label}
                  leftSection={item.icon}
                  active={anyChildActive || isActive(item.to)}
                  opened={opened}
                  onClick={() => {
                    // Si está en otra sección y clicas el padre, te lleva al root de settings
                    if (!opened) navigate(item.to);
                  }}
                >
                  {(item as any).children.map((child: any) => (
                    <NavLink
                      key={child.to}
                      label={child.label}
                      leftSection={child.icon}
                      active={isActive(child.to)}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(child.to);
                      }}
                    />
                  ))}
                </NavLink>
              );
            })}
          </Stack>
        </Card>

        {/* Contenido */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Card withBorder radius="md" p="md">
            <Outlet />
          </Card>
        </Box>
      </Group>
    </Stack>
  );
}

// src/pages/org-admin/AdminEvents.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEventsByOrganizerId } from "../../services/eventsService";
import type { Event } from "../../types/Event";
import {
  Table,
  Loader,
  Center,
  Title,
  Paper,
  Group,
  Button,
} from "@mantine/core";

export default function AdminEvents() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    (async () => {
      try {
        const data = await fetchEventsByOrganizerId(orgId);
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.datetime_from).getTime() -
            new Date(a.datetime_from).getTime()
        );
        setEvents(sorted);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId]);

  if (loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Paper>
      <Group mb="md" justify="space-between">
        <Title order={2}>Eventos de la organización</Title>
        {/* Aquí podrías agregar "Crear evento" si aplica */}
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Fecha</Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {events.map((event) => (
            <Table.Tr key={event._id}>
              <Table.Td>
                {new Date(event.datetime_from).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Table.Td>
              <Table.Td>{event.name}</Table.Td>
              <Table.Td>
                <Button
                  size="xs"
                  variant="subtle"
                  color="blue"
                  onClick={() =>
                    navigate(
                      `/organizations/${orgId}/events/${event._id}/admin`
                    )
                  }
                >
                  Ver
                </Button>
                {/* Link público opcional */}
                {/* <Button
                  size="xs"
                  variant="light"
                  onClick={() =>
                    navigate(`/organizations/${orgId}/events/${event._id}`)
                  }
                >
                  Público
                </Button> */}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

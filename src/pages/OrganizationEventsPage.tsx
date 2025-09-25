import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEventsByOrganizerId } from "../services/eventsService";
import type { Event } from "../types/Event";
import {
  Table,
  Loader,
  Center,
  Title,
  Paper,
  Group,
  Button,
} from "@mantine/core";

export default function OrganizationEventsPage() {
  const { id: organizerId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizerId) {
      fetchEventsByOrganizerId(organizerId)
        .then(setEvents)
        .finally(() => setLoading(false));
    }
  }, [organizerId]);

  if (loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group mb="md" justify="space-between">
        <Title order={2}>Eventos de la organización</Title>
      </Group>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {events.map((event) => (
            <Table.Tr key={event._id}>
              <Table.Td>{event.name}</Table.Td>
              <Table.Td>
                <Button
                  size="xs"
                  variant="subtle"
                  color="blue"
                  onClick={() => navigate(`/events/${event._id}/admin`)}
                >
                  Ver
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

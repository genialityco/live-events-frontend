/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/event-user/EventPublicPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEventById } from "../../services/eventsService";
import {
  Paper,
  Title,
  Text,
  Loader,
  Center,
  Group,
  Button,
} from "@mantine/core";

export default function EventPublicPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const data = await fetchEventById(eventId);
        setEvent(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  if (loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!event) {
    return <Center>No se encontró el evento.</Center>;
  }

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Title order={2}>{event.name}</Title>
      <Text c="dimmed" mt="xs">
        {new Date(event.datetime_from).toLocaleString("es-ES")}
      </Text>

      <Text mt="md">{event.description ?? "Descripción del evento..."}</Text>

      <Group mt="lg">
        <Button>Registrarme</Button>
        {/* Botones extra: compartir, ver ubicación, etc. */}
      </Group>
    </Paper>
  );
}

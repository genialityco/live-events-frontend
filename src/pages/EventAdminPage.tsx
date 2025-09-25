/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { Title, Paper, Tabs, Group, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchEventById } from "../services/eventsService";
import SendEventEmail from "../components/SendEventEmail";
import EventUsersPaginatedSelector from "../components/EventUsersTable";
import GenerateSimpleLoginLink from "../components/GenerateSimpleLoginLink";

export default function EventAdminPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId).then((data: any) => {
        setEvent(data);
        setLoading(false);
      });
    }
  }, [eventId]);

  if (!eventId) return <Text>Falta el ID del evento</Text>;
  if (loading) return <Loader />;

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group mb="md" justify="space-between">
        <Title order={2}>Administración del Evento</Title>
        <div>ID: {eventId}</div>
      </Group>
      <Tabs defaultValue="users">
        <Tabs.List>
          <Tabs.Tab value="users">Asistentes</Tabs.Tab>
          <Tabs.Tab value="mail">Enviar correo</Tabs.Tab>
          <Tabs.Tab value="settings">Configuraciones</Tabs.Tab>
          <Tabs.Tab value="login">Generar link de ingreso</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users">
          <EventUsersPaginatedSelector
            eventId={eventId}
            selected={selectedUserIds}
            setSelected={setSelectedUserIds}
          />
        </Tabs.Panel>
        <Tabs.Panel value="mail">
          <SendEventEmail eventId={eventId} event={event} />
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <div>Próximamente: otras configuraciones…</div>
        </Tabs.Panel>

        <Tabs.Panel value="login">
          <GenerateSimpleLoginLink defaultEventId={eventId} />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}

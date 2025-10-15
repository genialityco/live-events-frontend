/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { Loader, Center, Title, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchEventById } from "../../services/eventsService";
import SendEventEmail from "../../components/SendEventEmail";

export default function EventAdminMail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      const data = await fetchEventById(eventId);
      setEvent(data);
      setLoading(false);
    })();
  }, [eventId]);

  if (!eventId) return <div>Falta el ID del evento</div>;
  if (loading)
    return (
      <Center h={200}>
        <Loader />
      </Center>
    );

  return (
    <Stack>
      <Title order={4}>Enviar correo</Title>
      <SendEventEmail eventId={eventId} event={event} />
    </Stack>
  );
}

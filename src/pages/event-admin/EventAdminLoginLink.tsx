import { useParams } from "react-router-dom";
import { Title, Stack } from "@mantine/core";
import GenerateSimpleLoginLink from "../../components/GenerateSimpleLoginLink";

export default function EventAdminLoginLink() {
  const { eventId } = useParams();

  if (!eventId) return <div>Falta el ID del evento</div>;

  return (
    <Stack>
      <Title order={4}>Generar link de ingreso</Title>
      <GenerateSimpleLoginLink defaultEventId={eventId} />
    </Stack>
  );
}

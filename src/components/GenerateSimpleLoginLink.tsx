// src/components/GenerateSimpleLoginLink.tsx
import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Stack,
  CopyButton,
  Tooltip,
  Code,
  Alert,
} from "@mantine/core";
import { IconCheck, IconCopy, IconInfoCircle } from "@tabler/icons-react";
import { buildLoginLink } from "../utils/buildLoginLink";

type Props = {
  defaultEventId?: string;
};

export default function GenerateSimpleLoginLink({ defaultEventId }: Props) {
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    const theEventId = (eventId || defaultEventId || "").trim();
    const theEmail = email.trim();

    if (!theEmail) return;
    if (!theEventId) return;

    setLoading(true);
    const link = buildLoginLink({
      email: theEmail,
      event_id: theEventId,
    });
    setUrl(link);
    setLoading(false);
  };

  return (
    <Stack gap="md">
      <Alert variant="light" color="blue" icon={<IconInfoCircle size={18} />}>
        Si se deja vacío el <b>ID del evento</b>, se usará el que viene en la URL
        de esta página.
      </Alert>

      <TextInput
        label="Correo del asistente"
        placeholder="usuario@correo.com"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        withAsterisk
      />

      <TextInput
        label="ID del evento (opcional)"
        placeholder={
          defaultEventId
            ? `Usando: ${defaultEventId}`
            : "6866994b85d24cf121026782"
        }
        value={eventId}
        onChange={(e) => setEventId(e.currentTarget.value)}
      />

      <Group>
        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={!email && !eventId}
        >
          Generar link de ingreso
        </Button>

        {url && (
          <CopyButton value={url}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "¡Copiado!" : "Copiar"} withArrow>
                <Button
                  variant="light"
                  onClick={copy}
                  leftSection={
                    copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                  }
                >
                  {copied ? "Copiado" : "Copiar link"}
                </Button>
              </Tooltip>
            )}
          </CopyButton>
        )}
      </Group>

      {url && (
        <Stack gap={6}>
          <div>Link generado:</div>
          <Code fz="sm" style={{ wordBreak: "break-all" }}>
            {url}
          </Code>
          <Button variant="subtle" component="a" href={url} target="_blank">
            Abrir link
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

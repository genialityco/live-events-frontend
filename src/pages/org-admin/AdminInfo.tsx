// src/pages/org-admin/AdminInfo.tsx
import {
  Stack,
  Title,
  TextInput,
  Textarea,
  Group,
  Button,
} from "@mantine/core";
import { useState } from "react";

export default function AdminInfo() {
  const [displayName, setDisplayName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [address, setAddress] = useState("");

  return (
    <Stack>
      <Title order={3}>Información</Title>
      <TextInput
        label="Nombre comercial"
        value={displayName}
        onChange={(e) => setDisplayName(e.currentTarget.value)}
      />
      <Textarea
        label="Descripción"
        minRows={3}
        value={shortDesc}
        onChange={(e) => setShortDesc(e.currentTarget.value)}
      />
      <TextInput
        label="Dirección"
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      />
      <Group justify="flex-end">
        <Button>Guardar</Button>
      </Group>
    </Stack>
  );
}

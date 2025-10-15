// src/pages/org-admin/AdminAppearance.tsx
import { Stack, Title, ColorInput, Group, Button, Switch } from "@mantine/core";
import { useState } from "react";

export default function AdminAppearance() {
  const [primary, setPrimary] = useState("#0ea5e9");
  const [dark, setDark] = useState(false);

  return (
    <Stack>
      <Title order={3}>Apariencia</Title>
      <ColorInput
        label="Color principal"
        value={primary}
        onChange={setPrimary}
        format="hex"
      />
      <Switch
        label="Usar tema oscuro"
        checked={dark}
        onChange={(e) => setDark(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button>Guardar</Button>
      </Group>
    </Stack>
  );
}

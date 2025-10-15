// src/pages/org-admin/AdminBranding.tsx
import {
  Button,
  Group,
  TextInput,
  Stack,
  Title,
  Image,
} from "@mantine/core";
import { useState } from "react";
import { useOrgBranding } from "../../brand";

export default function AdminBranding() {
  const { branding, setBranding } = useOrgBranding();
  const [name, setName] = useState(branding.name ?? "");
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl ?? "");

  const save = () => setBranding({ ...branding, name, logoUrl });

  return (
    <Stack>
      <Title order={3}>Branding</Title>
      <TextInput
        label="Nombre público"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <TextInput
        label="Logo URL"
        value={logoUrl}
        onChange={(e) => setLogoUrl(e.currentTarget.value)}
      />
      {/* O si prefieres subir archivo:
      <FileInput label="Subir logo" accept="image/*" />
      */}
      {logoUrl && <Image src={logoUrl} alt="Logo" mah={64} fit="contain" />}
      <Group justify="flex-end">
        <Button onClick={save}>Guardar</Button>
      </Group>
    </Stack>
  );
}

// src/pages/org-admin/AdminMembers.tsx
import { Stack, Title, Table, Group, Button, TextInput } from "@mantine/core";
import { useState } from "react";

type Member = {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
};

export default function AdminMembers() {
  const [inviteEmail, setInviteEmail] = useState("");
  const members: Member[] = [
    { _id: "1", name: "Juan", email: "juan@mail.com", role: "owner" },
    { _id: "2", name: "Ana", email: "ana@mail.com", role: "admin" },
  ];

  return (
    <Stack>
      <Title order={3}>Miembros</Title>

      <Group>
        <TextInput
          placeholder="correo@dominio.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.currentTarget.value)}
        />
        <Button>Invitar</Button>
      </Group>

      <Table striped withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Correo</Table.Th>
            <Table.Th>Rol</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {members.map((m) => (
            <Table.Tr key={m._id}>
              <Table.Td>{m.name}</Table.Td>
              <Table.Td>{m.email}</Table.Td>
              <Table.Td>{m.role}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light">
                    Cambiar rol
                  </Button>
                  <Button size="xs" color="red" variant="subtle">
                    Eliminar
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

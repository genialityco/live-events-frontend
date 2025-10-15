// src/pages/super-admin/AdminUsersPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Title,
  Container,
  Table,
  Group,
  Button,
  Center,
  Loader,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
  Pagination,
  Text,
} from "@mantine/core";
import { fetchUsers } from "../../services/usersServices"; // GET /admin/users
import { authUpdatePassword } from "../../services/authService"; // POST /auth/update-password
import type { AdminUser } from "../../services/usersServices";

export default function AdminUsersPage() {
  // tabla & búsqueda
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // cambio de contraseña
  const [passOpen, setPassOpen] = useState(false);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [newPass, setNewPass] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers({ q, page, limit });
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q]);

  const openChangePassword = (u: AdminUser) => {
    setTarget(u);
    setNewPass("");
    setError(null);
    setPassOpen(true);
  };

  const savePassword = async () => {
    if (!target) return;
    if (!newPass || newPass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Preferimos uid si viene del backend; si no, usar email
      const payload = target.uid
        ? { uid: target.uid, newPassword: newPass }
        : { email: target.email, newPassword: newPass };
      await authUpdatePassword(payload);
      setPassOpen(false);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Error al cambiar la contraseña"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg">
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" mb="sm">
          <Title order={3}>Usuarios</Title>
          <Group gap="xs">
            <TextInput
              placeholder="Buscar por email o nombre…"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.currentTarget.value);
              }}
              miw={260}
            />
            <Button variant="light" onClick={load}>
              Refrescar
            </Button>
          </Group>
        </Group>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>UID</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th style={{ width: 230 }}>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((u) => (
              <Table.Tr key={u._id}>
                <Table.Td>{u.names || "—"}</Table.Td>
                <Table.Td>{u.email}</Table.Td>
                <Table.Td>{u.uid || "—"}</Table.Td>
                <Table.Td>{u.is_admin ? "Admin" : "Usuario"}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-start">
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => openChangePassword(u)}
                    >
                      Cambiar contraseña
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination total={pages} value={page} onChange={setPage} />
        </Group>
      </Paper>

      {/* Modal: Cambiar contraseña */}
      <Modal
        opened={passOpen}
        onClose={() => setPassOpen(false)}
        title={`Cambiar contraseña${target ? ` · ${target.email}` : ""}`}
        centered
      >
        <Stack>
          <PasswordInput
            label="Nueva contraseña"
            placeholder="••••••••"
            value={newPass}
            onChange={(e) => setNewPass(e.currentTarget.value)}
            withAsterisk
          />
          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setPassOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={savePassword} loading={saving}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

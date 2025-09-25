/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchEventUsersPaginated } from "../services/eventUsersService";
import {
  Table,
  Loader,
  Center,
  Paper,
  Text,
  Pagination,
  TextInput,
  Group,
  Checkbox,
  Button,
} from "@mantine/core";

interface EventUser {
  _id: string;
  properties: {
    email?: string;
    names?: string;
    perfil?: string;
    [key: string]: any;
  };
}

export default function EventUsersPaginatedSelector({
  eventId,
  selected,
  setSelected,
}: {
  eventId: string;
  selected: string[];
  setSelected: (ids: string[]) => void;
}) {
  const [users, setUsers] = useState<EventUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectAllPage, setSelectAllPage] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchEventUsersPaginated(eventId, page, pageSize, filter)
      .then(({ data, total }) => {
        setUsers(data);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }, [eventId, page, pageSize, filter]);

  useEffect(() => {
    // Si "select all page" está activo, marca todos los ids visibles
    if (selectAllPage) {
      const ids = users.map((u) => u._id);
      setSelected(Array.from(new Set([...selected, ...ids])));
    } else {
      // Quita los ids de la página actual si se desmarca "select all page"
      const ids = users.map((u) => u._id);
      setSelected(selected.filter((id) => !ids.includes(id)));
    }
    // eslint-disable-next-line
  }, [selectAllPage, page]);

  const handleCheck = (id: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((s) => s !== id));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFilter(search);
  };

  if (loading) {
    return (
      <Center h={120}>
        <Loader size="md" />
      </Center>
    );
  }

  if (users.length === 0) {
    return <Text c="dimmed">No hay asistentes registrados.</Text>;
  }

  // Para determinar si todos los usuarios de la página están seleccionados
  const allPageSelected =
    users.every((u) => selected.includes(u._id)) && users.length > 0;

  return (
    <Paper shadow="xs" p="xs" radius="md" withBorder>
      <Text size="sm" mb="md">
        Total de asistentes: {total}
      </Text>
      <form onSubmit={handleSearch}>
        <Group mb="sm">
          <TextInput
            placeholder="Buscar por nombre, email o perfil"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Button type="submit" variant="light">
            Buscar
          </Button>
        </Group>
      </form>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={allPageSelected}
                onChange={(e) => setSelectAllPage(e.currentTarget.checked)}
                indeterminate={
                  !allPageSelected &&
                  selected.some((id) => users.map((u) => u._id).includes(id))
                }
                title="Seleccionar todos de la página"
              />
            </Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Perfil</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user._id}>
              <Table.Td>
                <Checkbox
                  checked={selected.includes(user._id)}
                  onChange={(e) =>
                    handleCheck(user._id, e.currentTarget.checked)
                  }
                  title="Seleccionar usuario"
                />
              </Table.Td>
              <Table.Td>{user.properties.names || "-"}</Table.Td>
              <Table.Td>{user.properties.email || "-"}</Table.Td>
              <Table.Td>{user.properties.perfil || "-"}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Group justify="end" mt="md">
        <Pagination
          value={page}
          onChange={setPage}
          total={Math.ceil(total / pageSize)}
        />
      </Group>
      <Text mt="md">Seleccionados: {selected.length} usuario(s)</Text>
    </Paper>
  );
}

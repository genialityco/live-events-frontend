/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Loader,
  Center,
  Paper,
  Text,
  Pagination,
  TextInput,
  Group,
  Button,
  Select,
  Badge,
  Stack,
  Checkbox,
  ActionIcon,
  Tooltip,
  Divider,
  Alert,
} from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import {
  fetchEventUsersPaginated,
  fetchEventUserDuplicates,
  deleteEventUserDuplicates,
} from "../services/eventUsersService";

interface EventUser {
  _id: string;
  properties: {
    email?: string;
    names?: string;
    perfil?: string;
    [key: string]: any;
  };
  created_at?: string | Date;
}

type DupGroup = {
  _id: string; // valor duplicado (normalizado)
  count: number;
  docs: EventUser[];
};

export default function EventUsersPaginatedSelector({
  eventId,
  selected,
  setSelected,
}: {
  eventId: string;
  selected: string[];
  setSelected: (ids: string[]) => void;
}) {
  // -------- estado general (modo normal)
  const [users, setUsers] = useState<EventUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  // -------- modo duplicados
  const [dupMode, setDupMode] = useState(false);
  const [dupBy, setDupBy] = useState<
    "email" | "document_number" | "cedulaoid" | "cc"
  >("email");
  const [dupGroups, setDupGroups] = useState<DupGroup[]>([]);
  const [choosenKeep, setChoosenKeep] = useState<Record<string, string>>({}); // clave: valor duplicado (_id del grupo), valor: _id a conservar
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // -------- cargar paginado (modo normal)
  useEffect(() => {
    if (dupMode) return; // no recargar paginado si estamos en duplicados
    setLoading(true);
    fetchEventUsersPaginated(eventId, page, pageSize, filter)
      .then(({ data, total }) => {
        setUsers(data);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }, [eventId, page, pageSize, filter, dupMode]);

  // -------- cargar duplicados (modo duplicados)
  useEffect(() => {
    if (!dupMode) return;
    setLoading(true);
    fetchEventUserDuplicates(eventId, dupBy)
      .then((groups) => {
        setDupGroups(groups);
        setChoosenKeep({});
      })
      .finally(() => setLoading(false));
  }, [dupMode, dupBy, eventId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFilter(search.trim());
  };

  const resetNormal = () => {
    setSearch("");
    setFilter("");
    setPage(1);
  };

  const refreshCurrent = () => {
    if (dupMode) {
      setLoading(true);
      fetchEventUserDuplicates(eventId, dupBy)
        .then((groups) => setDupGroups(groups))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      fetchEventUsersPaginated(eventId, page, pageSize, filter)
        .then(({ data, total }) => {
          setUsers(data);
          setTotal(total);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleBulkDelete = async (strategy: "keep-first" | "keep-last") => {
    setLoading(true);
    setActionMsg(null);
    try {
      const res = await deleteEventUserDuplicates({
        event_id: eventId,
        by: dupBy,
        strategy,
      });
      setActionMsg(`Eliminados ${res.deletedCount} duplicados (${dupBy}).`);
      const groups = await fetchEventUserDuplicates(eventId, dupBy);
      setDupGroups(groups);
      setChoosenKeep({});
    } catch (e: any) {
      setActionMsg(`Error eliminando duplicados: ${String(e?.message ?? e)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRespectingChoices = async () => {
    // Mantendrá de cada grupo el _id elegido y borrará el resto
    setLoading(true);
    setActionMsg(null);
    try {
      const keepIds = Object.values(choosenKeep);
      const res = await deleteEventUserDuplicates({
        event_id: eventId,
        by: dupBy,
        keepIds,
      });
      setActionMsg(
        `Eliminados ${res.deletedCount} duplicados respetando selección.`
      );
      const groups = await fetchEventUserDuplicates(eventId, dupBy);
      setDupGroups(groups);
      setChoosenKeep({});
    } catch (e: any) {
      setActionMsg(`Error eliminando duplicados: ${String(e?.message ?? e)}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const allSelectedOnPage = useMemo(() => {
    if (!users.length) return false;
    return users.every((u) => selected.includes(u._id));
  }, [users, selected]);

  const toggleSelectPage = () => {
    if (allSelectedOnPage) {
      const remaining = selected.filter(
        (id) => !users.find((u) => u._id === id)
      );
      setSelected(remaining);
    } else {
      const merged = Array.from(
        new Set([...selected, ...users.map((u) => u._id)])
      );
      setSelected(merged);
    }
  };

  if (loading) {
    return (
      <Center h={160}>
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" align="center" mb="md">
        <Group>
          <Checkbox
            label="Ver duplicados"
            checked={dupMode}
            onChange={(e) => setDupMode(e.currentTarget.checked)}
          />
          {dupMode && (
            <Select
              data={[
                { value: "email", label: "Email" },
                { value: "document_number", label: "Documento" },
                { value: "cedulaoid", label: "Cédula (oid)" },
                { value: "cc", label: "CC" },
              ]}
              value={dupBy}
              onChange={(v) =>
                setDupBy(
                  ((v as any) ?? "email") as
                    | "email"
                    | "document_number"
                    | "cedulaoid"
                    | "cc"
                )
              }
              placeholder="Campo"
              w={220}
            />
          )}
        </Group>

        <Group>
          <Tooltip label="Refrescar">
            <ActionIcon
              variant="subtle"
              onClick={refreshCurrent}
              aria-label="refresh"
            >
              <IconReload size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {actionMsg && (
        <Alert mb="md" variant="light">
          {actionMsg}
        </Alert>
      )}

      {!dupMode ? (
        <>
          <Text size="sm" mb="xs">
            Total de asistentes: {total}
          </Text>

          <form onSubmit={handleSearch}>
            <Group mb="sm" align="end">
              <TextInput
                label="Buscar"
                placeholder="Nombre, email o perfil"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                w={360}
              />
              <Button type="submit" variant="light">
                Buscar
              </Button>
              <Button variant="subtle" onClick={resetNormal}>
                Limpiar
              </Button>
            </Group>
          </form>

          <Divider my="sm" />

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={36}>
                  <Checkbox
                    checked={allSelectedOnPage}
                    onChange={toggleSelectPage}
                    aria-label="select-page"
                  />
                </Table.Th>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Perfil</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => {
                const isSel = selected.includes(user._id);
                return (
                  <Table.Tr key={user._id}>
                    <Table.Td>
                      <Checkbox
                        checked={isSel}
                        onChange={() => toggleSelectRow(user._id)}
                        aria-label={`select-${user._id}`}
                      />
                    </Table.Td>
                    <Table.Td>{user.properties?.names || "-"}</Table.Td>
                    <Table.Td>{user.properties?.email || "-"}</Table.Td>
                    <Table.Td>{user.properties?.perfil || "-"}</Table.Td>
                  </Table.Tr>
                );
              })}
              {users.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text c="dimmed">No hay asistentes registrados.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          <Group justify="space-between" mt="md">
            <Text size="sm">
              Seleccionados: <strong>{selected.length}</strong>
            </Text>
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.ceil(total / pageSize)}
            />
          </Group>
        </>
      ) : (
        <>
          <Group mb="sm">
            <Button
              variant="light"
              onClick={() => handleBulkDelete("keep-first")}
            >
              Borrar duplicados (conservar más antiguo)
            </Button>
            <Button
              variant="light"
              onClick={() => handleBulkDelete("keep-last")}
            >
              Borrar duplicados (conservar más reciente)
            </Button>
            <Button variant="filled" onClick={handleDeleteRespectingChoices}>
              Borrar duplicados (según selección)
            </Button>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Valor duplicado</Table.Th>
                <Table.Th>Duplicados</Table.Th>
                <Table.Th>Elegir a conservar (opcional)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dupGroups.map((g) => (
                <Table.Tr key={g._id}>
                  <Table.Td>
                    <Group gap="xs">
                      <Text fw={500}>{g._id || "(vacío)"}</Text>
                      <Badge>{g.count}</Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      {g.docs.map((u) => (
                        <Text key={u._id} size="sm">
                          {u.properties?.names ?? "-"} —{" "}
                          {u.properties?.email ?? "-"} —{" "}
                          <Text span c="dimmed">
                            {u._id}
                          </Text>
                        </Text>
                      ))}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      placeholder="Selecciona el _id a conservar"
                      data={g.docs.map((u) => ({
                        value: u._id,
                        label: `${u.properties?.names ?? "-"} (${u._id})`,
                      }))}
                      value={choosenKeep[g._id] ?? null}
                      onChange={(v) =>
                        setChoosenKeep((prev) => ({
                          ...prev,
                          [g._id]: v as string,
                        }))
                      }
                      searchable
                      nothingFoundMessage="Sin opciones"
                      w={400}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
              {dupGroups.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text c="dimmed">No hay duplicados para {dupBy}.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Paper>
  );
}

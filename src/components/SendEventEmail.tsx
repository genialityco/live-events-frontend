/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Card,
  Group,
  Text,
  TextInput,
  Modal,
  Loader,
  Paper,
  Checkbox,
  Badge,
  Pagination,
  Table,
  Textarea, // <-- nuevo
} from "@mantine/core";
import { useMemo, useState, useEffect } from "react";
import {
  sendEventEmail,
  sendEventEmailBulk,
  sendAdhocForEvent,
} from "../services/mailerService";
import { fetchEventUsersPaginated } from "../services/eventUsersService";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EventUser {
  _id: string;
  properties: {
    email?: string;
    names?: string;
    perfil?: string;
    [key: string]: any;
  };
}

export default function SendEventEmail({
  eventId,
  event,
}: {
  eventId: string;
  event: any;
}) {
  const [subject, setSubject] = useState(
    event?.name ? `Recordatorio: ${event.name}` : "Recordatorio de evento"
  );
  const [senderName, setSenderName] = useState("ACE");
  const [message, setMessage] = useState("");
  const [accessLink, setAccessLink] = useState("");
  const [users, setUsers] = useState<EventUser[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(false);

  // NUEVO: modo adhoc por lista
  const [adhocMode, setAdhocMode] = useState(false);
  const [adhocText, setAdhocText] = useState(""); // pegado desde excel/csv

  // Paginación
  const [, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  // Filtros y búsqueda
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Modal/feedback
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // TIPTAP Editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: message,
    onUpdate: ({ editor }) => setMessage(editor.getHTML()),
  });

  // Cargar usuarios paginados (solo si NO es adhocMode)
  useEffect(() => {
    if (adhocMode) return;
    setLoading(true);
    fetchEventUsersPaginated(eventId, page, pageSize, filter)
      .then(({ data, total }) => {
        setUsers(data);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }, [eventId, page, pageSize, filter, adhocMode]);

  // Select/Deselect todos los de la página actual
  const allPageIds = users.map((u) => u._id);
  const allPageSelected =
    users.length > 0 && users.every((u) => selected.includes(u._id));

  const handleSelectAllPage = (checked: boolean) => {
    if (checked) {
      setSelected(Array.from(new Set([...selected, ...allPageIds])));
    } else {
      setSelected(selected.filter((id) => !allPageIds.includes(id)));
    }
  };

  const handleCheck = (id: string, checked: boolean) => {
    if (checked) setSelected([...selected, id]);
    else setSelected(selected.filter((s) => s !== id));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFilter(search);
  };

  // --- NUEVO: parseo de la lista adhoc ---
  // Admite líneas tipo:
  //   email@dominio.com
  //   Nombre Apellido, email@dominio.com
  //   "Nombre con, coma", email@dominio.com   (lo simple: partimos por coma)
  const adhocRecipients = useMemo(() => {
    const lines = adhocText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const out: { email: string; names?: string }[] = [];
    const emailRe = /^\S+@\S+\.\S+$/;

    for (const line of lines) {
      // si hay coma, intentamos separar "nombre, email"
      const parts = line
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length === 1) {
        // solo email
        const maybeEmail = parts[0];
        if (emailRe.test(maybeEmail)) out.push({ email: maybeEmail });
      } else {
        // buscamos el que parezca email y el resto como nombre
        const email = parts.find((p) => emailRe.test(p));
        const name =
          parts
            .filter((p) => p !== email)
            .join(" ")
            .trim() || undefined;
        if (email) out.push({ email, names: name });
      }
    }

    // dedupe por email (lowercase)
    const dedup = new Map<string, { email: string; names?: string }>();
    for (const r of out) {
      const key = r.email.toLowerCase();
      if (!dedup.has(key)) dedup.set(key, r);
    }
    return Array.from(dedup.values());
  }, [adhocText]);

  const handleSend = async () => {
    if (!subject || !message) {
      setFeedback("Completa el asunto y el mensaje.");
      setModalOpen(true);
      return;
    }

    // Validaciones adhoc
    if (adhocMode && adhocRecipients.length === 0) {
      setFeedback("Pega al menos un email válido en la lista.");
      setModalOpen(true);
      return;
    }

    setSending(true);
    setModalOpen(true);
    setFeedback("Enviando correo...");

    try {
      if (adhocMode) {
        // --- NUEVO: envío adhoc por lista (SIN loginLink) ---
        await sendAdhocForEvent({
          eventId,
          recipients: adhocRecipients,
          subject,
          description: message,
          senderName,
          // senderEmail: opcional si lo manejas
          // unsubscribeLink: opcional si lo usas en el template
        });
        setFeedback(`Correos encolados (adhoc): ${adhocRecipients.length}`);
      } else if (sendToAll) {
        // ENVÍO MASIVO: todos los asistentes del evento (backend ya trae todos)
        await sendEventEmailBulk(eventId, {
          sendToAll: true,
          subject,
          description: message,
          senderName,
        });
        setFeedback(
          "Correos encolados correctamente para todos los asistentes."
        );
      } else if (selected.length === 1) {
        // INDIVIDUAL
        await sendEventEmail(eventId, selected[0], {
          subject,
          description: message,
          accessLink: accessLink || undefined,
          senderName,
        });
        setFeedback("Correo enviado correctamente.");
      } else if (selected.length > 1) {
        // SELECCIÓN MASIVA
        await sendEventEmailBulk(eventId, {
          sendToAll: false,
          userIds: selected,
          subject,
          description: message,
          senderName,
        });
        setFeedback(
          "Correos encolados correctamente a los usuarios seleccionados."
        );
      } else {
        setFeedback(
          "Selecciona al menos un usuario o usa el modo 'Enviar por lista'."
        );
        setSending(false);
        return;
      }

      setTimeout(() => setModalOpen(false), 2500);
    } catch (e) {
      console.error("Error enviando correos:", e);
      setFeedback("Ocurrió un error enviando los correos.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper shadow="xs" p="lg" radius="md" withBorder>
      <Group mb="md" justify="space-between">
        <Text fw={600} size="lg">
          Enviar correo a asistentes
        </Text>
        <Button disabled={sending} onClick={handleSend}>
          Enviar
        </Button>
      </Group>

      <Card mb="md" shadow="xs" withBorder>
        {/* NUEVO: Modo adhoc por lista */}
        <Checkbox
          checked={adhocMode}
          onChange={() => {
            setAdhocMode((v) => !v);
            // coherencia con los otros modos
            setSendToAll(false);
          }}
          label="Enviar por lista (adhoc, sin login)"
          mb="md"
        />

        {!adhocMode && (
          <Checkbox
            checked={sendToAll}
            onChange={() => setSendToAll((v) => !v)}
            label="Enviar a todos los asistentes"
            mb="md"
          />
        )}

        {/* UI de tabla/paginación solo si NO es adhoc */}
        {!adhocMode && !sendToAll && (
          <>
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
                      indeterminate={
                        !allPageSelected &&
                        selected.some((id) => allPageIds.includes(id))
                      }
                      onChange={(e) =>
                        handleSelectAllPage(e.currentTarget.checked)
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

            <Badge mt="sm" color={selected.length ? "green" : "red"}>
              {selected.length
                ? `Seleccionados: ${selected.length}`
                : "Ningún usuario seleccionado"}
            </Badge>
          </>
        )}

        {/* NUEVO: Textarea de lista adhoc */}
        {adhocMode && (
          <Box mb="md">
            <Text fw={600} mb="xs">
              Lista de destinatarios
            </Text>
            <Textarea
              placeholder={`Pega una lista, una por línea. Ejemplos:
correo1@dominio.com
Nombre Apellido, correo2@dominio.com`}
              value={adhocText}
              onChange={(e) => setAdhocText(e.currentTarget.value)}
              autosize
              minRows={6}
            />
            <Text size="sm" c="dimmed" mt={6}>
              Detectados: {adhocRecipients.length} emails válidos.
            </Text>
          </Box>
        )}

        <TextInput
          label="Nombre del remitente"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          mb="md"
          placeholder="Ej: Campus Endocrino"
        />
        <TextInput
          label="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          mb="md"
        />

        <Text mb="xs">Mensaje (puedes usar formato, links, listas, etc):</Text>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            minHeight: 160,
            marginBottom: 16,
          }}
        >
          <EditorContent editor={editor} />
        </div>

        <TextInput
          label="Enlace de acceso (opcional, con UTM)"
          value={accessLink}
          onChange={(e) => setAccessLink(e.target.value)}
          mb="md"
          placeholder="https://liveevents.geniality.com.co/..."
          disabled={adhocMode} // <-- en adhoc no usamos loginLink
        />
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        centered
        title="Envío de correo"
      >
        <Box py="xl" px="md" style={{ textAlign: "center" }}>
          {sending ? <Loader size="lg" /> : null}
          <Text mt="md">{feedback}</Text>
        </Box>
      </Modal>
    </Paper>
  );
}

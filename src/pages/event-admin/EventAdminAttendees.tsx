/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { Loader, Center, Title, Stack, Select, Button, Accordion, Code } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchEventById } from "../../services/eventsService";
import { fetchEventUserPropertiesFields, fetchEventUserDuplicates, deleteEventUserDuplicates } from "../../services/eventUsersService";
import EventUsersPaginatedSelector from "../../components/EventUsersTable";

export default function EventAdminAttendees() {
  const { eventId } = useParams();
  const [, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Nuevo: campos y selección de campo para duplicados
  const [fields, setFields] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<any[] | null>(null);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      const data = await fetchEventById(eventId);
      setEvent(data);
      setLoading(false);
      // Cargar campos posibles
      const props = await fetchEventUserPropertiesFields();
      setFields(props);
    })();
  }, [eventId]);

  const handleFindDuplicates = async () => {
    if (!eventId || !selectedField) return;
    setLoadingDuplicates(true);
    const dups = await fetchEventUserDuplicates(eventId, selectedField);
    setDuplicates(dups);
    setLoadingDuplicates(false);
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!eventId || !selectedField) return;
    setDeletingId(docId);
    await deleteEventUserDuplicates({
      event_id: eventId,
      by: selectedField,
      deleteIds: [docId],
    });
    // Refresca duplicados tras borrar
    const dups = await fetchEventUserDuplicates(eventId, selectedField);
    setDuplicates(dups);
    setDeletingId(null);
  };

  if (!eventId) return <div>Falta el ID del evento</div>;
  if (loading)
    return (
      <Center h={200}>
        <Loader />
      </Center>
    );

  return (
    <Stack>
      <Title order={4}>Asistentes</Title>
      {/* Nuevo: Selector de campo y botón para buscar duplicados */}
      <Stack gap="xs">
        <Select
          label="Buscar duplicados por campo"
          placeholder="Selecciona un campo"
          data={fields.map((f) => ({ value: f, label: f }))}
          value={selectedField}
          onChange={setSelectedField}
          searchable
          nothingFoundMessage="Sin campos"
        />
        <Button
          onClick={handleFindDuplicates}
          disabled={!selectedField || loadingDuplicates}
          loading={loadingDuplicates}
        >
          Buscar duplicados
        </Button>
      </Stack>
      {/* Mostrar duplicados si existen */}
      {duplicates && (
        <Stack>
          <Title order={5}>Duplicados encontrados: {duplicates.length}</Title>
          <Accordion variant="contained">
            {duplicates.map((group, idx) => (
              <Accordion.Item key={idx} value={String(idx)}>
                <Accordion.Control>
                  <b>Valor:</b> {group._id} <b>Cantidad:</b> {group.count}
                </Accordion.Control>
                <Accordion.Panel>
                  {group.docs.map((doc: any) => (
                    <Stack key={doc._id} p="xs" mb="xs" style={{ border: "1px solid #eee", borderRadius: 6 }}>
                      <div>
                        <b>ID:</b> {doc._id}
                      </div>
                      <div>
                        <b>Creado:</b> {doc.created_at ? new Date(doc.created_at).toLocaleString() : ""}
                      </div>
                      <div>
                        <b>Properties:</b>
                        <Code block fz="xs" mt={2}>
                          {JSON.stringify(doc.properties, null, 2)}
                        </Code>
                      </div>
                      <Button
                        color="red"
                        size="xs"
                        mt="xs"
                        loading={deletingId === doc._id}
                        onClick={() => handleDeleteDoc(doc._id)}
                      >
                        Borrar este registro
                      </Button>
                    </Stack>
                  ))}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Stack>
      )}
      <EventUsersPaginatedSelector
        eventId={eventId}
        selected={selectedUserIds}
        setSelected={setSelectedUserIds}
      />
    </Stack>
  );
}

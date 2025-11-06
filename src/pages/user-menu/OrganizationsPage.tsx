/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/user-menu/OrganizationsPage.tsx
import { useEffect, useState } from "react";
import { fetchOrganizationsByAuthors } from "../../services/organizationsService";
import type { Organization } from "../../types/Organization";
import {
  Loader,
  Center,
  Title,
  Paper,
  Group,
  Button,
  Container,
  Card,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authorId, loading: authLoading } = useAuth();
  
  // Use fallback authorId if not available from auth
  const effectiveAuthorId = authorId || "62171ec163b90f7cc421c3a3";
  
  const getOrganizations = async () => {
    setLoading(true);
    try {
      const orgs = await fetchOrganizationsByAuthors([effectiveAuthorId]);
      setOrganizations(orgs ?? []);
    } catch (e) {
      console.error("Error consultando organizaciones", e);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    void getOrganizations();
  }, [authLoading, effectiveAuthorId]);

  if (authLoading || loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container>
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Group mb="md" justify="space-between">
          <Title order={2}>Organizaciones</Title>
          {/* Si vas a permitir crear nuevas, aquí podría ir un botón "Crear" */}
        </Group>

        {organizations.length === 0 ? (
          <Center py="xl">
            <Card withBorder radius="md" p="lg">
              <Title order={4} mb="xs">
                Aún no tienes organizaciones
              </Title>
              <Text c="dimmed" mb="md">
                Pide a un administrador que te asigne una organización o crea
                una nueva si tu rol lo permite.
              </Text>
              {/* <Button onClick={() => navigate("/organizations/new")}>Crear organización</Button> */}
            </Card>
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {organizations.map((org) => (
              <Card key={org._id} shadow="sm" radius="md" withBorder>
                <Text fw={600} size="lg" mb="xs">
                  {org.name}
                </Text>

                {/* Puedes mostrar más metadata si existe (ej. dirección, estado, etc.) */}

                <Group justify="flex-end" mt="md">
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => navigate(`/organizations/${org._id}`)}
                  >
                    Visitar
                  </Button>
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => navigate(`/organizations/${org._id}/admin`)}
                  >
                    Administrar
                  </Button>
                  {/* Opcional: acceso directo a eventos de esa org */}
                  {/* <Button
                    size="xs"
                    variant="light"
                    onClick={() => navigate(`/organizations/${org._id}/events`)}
                  >
                    Eventos
                  </Button> */}
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Paper>
    </Container>
  );
}

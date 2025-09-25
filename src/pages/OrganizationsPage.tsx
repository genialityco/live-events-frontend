// src/pages/OrganizationsPage.tsx
import { useEffect, useState } from "react";
import { fetchOrganizationsByAuthors } from "../services/organizationsService";
import type { Organization } from "../types/Organization";
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
import { useAuth } from "../auth/useAuth";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authorId } = useAuth();

  useEffect(() => {
    if (!authorId) {
      setOrganizations([]);
      setLoading(false);
      return;
    }
    fetchOrganizationsByAuthors([authorId])
      .then(setOrganizations)
      .finally(() => setLoading(false));
  }, [authorId]);

  if (loading) {
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
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {organizations.map((org) => (
            <Card key={org._id} shadow="sm" radius="md" withBorder>
              <Text fw={600} size="lg" mb="xs">
                {org.name}
              </Text>
              <Group justify="flex-end" mt="md">
                <Button
                  size="xs"
                  variant="default"
                  onClick={() =>
                    window.open(`/organizations/${org._id}`, "_blank")
                  }
                >
                  Visitar
                </Button>
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => navigate(`/organizations/${org._id}/events`)}
                >
                  Administrar
                </Button>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Paper>
    </Container>
  );
}

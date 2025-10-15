// src/pages/auth/LoginPage.tsx
import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Stack,
  TextInput,
  PasswordInput,
  Title,
  Container,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function LoginPage() {
  const { login, loading, user, authorId } = useAuth();
  const [email, setEmail] = useState("ace@geniality.com.co");
  const [password, setPassword] = useState("123456");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      // NO navegues aquí
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // navega cuando el provider ya terminó de resolver
    if (!loading && user /* opcional: && authorId */) {
      navigate("/");
    }
  }, [loading, user, authorId, navigate]);
  return (
    <Container size="xs">
      <Paper withBorder p="lg" radius="md" mt="xl">
        <Title order={3} mb="md">
          Iniciar sesión
        </Title>
        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
            <Button type="submit" loading={submitting}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

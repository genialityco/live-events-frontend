// src/pages/LoginPage.tsx
import { useState } from "react";
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
import { useAuth } from "../auth/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("ace@geniality.com.co");
  const [password, setPassword] = useState("demo-password"); // pon tu pass real aquí
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

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
            <Button type="submit" loading={loading}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

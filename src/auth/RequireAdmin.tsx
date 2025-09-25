// src/auth/RequireAdmin.tsx
import { Navigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "./useAuth";

const ADMINS = ["ace@geniality.com.co"]; 

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  if (!user || !ADMINS.includes(user.email || ""))
    return <Navigate to="/" replace />;
  return <>{children}</>;
}

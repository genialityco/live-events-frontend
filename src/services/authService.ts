// src/services/authService.ts
import { api } from "./api";

export type AuthUser = {
  _id?: string;
  email: string;
  is_admin?: boolean;
  names?: string;
  uid?: string; // si el backend lo devuelve en login con Firebase
};

export type LoginResponse = {
  // en nuestro backend simple con Firebase, devolvimos { uid, email }
  uid?: string;
  email: string;
  // si luego devuelves más cosas, añádelas aquí
};

export async function authLogin(email: string, password: string) {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

type UpdatePasswordArgs =
  | { uid: string; newPassword: string; email?: never }
  | { email: string; newPassword: string; uid?: never };

export async function authUpdatePassword(args: UpdatePasswordArgs) {
  const { data } = await api.post<{ ok: true }>("/auth/update-password", args);
  return data;
}

type UpdateEmailArgs =
  | { uid: string; newEmail: string; currentEmail?: never }
  | { currentEmail: string; newEmail: string; uid?: never };

export async function authUpdateEmail(args: UpdateEmailArgs) {
  const { data } = await api.post<{ ok: true }>("/auth/update-email", args);
  return data;
}

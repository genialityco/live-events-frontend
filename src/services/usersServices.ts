import { api } from "./api";

// ---------- Tipos ----------
export type AdminUser = {
  _id: string; // Mongo ObjectId
  email: string;
  names?: string;
  picture?: string;
  is_admin?: boolean;
  uid?: string; // si lo guardas también
  created_at?: string;
  updated_at?: string;
};

export type UsersPage = {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

// ---------- Listar con búsqueda + paginación ----------
export async function fetchUsers(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { q, page = 1, limit = 20 } = params || {};
  const { data } = await api.get<UsersPage>("/admin/users", {
    params: { q, page, limit },
  });
  return data;
}

// ---------- Traer uno por id ----------
export async function fetchUserById(id: string) {
  const { data } = await api.get<AdminUser>(`/admin/users/${id}`);
  return data;
}

// ---------- Actualizar campos básicos (email, names, is_admin) ----------
export async function updateUserBasic(
  id: string,
  payload: Partial<Pick<AdminUser, "email" | "names" | "is_admin">>
) {
  const { data } = await api.patch<AdminUser>(`/admin/users/${id}`, payload);
  return data;
}

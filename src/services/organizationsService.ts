/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export async function fetchOrganizationsByAuthors(authors: string[]) {
  const params = new URLSearchParams();
  authors.forEach((author) => params.append("author", author));
  const res = await api.get(`/organizations/by-authors?${params.toString()}`);
  return res.data;
}

export async function fetchOrganizations() {
  const res = await api.get("/organizations");
  return res.data;
}

export async function fetchOrganizationById(id: string) {
  const res = await api.get(`/organizations/${id}`);
  return res.data;
}

export async function createOrganization(data: any) {
  const res = await api.post("/organizations", data);
  return res.data;
}

export async function updateOrganization(id: string, data: any) {
  const res = await api.patch(`/organizations/${id}`, data);
  return res.data;
}

export async function deleteOrganization(id: string) {
  const res = await api.delete(`/organizations/${id}`);
  return res.data;
}

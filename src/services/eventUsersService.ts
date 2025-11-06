/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export async function fetchEventUsers(
  eventId: string,
  params?: { page?: number; pageSize?: number; filtered?: any }
) {
  const response = await api.get(`/events/${eventId}/event_users`, { params });
  return response.data;
}

export async function fetchEventUsersPaginated(eventId: string, page: number, pageSize: number, filter: string) {
  const { data } = await api.get('/event_users', { params: { event_id: eventId, page, pageSize, filter } });
  return data as { data: any[]; total: number };
}

export async function fetchEventUserDuplicates(eventId: string, by: string) {
  const { data } = await api.get('/event_users/duplicates', { params: { event_id: eventId, by } });
  return data as Array<{ _id: string; count: number; docs: any[] }>;
}

export async function deleteEventUserDuplicates(payload: {
  event_id: string;
  by: string;
  strategy?: 'keep-first' | 'keep-last';
  keepIds?: string[];
  deleteIds?: string[];
}) {
  const { data } = await api.post('/event_users/duplicates/delete', payload);
  return data as { deletedCount: number };
}

export async function fetchEventUserPropertiesFields() {
  const { data } = await api.get('/event_users/properties/fields');
  return data as string[];
}
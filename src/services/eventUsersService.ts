/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export async function fetchEventUsers(
  eventId: string,
  params?: { page?: number; pageSize?: number; filtered?: any }
) {
  const response = await api.get(`/events/${eventId}/event_users`, { params });
  return response.data;
}

export async function fetchEventUsersPaginated(
  eventId: string,
  page = 1,
  pageSize = 20,
  filter = ""
) {
  const res = await api.get("/event_users", {
    params: { event_id: eventId, page, pageSize, filter },
  });
  return res.data;
}

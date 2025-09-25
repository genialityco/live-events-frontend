/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export async function fetchEvents() {
  const response = await api.get("/events");
  return response.data;
}

export async function fetchEventById(id: string) {
  const response = await api.get(`/events/${id}`);
  return response.data;
}

export async function fetchEventsByOrganizerId(organizerId: string) {
  const res = await api.get(`/events/organizer/${organizerId}`);
  return res.data;
}

export async function sendEventEmail(
  eventId: string,
  eventUserId: string,
  payload: any
) {
  const res = await api.post(
    `/events/${eventId}/send-reminder/${eventUserId}`,
    payload
  );
  return res.data;
}

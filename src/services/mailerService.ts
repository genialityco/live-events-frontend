/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/emailService.ts
import { api } from "./api";

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

export async function sendEventEmailBulk(
  eventId: string,
  data: {
    userIds: string[];
    accessLink?: string;
    subject?: string;
    description?: string;
    senderName?: string;
  }
) {
  const res = await api.post(`/mailer/${eventId}/send-reminders-bulk`, data);
  return res.data;
}

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
    sendToAll: boolean;
    userIds?: string[];
    subject?: string;
    description?: string;
    senderName?: string;
  }
) {
  const res = await api.post(`/mailer/${eventId}/send-reminders-bulk`, data);
  return res.data;
}

export interface AdhocRecipient {
  email: string;
  names?: string;
}

export async function sendAdhocForEvent(payload: {
  eventId: string; // se usa para asunto e imágenes del template
  recipients: AdhocRecipient[]; // lista pegada desde Excel/CSV
  description: string; // HTML (TipTap)
  subject?: string; // si no, backend usa "Recordatorio: <event.name>"
  senderName?: string;
  senderEmail?: string;
  unsubscribeLink?: string; // si lo usas en el template
}) {
  const res = await api.post(`/mailer/send-adhoc-for-event`, payload);
  return res.data;
}

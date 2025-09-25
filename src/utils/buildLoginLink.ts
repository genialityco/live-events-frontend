// src/utils/buildLoginLink.ts
export function buildLoginLink({
  base = "https://liveevents.geniality.com.co/loginWithCode",
  email,
  event_id,
}: {
  base?: string;
  email: string;
  event_id: string;
}) {
  const q = new URLSearchParams({ email, event_id });
  return `${base}?${q.toString()}`;
}

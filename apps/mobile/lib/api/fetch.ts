import { API_URL } from "../env";

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!API_URL) throw new Error("Set EXPO_PUBLIC_API_URL in apps/mobile/.env");

  const headers = new Headers(init?.headers);
  if (API_URL.includes("loca.lt")) {
    headers.set("Bypass-Tunnel-Reminder", "true");
  }

  return fetch(`${API_URL}${path}`, { ...init, headers });
}

import { getEnvConfig } from "../utils/env";

/**
 * A tiny API client wrapper around fetch with JSON handling and consistent errors.
 * This is intentionally lightweight so it can adapt to the backend once endpoint shapes are confirmed.
 */
export class ApiClient {
  constructor({ baseUrl }) {
    this.baseUrl = (baseUrl || "").replace(/\/+$/, "");
  }

  async request(path, { method = "GET", query, body, headers } = {}) {
    if (!this.baseUrl) {
      throw new Error(
        "API base URL is not configured. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL."
      );
    }

    const url = new URL(this.baseUrl + path);
    if (query && typeof query === "object") {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
      });
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (payload && payload.message) ||
        (typeof payload === "string" && payload) ||
        `Request failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  }
}

export function createDefaultApiClient() {
  const env = getEnvConfig();
  return new ApiClient({ baseUrl: env.apiBaseUrl });
}

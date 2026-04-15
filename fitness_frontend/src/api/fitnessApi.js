import { createDefaultApiClient } from "./apiClient";
import { safeLocalJson } from "../utils/localJson";

const LS_KEYS = {
  profile: "fitness.profile",
  workouts: "fitness.workouts",
  nutrition: "fitness.nutrition",
  notifications: "fitness.notifications",
  plan: "fitness.plan"
};

/**
 * Provides app-specific API calls.
 * If backend endpoints are unavailable or mismatched, pages can still function with local fallback data.
 */
export function createFitnessApi() {
  const client = createDefaultApiClient();

  return {
    // Profile (best-effort backend; fallback to local)
    async getProfile() {
      try {
        return await client.request("/api/profile", { method: "GET" });
      } catch (e) {
        return safeLocalJson.get(LS_KEYS.profile, {
          name: "Guest",
          goal: "Strength + Conditioning",
          units: "metric"
        });
      }
    },

    async updateProfile(profile) {
      try {
        return await client.request("/api/profile", { method: "PUT", body: profile });
      } catch (e) {
        safeLocalJson.set(LS_KEYS.profile, profile);
        return { ok: true, source: "local" };
      }
    },

    // Plan generation (best-effort backend; fallback to a generated plan)
    async generatePlan(input) {
      try {
        return await client.request("/api/plans/generate", { method: "POST", body: input });
      } catch (e) {
        const fallback = {
          generatedAt: new Date().toISOString(),
          input,
          weeks: [
            {
              week: 1,
              days: [
                { day: "Mon", focus: "Lower", items: ["Squat 3x5", "RDL 3x8", "Calf raise 3x12"] },
                { day: "Wed", focus: "Upper", items: ["Bench 3x5", "Row 3x8", "Pullups 3xAMRAP"] },
                { day: "Fri", focus: "Full", items: ["Deadlift 3x5", "Press 3x8", "Farmer carry 4x40m"] }
              ]
            }
          ]
        };
        safeLocalJson.set(LS_KEYS.plan, fallback);
        return fallback;
      }
    },

    async getLatestPlan() {
      try {
        return await client.request("/api/plans/latest", { method: "GET" });
      } catch (e) {
        return safeLocalJson.get(LS_KEYS.plan, null);
      }
    },

    // Workouts CRUD (best-effort backend; fallback to local list)
    async listWorkouts() {
      try {
        return await client.request("/api/workouts", { method: "GET" });
      } catch (e) {
        return safeLocalJson.get(LS_KEYS.workouts, []);
      }
    },

    async createWorkout(entry) {
      try {
        return await client.request("/api/workouts", { method: "POST", body: entry });
      } catch (e) {
        const list = safeLocalJson.get(LS_KEYS.workouts, []);
        const created = { id: cryptoRandomId(), ...entry, createdAt: new Date().toISOString() };
        safeLocalJson.set(LS_KEYS.workouts, [created, ...list]);
        return created;
      }
    },

    async deleteWorkout(id) {
      try {
        return await client.request(`/api/workouts/${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch (e) {
        const list = safeLocalJson.get(LS_KEYS.workouts, []);
        safeLocalJson.set(
          LS_KEYS.workouts,
          list.filter((w) => String(w.id) !== String(id))
        );
        return { ok: true, source: "local" };
      }
    },

    // Nutrition
    async listNutrition() {
      try {
        return await client.request("/api/nutrition", { method: "GET" });
      } catch (e) {
        return safeLocalJson.get(LS_KEYS.nutrition, []);
      }
    },

    async addNutrition(entry) {
      try {
        return await client.request("/api/nutrition", { method: "POST", body: entry });
      } catch (e) {
        const list = safeLocalJson.get(LS_KEYS.nutrition, []);
        const created = { id: cryptoRandomId(), ...entry, createdAt: new Date().toISOString() };
        safeLocalJson.set(LS_KEYS.nutrition, [created, ...list]);
        return created;
      }
    },

    // Notifications
    async listNotifications() {
      try {
        return await client.request("/api/notifications", { method: "GET" });
      } catch (e) {
        return safeLocalJson.get(LS_KEYS.notifications, [
          {
            id: "welcome",
            kind: "info",
            title: "Welcome",
            message: "This is a demo notification feed with local fallback.",
            createdAt: new Date().toISOString()
          }
        ]);
      }
    }
  };
}

function cryptoRandomId() {
  // Avoid hard dependency on crypto in environments where it might not exist.
  try {
    // eslint-disable-next-line no-undef
    return crypto.randomUUID();
  } catch {
    return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }
}

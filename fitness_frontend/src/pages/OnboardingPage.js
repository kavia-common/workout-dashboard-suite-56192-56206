import React, { useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { createFitnessApi } from "../api/fitnessApi";
import { useToast } from "../components/toast/useToast";

/**
 * OnboardingPage collects baseline preferences and stores them via profile.
 */
export function OnboardingPage() {
  const api = useMemo(() => createFitnessApi(), []);
  const { pushToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    goal: "Strength",
    experience: "Intermediate",
    daysPerWeek: 3
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        name: form.name || "Guest",
        goal: `${form.goal} • ${form.experience}`,
        units: "metric",
        daysPerWeek: Number(form.daysPerWeek)
      });
      pushToast({ kind: "success", title: "Onboarding complete", message: "Profile updated." });
    } catch (err) {
      pushToast({ kind: "error", title: "Onboarding failed", message: err.message || "Try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Onboarding"
        subtitle="Tell us your goal and availability so the plan generator can personalize your training."
      />

      <div className="k-card">
        <div className="k-cardBody">
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <div className="k-row">
              <div>
                <label className="k-label">Name</label>
                <input
                  className="k-input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="k-label">Days per week</label>
                <select
                  className="k-input"
                  value={form.daysPerWeek}
                  onChange={(e) => setForm((f) => ({ ...f, daysPerWeek: Number(e.target.value) }))}
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} days
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="k-row">
              <div>
                <label className="k-label">Goal</label>
                <select
                  className="k-input"
                  value={form.goal}
                  onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
                >
                  <option>Strength</option>
                  <option>Hypertrophy</option>
                  <option>Endurance</option>
                  <option>General Fitness</option>
                </select>
              </div>

              <div>
                <label className="k-label">Experience</label>
                <select
                  className="k-input"
                  value={form.experience}
                  onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="k-btn k-btnPrimary" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { createFitnessApi } from "../api/fitnessApi";
import { useToast } from "../components/toast/useToast";

/**
 * PlanGeneratorPage calls backend to generate a plan (or uses local fallback).
 */
export function PlanGeneratorPage() {
  const api = useMemo(() => createFitnessApi(), []);
  const { pushToast } = useToast();

  const [input, setInput] = useState({
    goal: "Strength",
    daysPerWeek: 3,
    equipment: "Gym"
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  async function onGenerate() {
    setLoading(true);
    try {
      const p = await api.generatePlan(input);
      setPlan(p);
      pushToast({ kind: "success", title: "Plan generated", message: "Review the plan below." });
    } catch (e) {
      pushToast({ kind: "error", title: "Generation failed", message: e.message || "Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Plan Generator"
        subtitle="Generate a weekly training plan and adjust inputs to fit your schedule."
        actions={
          <button className="k-btn k-btnPrimary" onClick={onGenerate} disabled={loading}>
            {loading ? "Generating…" : "Generate plan"}
          </button>
        }
      />

      <div className="k-card" style={{ marginBottom: 14 }}>
        <div className="k-cardBody" style={{ display: "grid", gap: 12 }}>
          <div className="k-row">
            <div>
              <label className="k-label">Goal</label>
              <select
                className="k-input"
                value={input.goal}
                onChange={(e) => setInput((s) => ({ ...s, goal: e.target.value }))}
              >
                <option>Strength</option>
                <option>Hypertrophy</option>
                <option>Endurance</option>
                <option>General Fitness</option>
              </select>
            </div>
            <div>
              <label className="k-label">Days per week</label>
              <select
                className="k-input"
                value={input.daysPerWeek}
                onChange={(e) => setInput((s) => ({ ...s, daysPerWeek: Number(e.target.value) }))}
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} days
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="k-label">Equipment</label>
            <select
              className="k-input"
              value={input.equipment}
              onChange={(e) => setInput((s) => ({ ...s, equipment: e.target.value }))}
            >
              <option>Gym</option>
              <option>Home (dumbbells)</option>
              <option>Bodyweight</option>
            </select>
          </div>

          <div className="k-badge">
            Tip: When backend endpoints are finalized, this page will use them automatically via
            REACT_APP_API_BASE / REACT_APP_BACKEND_URL.
          </div>
        </div>
      </div>

      {plan ? (
        <div className="k-card">
          <div className="k-cardHeader">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 900 }}>Generated plan</div>
              <div className="k-badge">Generated at {new Date(plan.generatedAt).toLocaleString()}</div>
            </div>
          </div>
          <div className="k-cardBody" style={{ display: "grid", gap: 12 }}>
            {(plan.weeks || []).map((w) => (
              <div key={w.week} className="k-card" style={{ padding: 14 }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Week {w.week}</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {(w.days || []).map((d) => (
                    <div
                      key={d.day}
                      style={{
                        border: "1px solid var(--c-border)",
                        borderRadius: 12,
                        padding: 12
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ fontWeight: 900 }}>{d.day}</div>
                        <div className="k-badge">{d.focus}</div>
                      </div>
                      <ul style={{ margin: "10px 0 0 18px", color: "var(--c-muted)" }}>
                        {(d.items || []).map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="k-card">
          <div className="k-cardBody" style={{ color: "var(--c-muted)" }}>
            Generate a plan to see it here.
          </div>
        </div>
      )}
    </div>
  );
}

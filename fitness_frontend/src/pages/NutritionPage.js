import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { createFitnessApi } from "../api/fitnessApi";
import { useToast } from "../components/toast/useToast";

/**
 * NutritionPage: quick entries for calories and protein to build a simple log.
 */
export function NutritionPage() {
  const api = useMemo(() => createFitnessApi(), []);
  const { pushToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ date: todayISO(), calories: 2200, protein: 140 });

  async function refresh() {
    setLoading(true);
    try {
      const list = await api.listNutrition();
      setItems(Array.isArray(list) ? list : list.items || []);
    } catch (e) {
      pushToast({ kind: "error", title: "Nutrition", message: e.message || "Failed to load." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onAdd() {
    try {
      const created = await api.addNutrition(draft);
      setItems((prev) => [created, ...prev]);
      pushToast({ kind: "success", title: "Saved", message: "Nutrition entry added." });
    } catch (e) {
      pushToast({ kind: "error", title: "Save failed", message: e.message || "Try again." });
    }
  }

  return (
    <div>
      <PageHeader
        title="Nutrition"
        subtitle="Log simple daily nutrition targets. This can be expanded into detailed macros later."
        actions={
          <button className="k-btn" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        }
      />

      <div className="k-card" style={{ marginBottom: 14 }}>
        <div className="k-cardBody" style={{ display: "grid", gap: 12 }}>
          <div className="k-row">
            <div>
              <label className="k-label">Date</label>
              <input
                className="k-input"
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="k-label">Calories</label>
              <input
                className="k-input"
                type="number"
                value={draft.calories}
                onChange={(e) => setDraft((d) => ({ ...d, calories: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label className="k-label">Protein (g)</label>
            <input
              className="k-input"
              type="number"
              value={draft.protein}
              onChange={(e) => setDraft((d) => ({ ...d, protein: Number(e.target.value) }))}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="k-btn k-btnPrimary" onClick={onAdd}>
              Add entry
            </button>
          </div>
        </div>
      </div>

      <div className="k-card">
        <div className="k-cardBody">
          {loading ? (
            <div className="k-badge">Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "var(--c-muted)" }}>No entries yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    border: "1px solid var(--c-border)",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 900 }}>{(it.date || it.createdAt || "").slice(0, 10)}</div>
                    <div style={{ color: "var(--c-muted)", fontSize: 13 }}>
                      {it.calories} kcal • {it.protein} g protein
                    </div>
                  </div>
                  <div className="k-badge">Logged</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

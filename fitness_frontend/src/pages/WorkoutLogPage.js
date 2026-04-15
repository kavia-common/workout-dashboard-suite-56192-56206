import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Modal } from "../components/modals/Modal";
import { createFitnessApi } from "../api/fitnessApi";
import { useToast } from "../components/toast/useToast";

/**
 * WorkoutLogPage shows recent workouts and allows logging a workout session.
 */
export function WorkoutLogPage() {
  const api = useMemo(() => createFitnessApi(), []);
  const { pushToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState({ date: todayISO(), focus: "Full Body", notes: "" });

  async function refresh() {
    setLoading(true);
    try {
      const list = await api.listWorkouts();
      setWorkouts(Array.isArray(list) ? list : list.items || []);
    } catch (e) {
      pushToast({ kind: "error", title: "Workouts", message: e.message || "Failed to load." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate() {
    try {
      const created = await api.createWorkout(draft);
      setWorkouts((prev) => [created, ...prev]);
      pushToast({ kind: "success", title: "Workout logged", message: "Saved successfully." });
      setEditorOpen(false);
      setDraft({ date: todayISO(), focus: "Full Body", notes: "" });
    } catch (e) {
      pushToast({ kind: "error", title: "Save failed", message: e.message || "Try again." });
    }
  }

  async function onDelete(id) {
    try {
      await api.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => String(w.id) !== String(id)));
      pushToast({ kind: "success", title: "Deleted", message: "Workout removed." });
    } catch (e) {
      pushToast({ kind: "error", title: "Delete failed", message: e.message || "Try again." });
    }
  }

  return (
    <div>
      <PageHeader
        title="Workout Log"
        subtitle="Track your sessions. Add notes, focus, and date for quick review."
        actions={
          <>
            <button className="k-btn" onClick={refresh} disabled={loading}>
              Refresh
            </button>
            <button className="k-btn k-btnPrimary" onClick={() => setEditorOpen(true)}>
              Log workout
            </button>
          </>
        }
      />

      <div className="k-card">
        <div className="k-cardBody">
          {loading ? (
            <div className="k-badge">Loading…</div>
          ) : workouts.length === 0 ? (
            <div style={{ color: "var(--c-muted)" }}>No workouts logged yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {workouts.map((w) => (
                <div
                  key={w.id}
                  style={{
                    border: "1px solid var(--c-border)",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 6
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 900 }}>{w.focus || "Workout"}</div>
                    <div className="k-badge">{(w.date || w.createdAt || "").slice(0, 10)}</div>
                  </div>
                  {w.notes ? <div style={{ color: "var(--c-muted)" }}>{w.notes}</div> : null}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="k-btn k-btnDanger" onClick={() => onDelete(w.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={editorOpen}
        title="Log workout"
        onClose={() => setEditorOpen(false)}
        footer={
          <>
            <button className="k-btn" onClick={() => setEditorOpen(false)}>
              Cancel
            </button>
            <button className="k-btn k-btnPrimary" onClick={onCreate}>
              Save
            </button>
          </>
        }
      >
        <div style={{ display: "grid", gap: 12 }}>
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
              <label className="k-label">Focus</label>
              <select
                className="k-input"
                value={draft.focus}
                onChange={(e) => setDraft((d) => ({ ...d, focus: e.target.value }))}
              >
                <option>Full Body</option>
                <option>Upper</option>
                <option>Lower</option>
                <option>Push</option>
                <option>Pull</option>
                <option>Legs</option>
                <option>Conditioning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="k-label">Notes</label>
            <textarea
              className="k-input"
              style={{ minHeight: 100 }}
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              placeholder="Top sets, RPE, conditioning notes…"
            />
          </div>
        </div>
      </Modal>
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

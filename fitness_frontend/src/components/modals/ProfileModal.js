import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { createFitnessApi } from "../../api/fitnessApi";
import { useToast } from "../toast/useToast";

/**
 * Profile modal: edit name/goal/units. Saves via backend if available, else local fallback.
 */
export function ProfileModal({ open, onClose }) {
  const api = useMemo(() => createFitnessApi(), []);
  const { pushToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: "", goal: "", units: "metric" });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .getProfile()
      .then((p) => setProfile(p))
      .catch((e) =>
        pushToast({ kind: "error", title: "Profile", message: e.message || "Failed to load." })
      )
      .finally(() => setLoading(false));
  }, [open, api, pushToast]);

  async function onSave() {
    setLoading(true);
    try {
      await api.updateProfile(profile);
      pushToast({ kind: "success", title: "Profile saved", message: "Your settings were updated." });
      onClose?.();
    } catch (e) {
      pushToast({ kind: "error", title: "Save failed", message: e.message || "Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Profile"
      onClose={onClose}
      footer={
        <>
          <button className="k-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="k-btn k-btnPrimary" onClick={onSave} disabled={loading}>
            Save
          </button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <label className="k-label">Name</label>
          <input
            className="k-input"
            value={profile.name || ""}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="k-label">Primary goal</label>
          <input
            className="k-input"
            value={profile.goal || ""}
            onChange={(e) => setProfile((p) => ({ ...p, goal: e.target.value }))}
            placeholder="Strength, hypertrophy, endurance..."
          />
        </div>

        <div>
          <label className="k-label">Units</label>
          <select
            className="k-input"
            value={profile.units || "metric"}
            onChange={(e) => setProfile((p) => ({ ...p, units: e.target.value }))}
          >
            <option value="metric">Metric (kg)</option>
            <option value="imperial">Imperial (lb)</option>
          </select>
        </div>

        {loading ? <div className="k-badge">Loading…</div> : null}
      </div>
    </Modal>
  );
}

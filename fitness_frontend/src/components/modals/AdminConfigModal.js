import React, { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { getEnvConfig } from "../../utils/env";
import { safeLocalJson } from "../../utils/localJson";
import { useToast } from "../toast/useToast";

const LS_KEY = "fitness.adminConfig";

/**
 * Admin/config modal: shows environment wiring and allows setting local feature toggles.
 * This is intentionally local-only; backend config endpoints can be integrated later.
 */
export function AdminConfigModal({ open, onClose }) {
  const env = useMemo(() => getEnvConfig(), []);
  const { pushToast } = useToast();
  const [config, setConfig] = useState(() =>
    safeLocalJson.get(LS_KEY, {
      enableExperimentalCharts: false,
      notes: ""
    })
  );

  function onSave() {
    safeLocalJson.set(LS_KEY, config);
    pushToast({ kind: "success", title: "Config saved", message: "Stored locally in this browser." });
    onClose?.();
  }

  return (
    <Modal
      open={open}
      title="Admin / Config"
      onClose={onClose}
      footer={
        <>
          <button className="k-btn" onClick={onClose}>
            Close
          </button>
          <button className="k-btn k-btnPrimary" onClick={onSave}>
            Save
          </button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 14 }}>
        <div className="k-card">
          <div className="k-cardBody" style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 900 }}>Environment</div>
            <div style={{ color: "var(--c-muted)", fontSize: 13 }}>
              These values come from the container .env via REACT_APP_* variables.
            </div>
            <EnvRow k="REACT_APP_API_BASE/REACT_APP_BACKEND_URL" v={env.apiBaseUrl} />
            <EnvRow k="REACT_APP_WS_URL" v={env.wsUrl} />
            <EnvRow k="REACT_APP_FRONTEND_URL" v={env.frontendUrl} />
            <EnvRow k="REACT_APP_FEATURE_FLAGS" v={env.featureFlags} />
            <EnvRow k="REACT_APP_EXPERIMENTS_ENABLED" v={String(env.experimentsEnabled)} />
          </div>
        </div>

        <div className="k-card">
          <div className="k-cardBody" style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>Local toggles</div>

            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={!!config.enableExperimentalCharts}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, enableExperimentalCharts: e.target.checked }))
                }
              />
              Enable experimental charts
            </label>

            <div>
              <label className="k-label">Notes</label>
              <textarea
                className="k-input"
                style={{ minHeight: 90 }}
                value={config.notes}
                onChange={(e) => setConfig((c) => ({ ...c, notes: e.target.value }))}
                placeholder="Internal notes…"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function EnvRow({ k, v }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 10 }}>
      <div style={{ fontSize: 12, color: "var(--c-muted)" }}>{k}</div>
      <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis" }}>
        {v || <span style={{ color: "var(--c-error)" }}>Not set</span>}
      </div>
    </div>
  );
}

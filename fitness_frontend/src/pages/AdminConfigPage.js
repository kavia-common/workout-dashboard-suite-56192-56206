import React, { useMemo } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { getEnvConfig } from "../utils/env";

/**
 * AdminConfigPage provides a dedicated admin section in addition to the header modal.
 */
export function AdminConfigPage() {
  const env = useMemo(() => getEnvConfig(), []);

  return (
    <div>
      <PageHeader
        title="Admin / Config"
        subtitle="Operational view of environment wiring and feature flags."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
        <StatCard label="Node env" value={env.nodeEnv} helper="From REACT_APP_NODE_ENV / NODE_ENV" />
        <StatCard label="Log level" value={env.logLevel} helper="From REACT_APP_LOG_LEVEL" accent="secondary" />
        <StatCard label="Health path" value={env.healthcheckPath} helper="From REACT_APP_HEALTHCHECK_PATH" accent="success" />
      </div>

      <div className="k-card">
        <div className="k-cardHeader">
          <div style={{ fontWeight: 900 }}>Environment values</div>
          <div style={{ marginTop: 6, color: "var(--c-muted)", fontSize: 13 }}>
            Values are shown for debugging. Do not paste secrets in client-side env vars.
          </div>
        </div>
        <div className="k-cardBody" style={{ display: "grid", gap: 8 }}>
          <Row k="API base URL" v={env.apiBaseUrl} />
          <Row k="Backend URL" v={env.backendUrl} />
          <Row k="WebSocket URL" v={env.wsUrl} />
          <Row k="Frontend URL" v={env.frontendUrl} />
          <Row k="Feature flags" v={env.featureFlags} />
          <Row k="Experiments enabled" v={String(env.experimentsEnabled)} />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12 }}>
      <div style={{ color: "var(--c-muted)", fontSize: 13 }}>{k}</div>
      <div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis" }}>
        {v || <span style={{ color: "var(--c-error)" }}>Not set</span>}
      </div>
    </div>
  );
}

import React from "react";

/**
 * StatCard shows a label/value pair with an optional helper text.
 */
export function StatCard({ label, value, helper, accent = "primary" }) {
  const accentColor =
    accent === "secondary"
      ? "var(--c-secondary)"
      : accent === "success"
        ? "var(--c-success)"
        : accent === "error"
          ? "var(--c-error)"
          : "var(--c-primary)";

  return (
    <div className="k-card" style={{ padding: 16, position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-40px auto auto -40px",
          width: 120,
          height: 120,
          borderRadius: 999,
          background: accentColor,
          opacity: 0.1
        }}
      />
      <div style={{ fontSize: 12, color: "var(--c-muted)" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginTop: 6 }}>
        {value}
      </div>
      {helper ? <div style={{ marginTop: 6, fontSize: 13, color: "var(--c-muted)" }}>{helper}</div> : null}
    </div>
  );
}

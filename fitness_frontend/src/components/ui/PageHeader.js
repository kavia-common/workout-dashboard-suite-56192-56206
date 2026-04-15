import React from "react";

/**
 * PageHeader standardizes the main page title and actions layout.
 */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={styles.wrap}>
      <div>
        <div style={styles.title}>{title}</div>
        {subtitle ? <div style={styles.subtitle}>{subtitle}</div> : null}
      </div>
      <div style={styles.actions}>{actions}</div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14
  },
  title: { fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em" },
  subtitle: { marginTop: 4, fontSize: 13, color: "var(--c-muted)" },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }
};

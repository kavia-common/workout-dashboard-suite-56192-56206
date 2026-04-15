import React, { useEffect } from "react";

/**
 * Generic modal with a backdrop and basic a11y attributes.
 */
export function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={styles.layer} role="dialog" aria-modal="true" aria-label={title || "Modal"}>
      <div style={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div style={styles.modal} className="k-card">
        <div style={styles.header}>
          <div style={styles.title}>{title}</div>
          <button className="k-btn" style={styles.close} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div style={styles.body}>{children}</div>
        {footer ? <div style={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}

const styles = {
  layer: { position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center" },
  backdrop: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.45)" },
  modal: {
    position: "relative",
    width: 720,
    maxWidth: "calc(100vw - 24px)",
    maxHeight: "calc(100vh - 24px)",
    overflow: "auto"
  },
  header: {
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--c-border)"
  },
  title: { fontWeight: 900, letterSpacing: "-0.02em" },
  close: { padding: "4px 10px" },
  body: { padding: 14 },
  footer: {
    padding: 14,
    borderTop: "1px solid var(--c-border)",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10
  }
};

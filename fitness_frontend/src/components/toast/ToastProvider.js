import React, { createContext, useCallback, useMemo, useState } from "react";

const ToastContext = createContext(null);

/**
 * ToastProvider provides transient UI feedback messages across the app.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((t) => {
    const id = t.id || `toast_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    const toast = {
      id,
      kind: t.kind || "info", // info | success | error
      title: t.title || "",
      message: t.message || "",
      timeoutMs: typeof t.timeoutMs === "number" ? t.timeoutMs : 3000
    };
    setToasts((prev) => [toast, ...prev]);

    if (toast.timeoutMs > 0) {
      window.setTimeout(() => remove(id), toast.timeoutMs);
    }
  }, [remove]);

  const value = useMemo(() => ({ pushToast, remove }), [pushToast, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={styles.wrap} aria-live="polite" aria-relevant="additions removals">
        {toasts.map((t) => (
          <div key={t.id} style={{ ...styles.toast, ...kindStyles[t.kind] }}>
            <div style={styles.titleRow}>
              <div style={styles.title}>{t.title}</div>
              <button className="k-btn" style={styles.closeBtn} onClick={() => remove(t.id)}>
                ×
              </button>
            </div>
            {t.message ? <div style={styles.message}>{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastContext };

const styles = {
  wrap: {
    position: "fixed",
    right: 16,
    top: 16,
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: 340,
    maxWidth: "calc(100vw - 32px)"
  },
  toast: {
    background: "var(--c-surface)",
    border: "1px solid var(--c-border)",
    borderRadius: 14,
    boxShadow: "var(--shadow-md)",
    padding: 12
  },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { fontWeight: 800, letterSpacing: "-0.01em" },
  message: { marginTop: 6, color: "var(--c-muted)", fontSize: 13, lineHeight: 1.4 },
  closeBtn: { padding: "4px 10px", borderRadius: 10 }
};

const kindStyles = {
  info: { borderColor: "rgba(59,130,246,0.35)" },
  success: { borderColor: "rgba(16,185,129,0.45)" },
  error: { borderColor: "rgba(239,68,68,0.45)" }
};

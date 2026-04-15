import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { createFitnessApi } from "../api/fitnessApi";
import { useToast } from "../components/toast/useToast";

/**
 * NotificationsPage shows backend-driven notifications (or local fallback list).
 */
export function NotificationsPage() {
  const api = useMemo(() => createFitnessApi(), []);
  const { pushToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function refresh() {
    setLoading(true);
    try {
      const list = await api.listNotifications();
      setItems(Array.isArray(list) ? list : list.items || []);
    } catch (e) {
      pushToast({ kind: "error", title: "Notifications", message: e.message || "Failed to load." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Reminders and updates from the system."
        actions={
          <button className="k-btn" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        }
      />

      <div className="k-card">
        <div className="k-cardBody">
          {loading ? (
            <div className="k-badge">Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "var(--c-muted)" }}>No notifications.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((n) => (
                <div
                  key={n.id}
                  style={{
                    border: "1px solid var(--c-border)",
                    borderRadius: 12,
                    padding: 12
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 900 }}>{n.title || "Notification"}</div>
                    <div className="k-badge">{(n.createdAt || "").slice(0, 10)}</div>
                  </div>
                  {n.message ? <div style={{ marginTop: 6, color: "var(--c-muted)" }}>{n.message}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

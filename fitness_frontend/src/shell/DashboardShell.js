import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ProfileModal } from "../components/modals/ProfileModal";
import { AdminConfigModal } from "../components/modals/AdminConfigModal";
import { useToast } from "../components/toast/useToast";
import { getEnvConfig } from "../utils/env";

/**
 * DashboardShell provides the main responsive layout:
 * - Left sidebar navigation
 * - Top header with page title and global actions
 * - Main content area via <Outlet />
 */
export function DashboardShell() {
  const location = useLocation();
  const { pushToast } = useToast();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const title = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/onboarding")) return "Onboarding";
    if (path.startsWith("/plans")) return "Workout Plans";
    if (path.startsWith("/workouts")) return "Workout Log";
    if (path.startsWith("/nutrition")) return "Nutrition";
    if (path.startsWith("/notifications")) return "Notifications";
    if (path.startsWith("/admin")) return "Admin / Config";
    return "Progress Dashboard";
  }, [location.pathname]);

  const env = getEnvConfig();

  return (
    <div style={styles.root}>
      <aside
        style={{
          ...styles.sidebar,
          ...(mobileNavOpen ? styles.sidebarMobileOpen : {})
        }}
        aria-label="Sidebar navigation"
      >
        <div style={styles.brandRow}>
          <div style={styles.brandMark} aria-hidden="true" />
          <div>
            <div style={styles.brandTitle}>Fitness</div>
            <div style={styles.brandSubtitle}>Dashboard</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <NavItem to="/dashboard" label="Dashboard" onClick={() => setMobileNavOpen(false)} />
          <NavItem to="/onboarding" label="Onboarding" onClick={() => setMobileNavOpen(false)} />
          <NavItem to="/plans" label="Plan Generator" onClick={() => setMobileNavOpen(false)} />
          <NavItem to="/workouts" label="Workout Log" onClick={() => setMobileNavOpen(false)} />
          <NavItem to="/nutrition" label="Nutrition" onClick={() => setMobileNavOpen(false)} />
          <NavItem to="/notifications" label="Notifications" onClick={() => setMobileNavOpen(false)} />
          <NavItem to="/admin" label="Admin" onClick={() => setMobileNavOpen(false)} />
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.envLine}>
            <span style={styles.envLabel}>API:</span>
            <span title={env.apiBaseUrl} style={styles.envValue}>
              {env.apiBaseUrl || "Not configured"}
            </span>
          </div>
        </div>
      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
          <button
            className="k-btn"
            onClick={() => setMobileNavOpen((v) => !v)}
            style={styles.mobileMenuBtn}
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          >
            Menu
          </button>

          <div style={styles.headerTitleWrap}>
            <div style={styles.headerTitle}>{title}</div>
            <div style={styles.headerSubtitle}>Plan • Log • Progress</div>
          </div>

          <div style={styles.headerActions}>
            <button className="k-btn" onClick={() => setProfileOpen(true)}>
              Profile
            </button>
            <button className="k-btn" onClick={() => setAdminOpen(true)}>
              Config
            </button>
            <button
              className="k-btn k-btnPrimary"
              onClick={() =>
                pushToast({
                  kind: "success",
                  title: "Synced",
                  message: "Demo action: settings saved locally."
                })
              }
            >
              Quick Save
            </button>
          </div>
        </header>

        <main style={styles.content}>
          <div className="k-container">
            <Outlet />
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <div
          style={styles.backdrop}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <AdminConfigModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : {})
      })}
    >
      {label}
    </NavLink>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "280px 1fr"
  },
  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    background: "var(--c-surface)",
    borderRight: "1px solid var(--c-border)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    zIndex: 3
  },
  sidebarMobileOpen: {
    position: "fixed",
    left: 0,
    width: 280
  },
  brandRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 8,
    borderRadius: 14
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(16,185,129,1))",
    boxShadow: "var(--shadow-sm)"
  },
  brandTitle: { fontWeight: 800, letterSpacing: "-0.02em" },
  brandSubtitle: { fontSize: 12, color: "var(--c-muted)" },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 12
  },
  navItem: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--c-border)",
    color: "var(--c-text)",
    background: "rgba(17,24,39,0.01)"
  },
  navItemActive: {
    borderColor: "rgba(59,130,246,0.5)",
    background: "rgba(59,130,246,0.08)"
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 12,
    borderTop: "1px solid var(--c-border)"
  },
  envLine: { display: "flex", gap: 8, alignItems: "baseline" },
  envLabel: { fontSize: 12, color: "var(--c-muted)" },
  envValue: {
    fontSize: 12,
    color: "var(--c-text)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  main: { minWidth: 0 },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    background: "rgba(249,250,251,0.92)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid var(--c-border)"
  },
  mobileMenuBtn: { display: "none" },
  headerTitleWrap: { display: "flex", flexDirection: "column", gap: 2 },
  headerTitle: { fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" },
  headerSubtitle: { fontSize: 12, color: "var(--c-muted)" },
  headerActions: { display: "flex", gap: 10, alignItems: "center" },
  content: { padding: 16 },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.45)",
    zIndex: 2
  }
};

// Responsive tweaks
const media = window?.matchMedia?.("(max-width: 980px)");
if (media?.matches) {
  styles.root.gridTemplateColumns = "1fr";
  styles.sidebar.display = "none";
  styles.mobileMenuBtn.display = "inline-flex";
}

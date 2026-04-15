import React, { useMemo } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { safeLocalJson } from "../utils/localJson";

/**
 * ProgressPage: a dashboard-style overview with sample progress charts.
 * Real metrics can be wired to backend endpoints once defined.
 */
export function ProgressPage() {
  const data = useMemo(() => {
    const fallback = [
      { week: "W1", volume: 12, weight: 80 },
      { week: "W2", volume: 14, weight: 82 },
      { week: "W3", volume: 13, weight: 83 },
      { week: "W4", volume: 15, weight: 84 },
      { week: "W5", volume: 16, weight: 86 }
    ];
    return safeLocalJson.get("fitness.progress.sample", fallback);
  }, []);

  return (
    <div>
      <PageHeader
        title="Progress"
        subtitle="Weekly overview. Charts are sample data until backend metrics endpoints are confirmed."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
        <StatCard label="Consistency" value="4 / 5" helper="Weeks with ≥3 sessions" accent="success" />
        <StatCard label="Volume trend" value="+12%" helper="Last 4 weeks" accent="primary" />
        <StatCard label="Bodyweight" value="84 kg" helper="Rolling 7d average" accent="secondary" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12 }}>
        <div className="k-card">
          <div className="k-cardHeader">
            <div style={{ fontWeight: 900 }}>Training volume</div>
            <div style={{ color: "var(--c-muted)", fontSize: 13, marginTop: 6 }}>
              Total weekly sets (sample).
            </div>
          </div>
          <div className="k-cardBody" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="k-card">
          <div className="k-cardHeader">
            <div style={{ fontWeight: 900 }}>Top priorities</div>
            <div style={{ color: "var(--c-muted)", fontSize: 13, marginTop: 6 }}>
              Suggestions update as you log workouts.
            </div>
          </div>
          <div className="k-cardBody" style={{ display: "grid", gap: 10 }}>
            <div style={tipStyle}>
              <div style={{ fontWeight: 900 }}>Recovery</div>
              <div style={{ color: "var(--c-muted)", fontSize: 13 }}>Aim for 7–8h sleep.</div>
            </div>
            <div style={tipStyle}>
              <div style={{ fontWeight: 900 }}>Protein</div>
              <div style={{ color: "var(--c-muted)", fontSize: 13 }}>Target 1.6–2.2 g/kg/day.</div>
            </div>
            <div style={tipStyle}>
              <div style={{ fontWeight: 900 }}>Cardio</div>
              <div style={{ color: "var(--c-muted)", fontSize: 13 }}>2x Zone 2 sessions this week.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="k-card">
        <div className="k-cardBody" style={{ color: "var(--c-muted)" }}>
          Next: connect backend metrics endpoints (e.g. /api/progress) to replace sample data.
        </div>
      </div>
    </div>
  );
}

const tipStyle = {
  border: "1px solid var(--c-border)",
  borderRadius: 12,
  padding: 12,
  background: "rgba(17,24,39,0.01)"
};

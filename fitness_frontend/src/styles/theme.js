/**
 * Central theme tokens.
 * Palette requirements:
 * - primary #3B82F6
 * - secondary #10B981
 * - success #F59E0B
 * - error #EF4444
 * - background #f9fafb
 * - surface #ffffff
 * - text #111827
 */
export const theme = {
  colors: {
    primary: "#3B82F6",
    secondary: "#10B981",
    success: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    mutedText: "#6B7280",
    border: "#E5E7EB"
  },
  radii: {
    sm: "10px",
    md: "14px",
    lg: "18px"
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 6px 18px rgba(17, 24, 39, 0.08)"
  },
  spacing: (n) => `${n * 8}px`
};

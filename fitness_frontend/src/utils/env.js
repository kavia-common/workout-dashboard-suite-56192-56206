/**
 * Read environment configuration without hardcoding values.
 * The orchestrator will populate these values in the container .env file.
 */
export function getEnvConfig() {
  const apiBaseFromVar = process.env.REACT_APP_API_BASE;
  const backendFromVar = process.env.REACT_APP_BACKEND_URL;
  const wsFromVar = process.env.REACT_APP_WS_URL;
  const frontendFromVar = process.env.REACT_APP_FRONTEND_URL;

  const apiBaseUrl = apiBaseFromVar || backendFromVar || "";

  return {
    apiBaseUrl,
    backendUrl: backendFromVar || "",
    wsUrl: wsFromVar || "",
    frontendUrl: frontendFromVar || "",
    nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development",
    logLevel: process.env.REACT_APP_LOG_LEVEL || "info",
    healthcheckPath: process.env.REACT_APP_HEALTHCHECK_PATH || "/health",
    featureFlags: process.env.REACT_APP_FEATURE_FLAGS || "",
    experimentsEnabled: process.env.REACT_APP_EXPERIMENTS_ENABLED === "true"
  };
}

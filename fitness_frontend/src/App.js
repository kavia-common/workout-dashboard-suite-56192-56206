import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "./components/toast/ToastProvider";

/**
 * The application root that wires routing and global UI providers.
 * Uses BrowserRouter for client-side navigation and a ToastProvider for feedback.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardShell } from "../shell/DashboardShell";
import { OnboardingPage } from "../pages/OnboardingPage";
import { PlanGeneratorPage } from "../pages/PlanGeneratorPage";
import { WorkoutLogPage } from "../pages/WorkoutLogPage";
import { ProgressPage } from "../pages/ProgressPage";
import { NutritionPage } from "../pages/NutritionPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { AdminConfigPage } from "../pages/AdminConfigPage";

/**
 * Routes for the entire application. All app pages are shown within the DashboardShell.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProgressPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/plans" element={<PlanGeneratorPage />} />
        <Route path="/workouts" element={<WorkoutLogPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin" element={<AdminConfigPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

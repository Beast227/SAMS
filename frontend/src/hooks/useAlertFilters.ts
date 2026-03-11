import { type Alert } from "../types/Alerts";

export const useAlertFilters = (alerts: Alert[]) => {
  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const resolvedAlerts = alerts.filter((a) => a.isResolved);

  const sortBySeverity = (list: Alert[]) => {
    const priority = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return [...list].sort(
      (a, b) => priority[a.severity] - priority[b.severity],
    );
  };

  return { activeAlerts, resolvedAlerts, sortBySeverity };
};

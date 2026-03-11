import { type AlertType, type AlertSeverity } from "../types/Alerts";

export const getAlertTheme = (severity: AlertSeverity) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-700 border-red-200";
    case "WARNING":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

export const formatAlertLabel = (type: AlertType) => {
  return type.replace(/_/g, " ").toLowerCase(); 
};

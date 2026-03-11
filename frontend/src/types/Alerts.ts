export type AlertCategory =
  | "PERFORMANCE"
  | "THERMAL"
  | "BATTERY"
  | "CONNECTIVITY";
export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertType =
  | "CPU_USAGE_HIGH"
  | "RAM_USAGE_HIGH"
  | "DISK_SPACE_LOW"
  | "THERMAL_CRITICAL"
  | "BATTERY_LEVEL_LOW"
  | "BATTERY_HEALTH_DEGRADED"
  | "HEARTBEAT_LOST";

export interface Alert {
  id: string;
  assetId: string;
  type: AlertType;
  category: AlertCategory;
  severity: AlertSeverity;
  message: string;
  isResolved: boolean;
  createdAt: string; 
  updatedAt: string;
}

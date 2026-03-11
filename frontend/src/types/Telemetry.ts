export type AssetStatus = "ONLINE" | "OFFLINE" | "MAINTENANCE";
export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface TelemetryData {
  cpuTotalUsagePercent: number;
  cpuTemperature: number;
  memmoryUsagePercent: number; 
  batteryPercent: number;
  batteryPowerPlugged: boolean;
  timeStamp: string;
}

export interface Asset {
  id: string;
  hostname: string;
  ipAddress: string;
  status: AssetStatus;
  latestTelemetry?: TelemetryData; 
}

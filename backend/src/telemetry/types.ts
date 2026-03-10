export interface ISystemTelemetryPayload {
  mac_address: string;
  timestamp: number;
  cpu: {
    cpu_name: string;
    total_usage_percent: number;
    per_core_usage_percent: number[];
    logical_cores: number;
    physical_cores: number;
    frequency: number;
    temperature: number | null;
  };
  memory: {
    total: number;
    available: number;
    used: number;
    usage_percent: number;
  };
  battery: {
    percent: number | null;
    power_plugged: boolean;
    seconds_left: number | null;
  };
}

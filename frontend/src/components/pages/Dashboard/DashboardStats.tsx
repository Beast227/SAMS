import { Server, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { useDashboardStats } from "../../../hooks/queries/useDashboard";
import StatSkeleton from "./StatSkeleton";
import { useEffect } from "react";
import { toast } from "sonner";
import { useDashboardStore } from "../../../store/useDashBoardStore";

export default function DashboardStats() {
  const { data, isLoading, isError } = useDashboardStats();
  const updateStats = useDashboardStore(state => state.updateStats)
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load dashboard stats");
    }
  }, [isError]);

  useEffect(() => {
    if (data?.activeAlerts) {
      updateStats(data.actitveAlerts);
    }
  })

  const stats = [
    {
      label: "Total Assets",
      value: data?.totalAssets ?? 0,
      icon: <Server size={20} />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Online",
      value: data?.onlineAssets ?? 0,
      icon: <Activity size={20} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Offline",
      value: data?.offlineAssets ?? 0,
      icon: <ShieldCheck size={20} />,
      color: "text-gray-400",
      bg: "bg-gray-500/10",
    },
    {
      label: "Active Alerts",
      value: data?.activeAlerts ?? 0,
      icon: <AlertTriangle size={20} />,
      color: "text-red-400",
      bg: "bg-red-500/10",
      alert: (data?.activeAlerts ?? 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-5 bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-sm hover:border-(--color-primary)/30 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>

            {!isLoading && stat.alert && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>

          <div>
            {isLoading ? <StatSkeleton /> : (
              <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
            )}

            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
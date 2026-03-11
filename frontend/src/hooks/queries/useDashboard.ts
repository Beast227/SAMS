import { useQuery } from "@tanstack/react-query";
import { SERVER_URL } from "../../config/config";
import { useAuthStore } from "../../store/useAuthStore";

export const useDashboardStats = () => {
  const token = useAuthStore(state => state.token);
  return useQuery({
    queryKey: ["dashboardStats"],

    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}/api/asset/analysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const json = await res.json();
      return json.data;
    },

    // 👇 important optimizations
    staleTime: 1000 * 60 * 2, // data fresh for 2 min
    gcTime: 1000 * 60 * 10, // cache kept for 10 min
    refetchOnWindowFocus: true, // refresh when user returns
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore"
import { SERVER_URL } from "../../config/config";


export const useResolveAlerts = () => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assetId: string) => {
            const response = await fetch(`${SERVER_URL}/api/alert/${assetId}`, {
                method: "PATCH",
                headers: {
                    "authorization": `Bearer ${token}`,
                },
            });
                
                if (!response.ok) throw new Error("Failed to resolve alerts");
                return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["war-room-alerts"] });
        }
    });
};
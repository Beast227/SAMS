import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { SERVER_URL } from "../../config/config";


export const useAssets = (page: number, limit: number = 10) => {
    const token = useAuthStore((state => state.token));

    return useQuery({
        queryKey: ["assets", page, limit],
        enabled: !!token,
        queryFn: async () => {
            const response = await fetch(`${SERVER_URL}/api/asset?page=${page}&limit=${limit}`, {
                headers: { authorization: `Bearer ${token}` },
                method: "GET",
            });

            if (!response.ok) throw new Error("Failed to fetch assets");
            return response.json();
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    });
};



export const useDeleteAsset = () => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        // The actual fetch request to your Express server
        mutationFn: async (macAddr: string) => {
            const response = await fetch(`${SERVER_URL}/api/asset/delete?macAddress=${macAddr}`, {
                method: "DELETE",
                headers: {
                    "authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete asset");
            }
            return response.json();
        },

        // This runs the millisecond the backend confirms the deletion was successful
        onSuccess: () => {
            // Tell TanStack to throw away the old data and fetch fresh data
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            console.error("Deletion failed:", error);
            // You can trigger a toast notification here later
        }
    });
};
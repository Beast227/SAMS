import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_URL } from "../../config/config";
import { useAuthStore } from "../../store/useAuthStore";

interface UpdateAssetPayload {
  id: string;
  name: string;
}

export const useUpdateAsset = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: UpdateAssetPayload) => {
      const response = await fetch(`${SERVER_URL}/api/asset?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update asset");
      }
      return response.json();
    },
    onSuccess: () => {
      // Instantly refresh the table data
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) => {
      console.error("Update failed:", error);
    }
  });
};
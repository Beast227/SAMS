import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SERVER_URL } from "../../config/config";
import { useAuthStore } from "../../store/useAuthStore";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await fetch(`${SERVER_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      return data;
    },
    onSuccess: (data) => {
      // This also handles localStorage automatically based on our store setup
      setAuth(data.user, data.token);

      toast.success(data.message || "Access Granted");
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Server connection failed", {
        description: error.message,
      });
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await fetch(`${SERVER_URL}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.status === 409) {
        throw new Error(data.message || "Username is already taken");
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Account created! Please login.");
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

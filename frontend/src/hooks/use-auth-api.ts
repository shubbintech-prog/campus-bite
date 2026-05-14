import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data, data.token);
      toast.success(`Welcome back, ${data.full_name}!`);
      const role = data.role;
      if (["super_admin", "auditor", "support"].includes(role)) navigate("/dashboard/admin");
      else if (role === "vendor") navigate("/dashboard/vendor");
      else navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data, data.token);
      toast.success("Registration successful!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

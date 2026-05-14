import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users");
      return response.data;
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    },
  });
};

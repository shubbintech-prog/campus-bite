import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useVendors = (search?: string) => {
  return useQuery({
    queryKey: ["vendors", search],
    queryFn: async () => {
      const response = await apiClient.get("/vendors", {
        params: { search },
      });
      return response.data;
    },
  });
};

export const useVendorMenu = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor-menu", vendorId],
    queryFn: async () => {
      const response = await apiClient.get(`/menu/vendors/${vendorId}/menu`);
      return response.data;
    },
    enabled: !!vendorId,
  });
};

export const useMenuItems = (search?: string) => {
  return useQuery({
    queryKey: ["menu-items", search],
    queryFn: async () => {
      const response = await apiClient.get("/menu/items", {
        params: { search },
      });
      return response.data;
    },
  });
};

export const useVendorDetails = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      const response = await apiClient.get(`/vendors/${vendorId}`);
      return response.data;
    },
    enabled: !!vendorId,
  });
};

export const useAddMenuItem = () => {
  return useMutation({
    mutationFn: async (itemData: any) => {
      const response = await apiClient.post("/menu/items", itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useUpdateMenuItem = () => {
  return useMutation({
    mutationFn: async ({ itemId, itemData }: { itemId: string; itemData: any }) => {
      const response = await apiClient.put(`/menu/items/${itemId}`, itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useDeleteMenuItem = () => {
  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiClient.delete(`/menu/items/${itemId}`);
      return response.data;
    },
  });
};

export const useApplyVendor = () => {
  return useMutation({
    mutationFn: async (appData: any) => {
      const response = await apiClient.post("/vendor-applications/apply", appData);
      return response.data;
    },
  });
};

export const useVendorApplications = () => {
  return useQuery({
    queryKey: ["vendor-applications"],
    queryFn: async () => {
      const response = await apiClient.get("/vendor-applications");
      return response.data;
    },
  });
};

export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      const response = await apiClient.put(`/vendor-applications/${appId}/review`, { status });
      return response.data;
    },
  });
};

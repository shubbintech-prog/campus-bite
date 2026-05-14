import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: {
      vendor_id: string;
      items: { menu_item_id: string; quantity: number; price: number }[];
      total_amount: number;
    }) => {
      const response = await apiClient.post("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order");
    },
  });
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const response = await apiClient.get("/orders");
      return response.data;
    },
  });
};

export const useVendorOrders = () => {
  return useQuery({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      const response = await apiClient.get("/orders/vendor");
      return response.data;
    },
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/orders");
      return response.data;
    },
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};

export const useNotifications = (enabled = true) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get("/notifications");
      return response.data;
    },
    enabled,
  });
};

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
      const response = await apiClient.post('/payments/initialize', { order_id: orderId, amount });
      return response.data;
    },
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiClient.put(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Order status updated");
    },
  });
};

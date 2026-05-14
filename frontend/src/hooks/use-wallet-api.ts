import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useWallet = () => {
    return useQuery({
        queryKey: ["wallet"],
        queryFn: async () => {
            const response = await apiClient.get("/wallet/balance");
            return response.data;
        }
    });
};

export const useWalletTransactions = () => {
    return useQuery({
        queryKey: ["wallet-transactions"],
        queryFn: async () => {
            const response = await apiClient.get("/wallet/transactions");
            return response.data;
        }
    });
};

export const useDeposit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ amount, reference }: { amount: number; reference: string }) => {
            const response = await apiClient.post("/wallet/deposit", { amount, reference });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
        }
    });
};

export const usePayWithWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
            const response = await apiClient.post("/wallet/pay", { orderId, amount });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
            queryClient.invalidateQueries({ queryKey: ["user-orders"] });
        }
    });
};

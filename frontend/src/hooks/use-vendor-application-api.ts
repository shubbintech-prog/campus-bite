import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useApplyAsVendor = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (applicationData: {
      business_name: string;
      phone_number: string;
      food_category: string;
      description: string;
      location_landmark: string;
    }) => {
      const response = await apiClient.post("/vendor-applications/apply", applicationData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit application");
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

export const useReviewApplication = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string | number; status: 'approved' | 'rejected' }) => {
      const response = await apiClient.put(`/vendor-applications/${id}/review`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Application ${variables.status} successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to review application");
    },
  });
};

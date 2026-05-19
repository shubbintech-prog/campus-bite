import { useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://campus-bite-ndg1.onrender.com";

let socket;

export const useSocket = () => {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && token && !socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token
        }
      });

      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("join", `user_${user.id}`);
      });

      socket.on("order_update", (order) => {
        console.log("Order update received:", order);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["order", order.id] });
        queryClient.invalidateQueries({ queryKey: ["user-orders"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    }

    return () => {
      // We keep the socket connection alive across pages generally
      // but if you want to disconnect on logout, you'd handle it here
    };
  }, [user, queryClient]);

  const emit = useCallback((event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  }, []);

  return { socket, emit };
};

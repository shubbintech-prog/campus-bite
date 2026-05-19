import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Restricted via standard production cors middleware, wildcard here permits socket client handshakes
            methods: ["GET", "POST"]
        }
    });

    // JWT socket authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        try {
            const cleanedToken = token.startsWith("Bearer ") ? token.slice(7) : token;
            const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id} (user: ${socket.user.id})`);

        socket.on("join", async (room) => {
            // Guard room joins securely against spoofing and eavesdropping
            if (room.startsWith("user_")) {
                const userId = room.replace("user_", "");
                if (socket.user.id !== userId) {
                    console.warn(`Unauthorized join attempt from ${socket.user.id} to ${room}`);
                    return socket.emit("error_msg", { message: "Unauthorized room access" });
                }
            } else if (room.startsWith("order_")) {
                const orderId = room.replace("order_", "");
                try {
                    const order = await Order.findById(orderId);
                    if (!order) return socket.emit("error_msg", { message: "Order not found" });
                    
                    const isOwner = order.user.toString() === socket.user.id;
                    const isVendor = order.vendor.toString() === socket.user.id;
                    const isAdmin = socket.user.role === 'admin' || (socket.user.roles && socket.user.roles.includes('admin'));

                    if (!isOwner && !isVendor && !isAdmin) {
                        console.warn(`Unauthorized order room join attempt from ${socket.user.id} to ${room}`);
                        return socket.emit("error_msg", { message: "Unauthorized room access" });
                    }
                } catch (e) {
                    return socket.emit("error_msg", { message: "Invalid order ID" });
                }
            }

            socket.join(room);
            console.log(`Socket ${socket.id} (user: ${socket.user.id}) successfully joined room: ${room}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitToRoom = (room, event, data) => {
    if (io) {
        io.to(room).emit(event, data);
    }
};

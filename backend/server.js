import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketServer } from "socket.io";
import Chat from "./models/chat.model.js"; // Import chat model

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/chat", chatRoutes); // Chat routes

// Test Route
app.get("/", (req, res) => res.send("Server ready."));

// Chat Logic with Socket.IO
io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("joinRoom", ({ room }) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on("chatMessage", async ({ room, username, message }) => {
        // Save chat in database
        const newMessage = await Chat.create({ room, username, message });
        io.to(room).emit("message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});

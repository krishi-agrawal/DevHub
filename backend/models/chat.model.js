import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        room: { type: String, required: true },
        username: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

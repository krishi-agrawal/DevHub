import Chat from "../models/chat.model.js";

export const fetchChatHistory = async (req, res) => {
    const { room } = req.params;

    try {
        const messages = await Chat.find({ room }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch chat history" });
    }
};

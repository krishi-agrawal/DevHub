import express from "express";
import { fetchChatHistory } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:room", fetchChatHistory);

export default router;

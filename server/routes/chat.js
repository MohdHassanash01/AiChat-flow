import express from "express";
import { Chat } from "../model/chat.model.js";


export const chatRouter = express.Router();


chatRouter.post("/save", async (req, res) => {
  try {
    const { prompt, response } = req.body;

    if (!prompt || !response) {
      return res.status(400).json({ error: "Prompt & response required" });
    }

    const chat = await Chat.create({
      prompt,
      response,
    });

    res.json({
      message: "Chat saved successfully",
      chatId: chat._id,
    });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});


chatRouter.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });

    if (chats.length === 0) {
      return res.status(200).json({
        message: "No chats found",
        chats: [],
      });
    }

    res.status(200).json({
      message: "Chats fetched successfully",
      chats,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch chats",
    });
  }
});


chatRouter.delete("/allChat", async (req, res) => {
  try {
    const chats = await Chat.deleteMany({})

    res.status(200).json({
      message: "Chats delete successfully",
      deletedCount: chats.deletedCount,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({
      error: "Failed to delete chats",
    });
  }
});


chatRouter.delete("/chat/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedChat = await Chat.findByIdAndDelete(id);

    if (!deletedChat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.status(200).json({
      message: "Chat deleted successfully",
      chatId: id,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      error: "Failed to delete chat",
    });
  }
});

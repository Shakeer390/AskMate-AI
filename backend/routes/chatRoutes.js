import express from "express";
import {
  createChat,
  deleteChat,
  getChat,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const chatRouter = express.Router();

chatRouter.post("/create", protect, createChat);
chatRouter.get("/get", protect, getChat);
chatRouter.delete("/delete/:chatId", protect, deleteChat);

export default chatRouter;
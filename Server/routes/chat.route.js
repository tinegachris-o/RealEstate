import express from "express";
const router = express.Router();
import {
  getChat,
  getChats,
  readChat,
  addChat,
} from "../Controllers/chat.controller.js";
import { verifyToken } from "../lib/Mildleware.js";
router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
export default router;

import { verifyToken } from "../lib/Mildleware.js";
import express from "express";
const router = express.Router();
import { addMessage } from "../Controllers/message.controller.js";
router.post("/:chatId", verifyToken, addMessage);
export default router;

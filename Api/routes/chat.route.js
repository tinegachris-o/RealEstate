import express from "express";
const router = express.Router();
import {
  getChats,
  getChat,
  addChat,
  readChat
} from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleWare/verifyToken.js";
/////get All Chats
router.get("/", verifyToken, getChats);
//get  A Chat
router.get("/:id", verifyToken, getChat);


//Add A Chat

router.post("/", verifyToken, addChat);
///read my chats

router.put("/read/:id", verifyToken, readChat);

export default router;

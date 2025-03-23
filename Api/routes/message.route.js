import express from "express";
const router = express.Router();
import {
  
    addMessage,
  getMessage,
  getmessages,
  readMessage,
} from "../controllers/message.controllers.js";
import { verifyToken } from "../middleWare/verifyToken.js";
/////get All Messages
router.get("/", verifyToken, getmessages);
//get  A Message
router.get("/", verifyToken, getMessage);


//Add A Message

router.post("/:chatId", verifyToken, addMessage);
///read my Messages

router.put("/read/:id", verifyToken, readMessage);

export default router;

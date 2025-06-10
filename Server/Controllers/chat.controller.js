import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.client.js";
import jwt from "jsonwebtoken";
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: { userIDs: { hasSome: [tokenUserId] } },
    });
    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { username: true, id: true, avatar: true },
      });
      chat.receiver = receiver;
    }
    res.status(200).json(chats);
  } catch (error) {
    console.error(error, "error in fetching chats");
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const {receiverId}=req.body||{}
  if(!receiverId){
    return res.status(400).json({error:"receiverId is required"})
  }
  try {
    const newChat = await prisma.chat.create({
      data: { userIDs: [tokenUserId, req.body.receiverId] },
    });
    res.status(200).json({ message: "good to see you ", newChat });
  } catch (error) {
    console.error(error, "error in adding a new chat");
  }
};

export const getChat = async (req, res) => {
  try {
    const tokenUserId = req.userId;
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id, userIDs: { hasSome: [tokenUserId] } },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    await prisma.chat.update({
      where: { id: req.params.id },

      data: { seenBy: { set: [tokenUserId] } },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.error("this error occured in getting a chat", error);
  }
};
///
export const readChat = async (req, res) => {
  try {
    const tokenUserId = req.userId;
    const chat = await prisma.chat.update({
      where: { id: req.params.id, userIDs: { hasSome: [tokenUserId] } },
      data: { seenBy: { set: [tokenUserId] } },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.error(error, "the error occured when reading chat ");
  }
};

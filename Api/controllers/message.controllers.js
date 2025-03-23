import prisma from "../lib/prisma.js";

//get all Chats
export const getmessages = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: { hasSome: [tokenUserId] },
      },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error("failed to get chats");
  }
};

//get a Chat
export const getMessage = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("failed to get users");
  }
};
//add message
//
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;
  try {
    ///check if chat belong to us
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: { hasSome: [tokenUserId] },
      },
    });
    if (!chat) return res.status(404).json({ mesage: "Chat not found" });
    const message = await prisma.message.create({
      data: { text, chatId, userId: tokenUserId },
    });
    await prisma.chat.update({
      where: { id: chatId },
      data: { seenBy: [tokenUserId], lastMessage: text },
    });
    res.status(200).json(message);
  } catch (error) {
    console.error("failed to add message");
  }
};

//get read Chat
export const readMessage = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("failed to get users");
  }
};

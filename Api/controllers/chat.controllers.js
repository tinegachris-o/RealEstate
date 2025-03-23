import prisma from "../lib/prisma.js";

//get all Chats
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: { hasSome: [tokenUserId] },
      },
    });
    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, username: true, avatar: true },
      });
      chat.receiver = receiver;
    }
    res.status(200).json(chats);
  } catch (error) {
    console.error("failed to get chats");
  }
};

//get a Chat

/*export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    // Fetch the chat, including its messages sorted by createdAt
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Check if chat exists and the user is a participant
    if (!chat || !chat.userIDs.includes(tokenUserId)) {
      return res.status(404).json({ error: "Chat not found or access denied" });
    }

    // Clean up duplicates in the seenBy array, if any exist
    /*const uniqueSeenBy = [...new Set(chat.seenBy)];
    if (uniqueSeenBy.length !== chat.seenBy.length) {
      await prisma.chat.update({
        where: { id: req.params.id },
        data: { seenBy: uniqueSeenBy },
      });
    }

    // After cleaning up, push tokenUserId if it's still not present
    if (!uniqueSeenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: { id: req.params.id },
        data: { seenBy: { push: [tokenUserId] } },
      });
    }

    // Optionally, refetch the chat to return updated data
    const updatedChat = await prisma.chat.findUnique({
      where: { id: req.params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Failed to get chat:", error);
    res.status(500).json({ error: "Failed to get chat" });
  }
};
*/
//get a chat
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};
//add Chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const newChat = await prisma.chat.create({
      data: { userIDs: [tokenUserId, req.body.receiverId] },
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.error("failed to add chat");
  }
};
//get read Chat
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    //fetch chat to check user access
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id },
      select: { userIDs: true, seenBy: true },
    });
    if (!chat || !chat.userIDs.includes(tokenUserId)) {
      return res.status(404).json({ message: "chat  not found" });
    }
    if (!chat.seenBy.includes(tokenUserId)) {
      const updateChat = await prisma.chat.update({
        where: { id: req.params.id },
        data: { seenBy: { push: [tokenUserId] } },
      });
      return res.status(200).json(updateChat);
    }
    res.status(200).json({ message: "Already marked as read" });
  } catch (error) {
    console.log("failed to read message", error);
    res.status(500).json({ error: "failed to mark chat ss read " });
  }
};

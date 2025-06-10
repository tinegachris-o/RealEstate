import prisma from "../lib/prisma.client.js";

export const addMessage = async (req, res) => {
  try {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.chatId, userIDs: { hasSome: [tokenUserId] } },
    });
    if(!chat) return res.status(404).json({message:'chat not found '})
        const message=await prisma.message.create({data:{text,chatId,userId:tokenUserId}})
    await prisma.chat.update({where:{id:chatId},data:{seenBy:[tokenUserId],lastMessage:text}})
    res.status(200).json(message)
  } catch (error) {
    console.error(error, "error in adding message");
  }
};

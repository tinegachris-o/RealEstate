import prisma from "../lib/prisma.client.js";
import bcrypt from "bcryptjs";
export const getUsers = async (req, res) => {
  const id = req.params.id;
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found " });
    res.status(200).json(user);
  } catch (error) {
    console.error(error, "error in locating unique user");
  }
};
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "user not found" });
    if (id !== tokenUserId) {
      return res.status(403).json({ message: " You Are Not Authorized" });
    }
    ///
    /*let dataToUpdate = { ...inputs };
    if ((password)) {
      const hashPassword = await bcrypt.hash(password, 10);

      dataToUpdate.password = hashPassword;
    }
    if(avatar){
      dataToUpdate.avatar = avatar;

    }*/
    //
    let updatedPassword = null;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(avatar && { avatar }),
        ...(updatedPassword && { password: updatedPassword }),
      },
    });
    const { password: userPassword, ...userInfo } = updatedUser;
    res.status(200).json({
      message: `${updatedUser.username} you have updated account sucessfully`,
      userInfo,
    });
  } catch (error) {
    console.error(error, "oops!!! failute to update user ");
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: "User is not found" });
  try {
    if (id !== tokenUserId)
      return res
        .status(403)
        .json({ message: "ooopS!!! you can only delete your account" });
    const deletedUser = await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "Uouu!! Account deleted sucessfully!!" });
  } catch (error) {
    console.error(error, "Opps!!! error in deleting user Account ");
  }
};
export const savedPost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;
  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId: tokenUserId, postId } },
    });
    if (savedPost) {
      await prisma.savedPost.delete({ where: { id: savedPost.id } });
      res.status(200).json({ message: "post is removed from post's list" });
    } else {
      await prisma.savedPost.create({ data: { userId: tokenUserId, postId } });
      res.status(200).json({ message: "post saved in list" });
    }
  } catch (error) {
    console.error("error in saving post ")
  }
};

///
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    console.log(error);
    console.error(error, "error fetching profilePosts");
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};
export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  if (!tokenUserId) {
    return res.status(400).json({ message: "User ID is missing." });
  }

  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};

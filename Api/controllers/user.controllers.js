import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
//get all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("failed to get users");
  }
};

////get a specific user
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("failed to get users am afraid");
  }
};

///update the user
export const updateUser = async (req, res) => {
  // compare id fro cookie and param id && if same we are
  //owners of account so we can delete and update the user specifically
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { avatar, password, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res
      .status(403)
      .json({ message: "you can only update your account " });
  }

  try {
    let updatedPassword = null;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });
    //  console.log("this is updated user", updatedUser);
    const { password: userPassword, ...userInfo } = updatedUser;
    res.status(201).json({ message: "updated  user sucessfully", userInfo });
  } catch (error) {
    console.error("failed to updateUser", error);
    return res
      .status(500)
      .json({ message: "Update failed", error: error.message });
  }
};
///delete a user
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, ...inputs } = req.body;
    if (id !== tokenUserId) {
      return res.status(403).json({ message: "not authorised" });
    }
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.error("failed to delete user");
  }
};
///savedPost
export const savedPost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });
    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });
      res.status(200).json({ message: "post unsaved sucessfully" });
    } else {
      await prisma.savedPost.create({
        data: { userId: tokenUserId, postId },
      });
      res.status(200).json({ message: "Post saved sucessfully" });
    }
  } catch (error) {
    console.error("failed to save Post");
  }
};
export const profilePosts = async (req, res) => {
  try {
    //fetch a user
    const tokenUserId = req.params.userId;
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    res.status(500).json({ message: "failed to get profilePosts" });
  }
};
///get notification number

export const getNotificationNumber = async (req, res) => {
  try {
    //fetch a user
    const tokenUserId = req.userId;
    const number = await prisma.chat.count({
      where: { userIDs: { hasSome: { tokenUserId },
      NOT:{seenBy:{hasSome:[tokenUserId]}}
    } },
    });
    res.status(200).json(number);
  } catch (error) {
    res.status(500).json({ message: "failed to get profilePosts" });
  }
};

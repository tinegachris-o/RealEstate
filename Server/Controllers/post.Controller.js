import prisma from "../lib/prisma.client.js";
//console.log("Prisma client models →", Object.keys(prisma));

import jwt from "jsonwebtoken";
import { verifyToken } from "../lib/Mildleware.js";

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const getPost = async (req, res) => {
  const id = req.params.id;

  // 1️⃣ validate before hitting Prisma
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: { select: { username: true, avatar: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token." });
        }
        const saved = await prisma.savedPost.findUnique({
          where: { userId_postId: { postId: id, userId: payload.id } },
        });
        return res.status(200).json({ ...post, isSaved: Boolean(saved) });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (error) {
    console.error("error in getting post", error);
    return res.status(500).json({ message: "Failed to get the post." });
  }
};

///
export const getPosts = async (req, res) => {
  const query = req.query;
  //console.log(query);
  try {
    const post = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        propety: query.propety || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 1000000,
        },
      },
    });

    res.status(200).json(post);
  } catch (error) {
    console.error("failed to fetch posts", error);
    res.status(500).json({ message: "failed to fetch post" });
  }
};
export const addPost = async (req, res) => {
  try {
    const userId = req.userId;

    const body = req.body;
    // Force type conversion 👇
    body.postData.latitude = parseFloat(body.postData.latitude);
    body.postData.longitude = parseFloat(body.postData.longitude);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json({
      message: `${user.username} you have  created A post sucessfully`,
      post,
    });
  } catch (error) {
    console.error("failed to create a post", error);
    res.status(500).json({ message: "failed to create posts" });
  }
};
export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      res.status(404).json({ message: "post does not exist" });
    }
    if (post.userId !== userId) {
      res.status(403).json({ message: "you are not authorised" });
    }
    await prisma.post.delete({ where: { id } });
    res
      .status(200)
      .json({ message: `${user.username} have deleted post sucesfully` });
  } catch (error) {
    console.error("failed to delete post");
    res.status(500).json({ message: "failed to delete post" });
  }
};
export const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const { ...inputs } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      res.status(404).json({ message: "post does not exist" });
    }
    if (post.userId !== userId) {
      res
        .status(403)
        .json({ message: "you are not authorized to update this" });
    }
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { ...inputs },
    });
    res.status(201).json({
      message: `${user.username} you have updated post sucessfully`,
      updatedPost,
    });
  } catch (error) {
    console.error("failed to update post", error);
    res.status(500).json({ message: "failed to update post" });
  }
};

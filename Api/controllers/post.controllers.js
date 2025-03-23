// postControllers.js

import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
//
// 1. Get All Posts
//
export const getPosts = async (req, res) => {
  const query = req.query;
  //console.log("this are my query items", query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("error fetching posts:", error);
    res
      .status(500)
      .json({ message: "failed to fetch posts", error: error.message });
  }
};

//
// 2. Get a Single Post by ID
//

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Extract token from cookies and verify it synchronously
    let userId = null;
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        userId = payload.id;
      } catch (error) {
        userId = null;
      }
    }

    // Only query the saved post if userId is not null
    let saved = false;
    if (userId) {
      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            postId: id,
            userId,
          },
        },
      });
      saved = Boolean(savedPost);
    }

    return res.status(200).json({ ...post, isSaved: saved });
  } catch (error) {
    console.error("error fetching post:", error);
    return res
      .status(500)
      .json({ message: "failed to fetch post", error: error.message });
  }
};

//
// 3. Add a New Post
//
export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    // 1. Extract the raw price if you're storing price as an integer
    let { price, ...restOfPostData } = postData;

    // 2. Convert a string price like "$1,200,000" -> 1200000
    if (typeof price === "string") {
      price = parseInt(price.replace(/[^0-9]/g, ""), 10);
    }

    // 3. Create the new post
    const newPost = await prisma.post.create({
      data: {
        ...restOfPostData,
        price, // integer value
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });

    res.status(201).json({ message: "post created successfully", newPost });
  } catch (error) {
    console.error("error creating new post", error);
    res
      .status(500)
      .json({ message: "error creating new post", error: error.message });
  }
};

//
// 4. Update an Existing Post (Skeleton)
//
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    // Optional: Check if the post exists
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Optional: Check ownership if needed
    if (existingPost.userId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    // Example update logic (adjust as needed)
    let { price, ...restOfPostData } = postData;
    if (typeof price === "string") {
      price = parseInt(price.replace(/[^0-9]/g, ""), 10);
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...restOfPostData,
        price,
        postDetail: {
          // This depends on how you handle nested updates
          update: postDetail,
        },
      },
    });

    res.status(200).json({ message: "post updated successfully", updatedPost });
  } catch (error) {
    console.error("error updating post", error);
    res
      .status(500)
      .json({ message: "error updating post", error: error.message });
  }
};

//
// 5. Delete a Post
//
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: "post does not exist" });
    }

    // Check ownership if required
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "you are not authorized" });
    }

    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    console.error("error deleting post", error);
    res.status(500).json({
      message: "error occurred when deleting post",
      error: error.message,
    });
  }
};

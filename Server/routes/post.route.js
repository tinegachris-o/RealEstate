import express from "express";
const router = express.Router();
import { verifyToken } from "../lib/Mildleware.js";
import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} from "../Controllers/post.Controller.js";
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
export default router;

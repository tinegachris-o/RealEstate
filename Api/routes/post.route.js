import express from "express"
const router = express.Router()
import { verifyToken } from "../middleWare/verifyToken.js";
import {
  addPost,
  getPost,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/post.controllers.js";
router.get("/", getPosts);
router.get("/:id",getPost)
router.post("/", verifyToken,addPost);
router.put("/:id",verifyToken, updatePost);
router.delete("/:id",verifyToken, deletePost);


export default router
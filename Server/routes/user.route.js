import express from "express";
const router = express.Router();
import { verifyToken } from "../lib/Mildleware.js";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  savedPost,
  profilePosts,
  getNotificationNumber,
} from "../Controllers/user.Contoller.js";
router.get("/", getUsers);
//router.get("/search/:id",verifyToken, getUser);
router.put("/:id", verifyToken,updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savedPost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken,getNotificationNumber);

///
export default router;

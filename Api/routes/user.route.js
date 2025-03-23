import express from "express";
const router = express.Router();
import {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  profilePosts,
  savedPost,
  getNotificationNumber
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleWare/verifyToken.js";
/////get All Users
router.get("/", verifyToken, getUsers);
//get  A User
//router.get("/:id", verifyToken, getUser);

//update A user
router.put("/edit/:id", verifyToken, updateUser);
//delete a user
router.delete("/:id", verifyToken, deleteUser);
//saved A Post
router.post("/save", verifyToken, savedPost);
///fetching my posts
router.get("/profilePosts", verifyToken, profilePosts);
///get notifiction number
router.get("/notification", verifyToken, getNotificationNumber);

export default router;

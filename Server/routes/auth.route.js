import express from "express";
const router = express.Router();
import prisma from "../lib/prisma.client.js";

import { verifyToken } from "../lib/Mildleware.js";





import { login, logout, register,getCurrentUser } from "../Controllers/auth.Controller.js";
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// In routes/auth.js
router.get("/me", verifyToken, );

export default router;

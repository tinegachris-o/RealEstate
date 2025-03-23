import express from "express";
const router = express.Router();
import { login, logout, register } from "../controllers/auth.controllers.js";
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;

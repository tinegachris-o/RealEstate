import express from "express";
const router = express.Router();
import {
  shouldBeLoggedIn,
  shouldBeAdmin,
} from "../controllers/test.controller.js";
import { verifyToken } from "../middleWare/verifyToken.js";

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
router.get("/should-be-admin", shouldBeAdmin);
export default router;

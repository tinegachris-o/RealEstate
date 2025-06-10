import express from "express"
const router= express.Router()
import { verifyToken } from "../lib/Mildleware.js"
router.get("/login",verifyToken,async(req,res)=>{
res.json({message:"HELLO WHAT'S UP BRO YOU ARE CLEAN"})
})
export default router
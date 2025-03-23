import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: " /home/tinega/Documents/RealEstateApp/Api/.env" });
export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Autheticated" });
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "token is invalid" });
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not authorised" });
    }
  });
  res.status(200).json({ message: "You are Authenticated " });
};
export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId)
  res.status(200).json({ message: "You are Authenticated " });
};

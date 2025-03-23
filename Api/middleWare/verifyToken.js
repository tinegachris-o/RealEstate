import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: " You are not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (error, payLoad) => {
    if (error) {
      return res.status(401).json({ message: "token is invalid" });
    }
    req.userId = payLoad.id;
    next(); //procede to next middleware
  });
};

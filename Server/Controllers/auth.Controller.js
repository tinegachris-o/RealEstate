import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.client.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  ///Hash we need bcrypt
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log('this is my request body',req.body)
    ///New User
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    //console.log(newUser);

    res.status(201).json({
      message: `🌸✨ ${username}, your account has been created successfully! Welcome aboard! 🎉🌼`,
      newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "failed to create user" });
  }
};

export const login = async (req, res) => {
  try {
    ///check if user exists
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user)
      return res
        .status(401)
        .json({ message: "❌ Invalid credentials, please try again!" });

    ///CHECK IF PASSWORD IS CORRECT
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res
        .status(401)
        .json({ message: "❌ Invalid credentials, please try again!" });

    ///generate A cookie token
    const age = 1000 * 60 * 24 * 7;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: age,
    });
    const { password: userPassWord, ...userInfo } = user;
    //console.log("this is my user info",userInfo)
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({
        message: `🌻✨ Welcome back, ${username}! Happy to see you again! 🎉🌸`,
        userInfo,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "⚠️ Failed to login. Please try again later." });
  }
};
export const logout = async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "logged out sucessfully" });
};
/*export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) return res.status(404).json("User not found");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};*/

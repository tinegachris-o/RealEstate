import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
//register
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hashpassword
    const hashedPassword = await bcrypt.hash(password, 10);
    //Register A User
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to create A user " });
    console.log(error);
  }
};
//login
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    //CHECK IF USER EXISTS
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) return res.status(401).json({ message: "invalid credentials" });
    //VALIDATE PASSWORD
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "invalid credentials" });
    //GENERATE A COOKIE TOKEN  && SEND TO USER
    // res.setHeader("Set-Cookie", "test", +"myvalue").json(user)
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      { id: user.id, isAdmin: true },
      process.env.JWT_SECRET,
      {
        expiresIn: age,
      }
    );
    const { password: Userpassord, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "logged in sucessfully", userInfo });
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"An error occured during login"})
  }
};
//logout
export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "logged out sucesssfully" });
};

// ESM (type: "module" in package.json)
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: "/home/tinega/Documents/RealEstateApp/Api/.env" });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma
  .$connect()
  .then(() => {
    console.log("Database connected sucessfully");
  })
  .catch((error) => {
    console.log("error connecting to dataBase");
  });
export default prisma;

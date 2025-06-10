import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import figlet from "figlet";
import chalk from "chalk";
import ora from "ora";

dotenv.config();
const prisma = new PrismaClient();

// Start spinner
const spinner = ora({
  text: chalk.yellow("Connecting to MongoDB Atlas..."),
  spinner: "dots",
}).start();

async function main() {
  try {
    await prisma.$connect();

    // Log the actual URL (you might not want to expose this in production)
    //console.log("→ DATABASE_URL:", process.env.DATABASE_URL);

    // Succeed with a color Chalk actually supports
    spinner.succeed(
      chalk.hex("#FFC0CB")("Successfully connected to Atlas MongoDB:"),
      process.env.DATABASE_URL
    );
  } catch (error) {
    spinner.fail(chalk.red("Connection failed!"));
    console.error(chalk.red(error));
    process.exit(1);
  }
}

main();
export default prisma;

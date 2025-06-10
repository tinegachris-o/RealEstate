// fixIncome.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// 1️⃣ Connect to MongoDB Atlas
await mongoose.connect(process.env.DATABASE_URL, {
  dbName: "Estate",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 2️⃣ Define a minimal schema for PostDetail
const postDetailSchema = new mongoose.Schema(
  {
    income: mongoose.Schema.Types.Mixed, // we’ll coerce this to string
  },
  { collection: "PostDetail", strict: false }
);

const PostDetail = mongoose.model("PostDetail", postDetailSchema);

async function run() {
  // 3️⃣ Find all docs where income is not a string
  const badDocs = await PostDetail.find({
    $expr: { $not: { $eq: [{ $type: "$income" }, "string"] } },
  });

  console.log(`Found ${badDocs.length} documents with non-string income`);

  // 4️⃣ Convert and save each one
  for (const doc of badDocs) {
    doc.income = String(doc.income);
    await doc.save();
    console.log(`  → Fixed doc ${doc._id}`);
  }

  console.log("All done! 🎉");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});

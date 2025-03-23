// seed.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Data for seeding
const listData = [
  {
    id: "507f1f77bcf86cd799439011",
    title: "A Great Apartment Next to the Beach!",
    images: [
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 1000,
    address: "456 Park Avenue, London",
    city: "London",
    latitude: "51.5074",
    longitude: "-0.1278",
    bedroom: 2,
    bathroom: 1,
    type: "buy",
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439012",
    title: "An Awesome Apartment Near the Park! Almost too good to be true!",
    images: [
      "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 1500,
    address: "789 Oxford Street, London",
    city: "London",
    latitude: "52.4862",
    longitude: "-1.8904",
    bedroom: 3,
    bathroom: 2,
    type: "rent", // Using "rent"
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439013",
    title: "A New Apartment in the City!",
    images: [
      "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 800,
    address: "101 Baker Street, London",
    city: "London",
    latitude: "53.4808",
    longitude: "-2.2426",
    bedroom: 1,
    bathroom: 1,
    type: "buy",
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439014",
    title: "Great Location! Great Price! Great Apartment!",
    images: [
      "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 1000,
    address: "234 Kingsway, London",
    city: "London",
    latitude: "53.8008",
    longitude: "-1.5491",
    bedroom: 2,
    bathroom: 1,
    type: "rent", // Using "rent"
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439015",
    title: "Apartment 5",
    images: [
      "https://images.pexels.com/photos/276625/pexels-photo-276625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 1500,
    address: "567 Victoria Road, London",
    city: "London",
    latitude: "53.4084",
    longitude: "-2.9916",
    bedroom: 3,
    bathroom: 2,
    type: "buy",
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439016",
    title: "Apartment 6",
    images: [
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 800,
    address: "890 Regent Street, London",
    city: "London",
    latitude: "54.9783",
    longitude: "-1.6174",
    bedroom: 1,
    bathroom: 1,
    type: "buy",
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439017",
    title: "Apartment 7",
    images: [
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 1000,
    address: "112 Piccadilly, London",
    city: "London",
    latitude: "53.3811",
    longitude: "-1.4701",
    bedroom: 2,
    bathroom: 1,
    type: "rent", // Using "rent"
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
  {
    id: "507f1f77bcf86cd799439018",
    title: "Apartment 8",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    price: 1500,
    address: "8765 Main High Street, London",
    city: "London",
    latitude: "51.4545",
    longitude: "-2.5879",
    bedroom: 3,
    bathroom: 2,
    type: "buy",
    property: "apartment",
    userId: "507f1f77bcf86cd799439031",
  },
];

const singlePostData = {
  id: "507f1f77bcf86cd799439021",
  title: "Beautiful Apartment",
  price: 1200,
  images: [
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ],
  bedroom: 2,
  bathroom: 1,
  address: "1234 Broadway St",
  city: "London",
  latitude: "51.5074",
  longitude: "-0.1278",
  type: "rent", // Using "rent"
  property: "apartment",
  userId: "507f1f77bcf86cd799439031",
  postDetail: {
    create: {
      desc: "Future alike hill pull picture swim magic chain seed engineer nest outer raise bound easy poetry gain loud weigh me recognize farmer bare danger...",
      utilities: null,
      pet: null,
      income: null,
      size: 861,
      bus: 100, // Converted from "100m away"
      school: 250, // Converted from "250m away"
      restaurant: 50, // Converted from "50m away"
    },
  },
};

const userData = {
  id: "507f1f77bcf86cd799439031",
  email: "john@gmail.com",
  password: "john", // In production, ensure passwords are securely hashed
  username: "john",
  avatar:
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  createdAt: new Date().toISOString(),
};

async function main() {
  console.log("Seeding database...");

  // Delete dependent data first
  await prisma.postDetail.deleteMany({});
  // Then delete posts
  await prisma.post.deleteMany({});
  // Finally, delete users
  await prisma.user.deleteMany({});

  // Create the user
  const user = await prisma.user.create({
    data: userData,
  });
  console.log("User seeded:", user.username);

  // Create posts from listData
  for (const post of listData) {
    const createdPost = await prisma.post.create({
      data: post,
    });
    console.log("Post seeded:", createdPost.title);
  }

  // Create the single post with nested postDetail
  const detailedPost = await prisma.post.create({
    data: singlePostData,
  });
  console.log("Detailed post seeded:", detailedPost.title);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

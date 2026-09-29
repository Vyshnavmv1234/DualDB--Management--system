import bcrypt from "bcrypt";
import "dotenv/config";

import { connectMongoDB } from "../config/mongo.js";
import { UserModel } from "../models/user.model.js";

const createAdmin = async () => {
  await connectMongoDB();

  const email = "admin@example.com";
  const password = "AdminPassword123";

  const existingAdmin = await UserModel.findOne({ email });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
    name: "Admin",
    email,
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("Admin created successfully");
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});
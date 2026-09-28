import dotenv from "dotenv";
import { connectMongoDB } from "./config/mongo.js";
import { MongoUserRepository } from "./repo/mongo/user.repo.js";

dotenv.config();

const testRepository = async () => {
  try {
    await connectMongoDB();

    const userRepository = new MongoUserRepository();

    const user = await userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "temporary-password",
      role: "USER",
    });

    console.log("Created user:", user);

    const foundUser = await userRepository.findById(
      user._id.toString()
    );

    console.log("Found user:", foundUser);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

testRepository();
import dotenv from "dotenv";

dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    const { default: app } = await import("./app.js");
    const { connectMongoDB } = await import("./config/mongo.js");
    const { connectPostgres } = await import("./config/postgres.js");

    await connectMongoDB();
    await connectPostgres();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
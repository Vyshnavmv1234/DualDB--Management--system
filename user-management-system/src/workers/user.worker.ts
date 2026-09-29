import { Worker } from "bullmq";
import { PostgresUserRepository } from "../repo/postgres/user.repo.js";

const postgresUser = new PostgresUserRepository();

const worker = new Worker(
  "user-sync-queue",
  async (job) => {
    const data = job.data;

    if (job.name === "sync-user") {
      console.log("Syncing user to PostgreSQL");

      await postgresUser.syncUser({
        mongoId: data.mongoId,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    }

    if (job.name === "delete-user") {
      console.log("Deleting user from PostgreSQL");

      await postgresUser.deleteUser(data.mongoId);
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed: ${error.message}`);
});

console.log("Worker is running...");

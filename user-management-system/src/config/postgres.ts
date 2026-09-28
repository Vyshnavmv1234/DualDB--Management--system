import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectPostgres = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    throw error;
  }
};
import { prisma } from "../../config/postgres.js";
import type { SyncUserDTO } from "../../dto/user/userSync.dto.js";

export class PostgresUserRepository {
  async syncUser(data: SyncUserDTO) {
    return prisma.user.upsert({
      where: {
        mongoId: data.mongoId,
      },
      create: {
        mongoId: data.mongoId,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      update: {
        name: data.name,
        email: data.email,
        role: data.role,
        updatedAt: data.updatedAt,
      },
    });
  }

  async deleteUser(mongoId: string) {
    return prisma.user.deleteMany({
      where: {
        mongoId,
      },
    });
  }
}

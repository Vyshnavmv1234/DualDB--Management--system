import type { IUserRepository } from "../repo/interfaces/user.repo.interface.js";
import type { UpdateUserDTO } from "../dto/user/update-user.dto.js";
import { userQueue } from "../queues/user.queue.js";

import { UserMapper } from "../mappers/user.mapper.js";
import { AppError } from "../utils/app-error.js";

export class AdminService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll();

    return UserMapper.toResponseList(users);
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return UserMapper.toResponse(user);
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const updateData: UpdateUserDTO = { ...data };

    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();

      const existingUser = await this.userRepository.findByEmail(
        updateData.email,
      );

      if (existingUser && existingUser._id.toString() !== userId) {
        throw new AppError(409, "Email already registered");
      }
    }

    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }

    delete updateData.password;

    const user = await this.userRepository.update(userId, updateData);

    if (!user) {
      throw new AppError(404, "User not found");
    }
    await userQueue.add("sync-user", {
      mongoId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });

    return UserMapper.toResponse(user);
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.delete(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }
    
    await userQueue.add("delete-user", {
      mongoId: user._id.toString(),
    });

    return {
      id: user._id.toString(),
      message: "User deleted successfully",
    };
  }
}

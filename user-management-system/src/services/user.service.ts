import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import type { LoginDTO } from "../dto/user/user-request.dto.js";
import { jwtConfig } from "../config/jwt.js";

import type { IUserRepository } from "../repo/interfaces/user.repo.interface.js";
import type { CreateUserDTO } from "../dto/user/create-user.dto.js";
import type { UpdateUserDTO } from "../dto/user/update-user.dto.js";
import { UserMapper } from "../mappers/user.mapper.js";

import { AppError } from "../utils/app-error.js";
import { userQueue } from "../queues/user.queue.js";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(data: CreateUserDTO) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, "Email already registered");
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepository.create({
      ...data,
      email,
      password: hashedPassword,
    });

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

  async login(data: LoginDTO) {
    const email = data.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
      },
    );

    return {
      user: UserMapper.toResponse(user),
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return UserMapper.toResponse(user);
  }

  async updateProfile(userId: string, data: UpdateUserDTO) {
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

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

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

  async deleteAccount(userId: string) {
    const user = await this.userRepository.delete(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }
    await userQueue.add("delete-user", {
      mongoId: user._id.toString(),
    });

    return {
      id: user._id.toString(),
      message: "Account deleted successfully",
    };
  }
}

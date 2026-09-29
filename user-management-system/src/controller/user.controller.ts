import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { MongoUserRepository } from "../repo/mongo/user.repo.js";

import type { CreateUserDTO } from "../dto/user/create-user.dto.js";
import type { UpdateUserDTO } from "../dto/user/update-user.dto.js";
import type { LoginDTO } from "../dto/user/user-request.dto.js";
import type { AuthenticatedRequest } from "../middlewares/user.middleware.js";

const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateUserDTO;

      const user = await userService.register(data);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as LoginDTO;

      const result = await userService.login(data);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await userService.getProfile(req.user!.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = req.body as UpdateUserDTO;

      const user = await userService.updateProfile(req.user!.userId, data);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await userService.deleteAccount(req.user!.userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

import type { Request, Response, NextFunction } from "express";

import { AdminService } from "../services/admin.service.js";
import { MongoUserRepository } from "../repo/mongo/user.repo.js";

import type { UpdateUserDTO } from "../dto/user/update-user.dto.js"

const userRepository = new MongoUserRepository();
const adminService = new AdminService(userRepository);

export class AdminController {
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await adminService.getAllUsers();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await adminService.getUserById(req.params.id as string);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body as UpdateUserDTO;

      const user = await adminService.updateUser(
        req.params.id as string,
        data
      );

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await adminService.deleteUser(req.params.id as string);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
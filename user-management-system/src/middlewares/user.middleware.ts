import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { jwtConfig } from "../config/jwt.js";
import { AppError } from "../utils/app-error.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: "ADMIN" | "USER";
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, jwtConfig.secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      (decoded.role !== "ADMIN" && decoded.role !== "USER")
    ) {
      throw new AppError(401, "Invalid token");
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, "Token expired"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, "Invalid token"));
    }

    next(error);
  }
};

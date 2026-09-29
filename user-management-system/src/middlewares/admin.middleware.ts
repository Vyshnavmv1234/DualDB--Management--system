import type { Response, NextFunction } from "express";

import type { AuthenticatedRequest } from "./user.middleware.js";
import { AppError } from "../utils/app-error.js";

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }

  if (req.user.role !== "ADMIN") {
    return next(new AppError(403, "Admin access required"));
  }

  next();
};
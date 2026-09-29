import type { IUser } from "../models/user.model.js";
import type { UserResponseDTO } from "../dto/user/user-response.dto.js";

export class UserMapper {
  static toResponse(user: IUser): UserResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseList(users: IUser[]): UserResponseDTO[] {
    return users.map((user) => this.toResponse(user));
  }
}
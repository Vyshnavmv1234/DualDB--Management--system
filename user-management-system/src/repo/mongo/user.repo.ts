import { UserModel } from "../../models/user.model.js";
import type { IUser } from "../../models/user.model.js";
import type { IUserRepository } from "../interfaces/user.repo.interface.js";
import type { CreateUserDTO } from "../../dto/user/create-user.dto.js";
import type { UpdateUserDTO } from "../../dto/user/update-user.dto.js";

export class MongoUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<IUser> {
    return await UserModel.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).select("+password");
  }

  async findAll(): Promise<IUser[]> {
    return await UserModel.find().sort({ createdAt: -1 });
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(id);
  }
}

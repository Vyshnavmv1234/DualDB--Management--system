import type { IUserRepository } from "../interfaces/user.repo.interface.js";
import { UserModel } from "../../models/user.model.js";
import type { IUser } from "../../models/user.model.js";

export class MongoUserRepository implements IUserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    return await UserModel.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).select("+password");
  }

  async findAll(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async update(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(id);
  }
}
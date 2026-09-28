import type { IUser } from "../../models/user.model.js";

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  findByEmail(email: string): Promise<IUser | null>;

  findAll(): Promise<IUser[]>;

  update(id: string, data: Partial<IUser>): Promise<IUser | null>;

  delete(id: string): Promise<IUser | null>;
}

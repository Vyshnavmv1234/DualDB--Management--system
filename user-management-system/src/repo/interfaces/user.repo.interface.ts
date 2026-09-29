import type { IUser } from "../../models/user.model.js";
import type { IBaseRepository } from "../base/base.repo.js";
import type { CreateUserDTO } from "../../dto/user/create-user.dto.js";
import type { UpdateUserDTO } from "../../dto/user/update-user.dto.js";

export interface IUserRepository extends IBaseRepository<
  IUser,
  CreateUserDTO,
  UpdateUserDTO
> {
  findByEmail(email: string): Promise<IUser | null>;
}

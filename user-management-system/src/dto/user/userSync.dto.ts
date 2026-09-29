export interface SyncUserDTO {
  mongoId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface DeleteUserDTO {
  mongoId: string;
}
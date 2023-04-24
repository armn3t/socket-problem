import { UserDocument, UserRoles } from "../models/user.model";

export function isAdmin(user: UserDocument): boolean {
  return user.role === UserRoles.Admin
}
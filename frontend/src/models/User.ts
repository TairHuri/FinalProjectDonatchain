import type { Ngo } from "./Ngo";

export type UserRoleType = 'admin'|'manager'|'member';
export interface User {
  ngo?: Ngo;
  _id?:string
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRoleType;
  ngoId: string;
  approved:boolean;
  createdAt?: Date;
  updatedAt?: Date;
  token?:string;
}
import type { Ngo } from "./Ngo";

export interface User {
  ngo?: Ngo;
  _id?:string
  email: string;
  password: string;
  name: string;
  phone?: string;
  roles: string[];
  ngoId: string;
  approved:boolean;
  createdAt?: Date;
  updatedAt?: Date;
  token?:string;
}
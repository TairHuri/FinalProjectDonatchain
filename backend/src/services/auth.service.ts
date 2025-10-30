import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import jwt, { SignOptions } from "jsonwebtoken";

export async function registerUser(user:IUser) {
  const existing = await User.findOne({ email:user.email });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(user.password, config.bcryptSaltRounds);
  const {_id, createdAt, updatedAt, ...newUser} = user;
  const userToCreate = new User({
    ...newUser, password:passwordHash,
    role: 'member', // ברירת מחדל
  });

  const createdUser = await userToCreate.save();
  return createdUser;
}

export function signJwt(payload: object) {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"], // ← זה המפתח
  };

  return jwt.sign(
    payload,
    config.jwtSecret as jwt.Secret,
    options
  );
}


export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import jwt, { SignOptions } from "jsonwebtoken";

export async function registerUser({
  email,
  password,
  name,
  ngoId,
  address,
  phone,
  bankAccount,
  wallet,
  goals,
}: {
  email: string;
  password: string;
  name: string;
  ngoId?: string;
  address?: string;
  phone?: string;
  bankAccount?: string;
  wallet?: string;
  goals?: string;
}) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);

  const user = new User({
    email,
    passwordHash,
    name,
    ngoId,
    address,
    phone,
    bankAccount,
    wallet,
    goals,
    roles: ["ngo"], // ברירת מחדל
  });

  await user.save();
  return user;
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

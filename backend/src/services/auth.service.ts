import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Encrypts a plain-text password using bcrypt
 * @param password - the plain password to hash
 * @returns hashed password string
 */
export async function encryptPassword(password:string){
  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
  return passwordHash;
}

/**
 * Registers a new user in the system
 * @param user - user object containing email, password, and other fields
 * @throws Error if email already exists
 * @returns the newly created user document
 */
export async function registerUser(user:IUser) {
  const existing = await User.findOne({ email:user.email });
  if (existing) throw new Error("מייל זה קיים במערכת. נסה להירשם עם מייל אחר.");

  const passwordHash = await encryptPassword(user.password); 
  const {_id, createdAt, updatedAt, ...newUser} = user;
  const userToCreate = new User({
    ...newUser, password:passwordHash,
   
  });

  const createdUser = await userToCreate.save();
  return createdUser;
}

/**
 * Signs a JWT token for a user/session
 * @param payload - object containing user/session data
 * @returns signed JWT string
 */
export function signJwt(payload: object) {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"], 
  };

  return jwt.sign(
    payload,
    config.jwtSecret as jwt.Secret,
    options
  );
}

/**
 * Compares a plain password with a hashed password
 * @param password - plain-text password
 * @param hash - hashed password
 * @returns true if passwords match, false otherwise
 */
export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// src/services/user.service.ts
import { ServerError } from '../middlewares/error.middleware';
import User, { IUser, UserRoleType } from '../models/user.model';
import * as AuthService from './auth.service';

export default {
  // async register({ email, password, name, role, ngoId, address, phone, bankAccount, wallet, goals }: any) {
  //   const user = await AuthService.registerUser({
  //     email,
  //     password,
  //     name,
  //     ngoId,
  //     address,
  //     phone,
  //     bankAccount,
  //     wallet,
  //     goals,
  //   });
  //   return user;
  // },

  async getById(id: string) {
    return User.findById(id).select('-passwordHash');
  },

  async updateUser(id: string, updates: any) {
    const user = await User.findById(id);
    if (!user) throw new ServerError('User not found', 400);
    Object.assign(user, updates);
    await user.save();
    return user;
  },

  async listAll({ page = 1, limit = 50 } = {}) {
    const items = await User.find().select('-passwordHash').skip((page - 1) * limit).limit(limit);
    const total = await User.countDocuments();
    return { items, total, page, limit };
  },

   async approveUser(userId: string) {
    try {

      const user = await User.findById(userId)
      if (!user) {
        throw new ServerError("user not found", 404)
      }
      user.approved = true;
      const updatedUser = await user.save();
      return updatedUser
    } catch (err: any) {
      throw err
    }
  },
   async updateRole(userId: string, role: UserRoleType) {
    try {

      const user = await User.findById(userId)
      if (!user) {
        throw new ServerError("user not found", 404)
      }
      
      user.role = role;
      const updatedUser = await user.save();
      return updatedUser
    } catch (err: any) {
      throw err
    }
  },
  async deleteUser(userId:string){
    try{
      await User.deleteOne({_id:userId})
    }catch(error){
      throw error;
    }
  }
};

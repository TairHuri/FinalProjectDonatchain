// src/services/user.service.ts
import { ServerError } from '../middlewares/error.middleware';
import User, { IUser, UserRoleType } from '../models/user.model';
import serverMessages from '../config/serverMessages.json'

export default {
  // Get a user by ID, excluding the password hash
  async getById(id: string) {
    return User.findById(id).select('-passwordHash');
  },

    // Update a user's information
  async updateUser(id: string, updates: any) {
    const user = await User.findById(id);
    if (!user) throw new ServerError(serverMessages.user.not_found.he, 400);
    Object.assign(user, updates);
    await user.save();
    return user;
  },

    // List all users, excluding their password hashes
  async listAll() {
    const items = await User.find().select('-passwordHash');;
  
    return { items, total:items.length};
  },

  
  // Approve a user (e.g., after verification)
   async approveUser(userId: string) {
    try {

      const user = await User.findById(userId)
      if (!user) {
        throw new ServerError(serverMessages.user.not_found.he, 404)
      }
      user.approved = true;
      const updatedUser = await user.save();
      return updatedUser
    } catch (err: any) {
      throw err
    }
  },
    // Update a user's role (e.g., admin, NGO, donor)
   async updateRole(userId: string, role: UserRoleType) {
    try {

      const user = await User.findById(userId)
      if (!user) {
        throw new ServerError(serverMessages.user.not_found.he, 404)
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

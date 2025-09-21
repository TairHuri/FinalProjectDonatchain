// src/services/user.service.ts
import User from '../models/user.model';
import * as AuthService from './auth.service';

export default {
  async register({ email, password, name, role, ngoId, address, phone, bankAccount, wallet, goals }: any) {
    const user = await AuthService.registerUser({
      email,
      password,
      name,
      ngoId,
      address,
      phone,
      bankAccount,
      wallet,
      goals,
    });
    return user;
  },

  async getById(id: string) {
    return User.findById(id).select('-passwordHash');
  },

  async updateProfile(id: string, updates: any) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    Object.assign(user, updates);
    await user.save();
    return user;
  },

  async listAll({ page = 1, limit = 50 } = {}) {
    const items = await User.find().select('-passwordHash').skip((page - 1) * limit).limit(limit);
    const total = await User.countDocuments();
    return { items, total, page, limit };
  }
};

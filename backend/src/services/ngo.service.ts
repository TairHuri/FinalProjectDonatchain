// src/services/ngo.service.ts
import Ngo from '../models/ngo.model';

export default {
  async create(data: any) {
    const ngo = new Ngo(data);
    await ngo.save();
    return ngo;
  },

  async getById(id: string) {
    return Ngo.findById(id).populate('createdBy', 'name email');
  },

  async list({ page = 1, limit = 20 } = {}) {
    const items = await Ngo.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    const total = await Ngo.countDocuments();
    return { items, total, page, limit };
  },

  async update(id: string, updates: any) {
    const ngo = await Ngo.findById(id);
    if (!ngo) throw new Error('NGO not found');
    Object.assign(ngo, updates);
    await ngo.save();
    return ngo;
  }
};

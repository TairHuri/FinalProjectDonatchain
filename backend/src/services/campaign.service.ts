// src/services/campaign.service.ts
import Campaign from '../models/campaign.model';
import Donation from '../models/donation.model';
import mongoose from 'mongoose';

export default {
  async create(payload: any) {
    const campaign = new Campaign({
      title: payload.title,
      description: payload.description,
      ngo: payload.ngoId,
      targetAmount: payload.targetAmount,
      currency: payload.currency || 'USD',
      images: payload.images || [],
      tags: payload.tags || []
    });
    await campaign.save();
    return campaign;
  },

  async search({ q, tag, page = 1, limit = 10 }: any) {
    const filter: any = { isActive: true };
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };
    const items = await Campaign.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Campaign.countDocuments(filter);
    return { items, total, page, limit };
  },

  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Campaign.findById(id).populate('ngo');
  },

  // עדכון סכום ממקור מאוחד (transaction-like using session)
  async addDonationToCampaign(campaignId: string, amount: number) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const campaign = await Campaign.findById(campaignId).session(session);
      if (!campaign) throw new Error('Campaign not found');
      campaign.raised = (campaign.raised || 0) + amount;
      await campaign.save({ session });
      await session.commitTransaction();
      session.endSession();
      return campaign;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
};

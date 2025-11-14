// src/services/campaign.service.ts
import Campaign from '../models/campaign.model';
import Donation from '../models/donation.model';
import mongoose from 'mongoose';
import tags from '../config/tags.json'
import serverMessages from '../config/serverMessages.json'
import { ServerError } from '../middlewares/error.middleware';
import {generateCampaignReport} from '../utils/pdfHelper'
import { IUser } from '../models/user.model';
import { INgo } from '../models/ngo.model';

export default {

  async generateReport(campaignId: string, user:IUser, includeDonations: boolean, includeComments: boolean) {
    // const lang = 'he'
    // serverMessages.campaign.not_found[lang]

    const campaign = await Campaign.findById(campaignId)
      .populate("ngo")
      .lean();

    if (!campaign)throw new ServerError(serverMessages.campaign.not_found.he, 404);
    if(user.ngoId!.toString() != (campaign.ngo as unknown as INgo)._id!.toString()){
      throw new ServerError(serverMessages.campaign.permissions.he, 403);
    }
    const donations = includeDonations
      ? await Donation.find({ campaign: campaignId })
        .select("_id firstName lastName email phone amount currency comment txHash createdAt")
        .sort({ createdAt: -1 })
        .lean()
      : [];
    const data = await generateCampaignReport(campaign, donations, includeDonations, includeComments)
    return data;
  },
  async create(payload: any) {
    const campaign = new Campaign(payload);
    await campaign.save();
    return campaign;
  },
  async update(payload: any) {
    const campaign = await Campaign.findByIdAndUpdate(payload._id, payload, { new: true }).populate('ngo')

    return campaign;
  },

  async search({ q, tag, page = 1, limit = 10 }: any) {
    const filter: any = { isActive: true };
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };
    const items = await Campaign.find(filter).populate('ngo')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Campaign.countDocuments(filter);
    return { items, total, page, limit };
  },
  async getAll() {
    return await Campaign.find()
      .populate('ngo')
      .sort({ createdAt: -1 });
  },
  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Campaign.findById(id).populate("ngo");
  },

  async getByNgo(ngoId: string, page = 1, limit = 20) {
    if (!mongoose.Types.ObjectId.isValid(ngoId)) return null;
    const items = await Campaign.find({ ngo: ngoId }).populate("ngo")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { items, total: items.length, page, limit }
  },


  async addDonationToCampaign(campaignId: string, amount: number) {

    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) throw new Error('Campaign not found');
      campaign.raised = (+campaign.raised || 0) + +amount;
      campaign.numOfDonors = (campaign.numOfDonors || 0) + 1;

      await campaign.save();

      return campaign;
    } catch (err) {
      throw err;
    }
  },
  getCampaignTags: () => tags.campaign
};

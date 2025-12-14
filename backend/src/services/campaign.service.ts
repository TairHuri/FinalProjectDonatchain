// src/services/campaign.service.ts
import Campaign, { ICampaign } from '../models/campaign.model';
import Donation from '../models/donation.model';
import mongoose from 'mongoose';
import tags from '../config/tags.json'
import serverMessages from '../config/serverMessages.json'
import blockchainService from './blockchain.service';
import { ServerError } from '../middlewares/error.middleware';
import { generateCampaignReport } from '../utils/pdfHelper'
import { IUser } from '../models/user.model';
import { INgo } from '../models/ngo.model';

// Helper function to calculate total raised amount in a campaign (crypto converted to ETH + credit)
const calculateTotal = (campaigns: ICampaign[]) => campaigns.map(c => ({ ...c, totalRaised: c.raised.crypto + c.raised.credit }))
export default {

    // Generates a PDF report for a campaign
  async generateReport(campaignId: string, user: IUser, includeDonations: boolean, includeComments: boolean) {

    const campaign = await Campaign.findById(campaignId)
      .populate("ngo")
      .lean();

    if (!campaign) throw new ServerError(serverMessages.campaign.not_found.he, 404);
    if (user.ngoId!.toString() != (campaign.ngo as unknown as INgo)._id!.toString()) {
      throw new ServerError(serverMessages.campaign.permissions.he, 403);
    }
    const donations = includeDonations
      ? await Donation.find({ campaign: campaignId })
        .select("_id firstName lastName email phone amount originalAmount currency comment txHash createdAt")
        .sort({ createdAt: -1 })
        .lean()
      : [];
    const [calculatedCampaign] = calculateTotal([campaign])
    const data = await generateCampaignReport(calculatedCampaign, donations, includeDonations, includeComments)
    return data;
  },
    // Create a new campaign
  async create(payload: any) {
    const campaign = new Campaign(payload);
    await campaign.save();
    return campaign;
  },

    // Update an existing campaign
  async update(payload: any) {
    const campaign = await Campaign.findByIdAndUpdate(payload._id, payload, { new: true }).populate('ngo')

    return calculateTotal([campaign!])[0];
  },
    // Toggle the active status of a campaign (simple toggle)
  async toggleCampaignStatus(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new ServerError(serverMessages.campaign.not_found.he, 400)
  
    campaign.isActive = !campaign.isActive;
    await campaign.save();
  },

    // Toggle campaign status through blockchain admin control
  async toggleAdminCampaignStatus(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new ServerError(serverMessages.campaign.not_found.he, 400)
    const result = await blockchainService.toggleCryptoCampaignStatus({
    blockchainTx: +campaign.blockchainTx!, 
    newActive: !campaign.isActive,
  })
  if(result.status == true){

    campaign.isActive = !campaign.isActive;
    return await campaign.save();
  }
  throw new ServerError(serverMessages.campaign.status_campaign.he, 502)
  },
    // Toggle multiple campaigns status at once for an NGO
  async toggleAdminCampaignsStatus(campaignIds: string[], activeState: boolean, ngoId:string) {
    const blockchainTxList = await Campaign.find({_id: {$in:campaignIds }},{_id:0, blockchainTx:1}).lean();
    
    if (campaignIds.length != blockchainTxList.length) throw new ServerError(serverMessages.campaign.not_found.he, 400)
      
    const result = await blockchainService.toggleCryptoCampaignsStatus({
    campaignIds: blockchainTxList.map(bc =>+bc.blockchainTx!), 
    newActive: activeState,
  })
  if(result.status == true){
 await this.changeCampainsStatus(ngoId, activeState);
    return;
    
  }
  
  throw new ServerError(serverMessages.campaign.status_campaign.he, 502)
  },
  async search({ q, tag}: any) {
    const filter: any = {  }; 
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };
    const items = await Campaign.find(filter).populate('ngo').lean()      
      .sort({ createdAt: -1 });

    return {items: calculateTotal(items), total:items.length };
  },
    // Get all campaigns
  async getAll() {
    const campaigns = await Campaign.find()
      .populate('ngo')
      .lean()
      .sort({ createdAt: -1 });

    return calculateTotal(campaigns);
  },
  // Get a campaign by ID
  async getById(id: string, isLean: boolean) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const campaign = await Campaign.findById(id).populate("ngo").lean();
    if (!campaign) throw new ServerError(serverMessages.campaign.not_found.he, 404);
    if (isLean) {
      const [cmp] = calculateTotal([campaign])
      return cmp;
    } else {
      return campaign
    }
  },

    // Change all campaigns status for an NGO
async changeCampainsStatus(ngoId: string, isActive:boolean){
  await Campaign.updateMany({ ngo: ngoId }, { isActive: isActive });
},
  async getByNgo(ngoId: string) {
    if (!mongoose.Types.ObjectId.isValid(ngoId)) return null;
    const items = await Campaign.find({ ngo: ngoId })
      .populate("ngo").lean()
      .sort({ createdAt: -1 });

    return { items: calculateTotal(items), total: items.length }
  },


  async addDonationToCampaign(campaignId: string, amount: number, method: string) {

    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) throw new Error('Campaign not found');
      if (method == 'card')
        campaign.raised.credit = (+campaign.raised.credit || 0) + +amount;
      else
        campaign.raised.crypto = (+campaign.raised.crypto || 0) + +amount;
      campaign.numOfDonors = (campaign.numOfDonors || 0) + 1;

      await campaign.save();

      return campaign;
    } catch (err) {
      throw err;
    }
  },
  getCampaignTags: () => tags.campaign
};

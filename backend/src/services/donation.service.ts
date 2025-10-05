// src/services/donation.service.ts
import Donation from '../models/donation.model';
import Campaign from '../models/campaign.model';
import AuditLog from '../models/auditlog.model';
import blockchainService from './blockchain.service';

export default {
  // creates donation record, validates onchain tx if needed, updates campaign.returns donation
  async createDonation({ donorId, campaignId, amount, currency = 'USD', method = 'card', txHash }: any) {
    // optional: verify onchain tx
    if (method === 'onchain' && txHash) {
      const receipt = await blockchainService.getTransaction(txHash);
      if (!receipt || (receipt as any).status !== 1) throw new Error('Invalid onchain transaction');
    }

    const donation = new Donation({
      donor: donorId || null,
      campaign: campaignId,
      amount,
      currency,
      method,
      txHash
    });
    await donation.save();

    // update campaign. Use Campaign service (or direct)
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');
    campaign.raised = (campaign.raised || 0) + amount;
    await campaign.save();

    await AuditLog.create({ action: 'donation_created', user: donorId || null, meta: { donationId: donation._id } });

    return donation;
  },

  async listByUser(userId: string) {
    return Donation.find({ donor: userId }).populate('campaign').sort({ createdAt: -1 });
  },
  async listByNgo(ngoId: string) {
    return Donation.find().populate({path:'campaign', match:{ngo:ngoId}}).sort({ createdAt: -1 });
  },

  async listByCampaign(campaignId: string) {
    return Donation.find({ campaign: campaignId }).populate('donor').sort({ createdAt: -1 });
  }
};

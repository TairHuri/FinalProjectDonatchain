import { Request, Response } from 'express';
import Donation from '../models/donation.model';
import Campaign from '../models/campaign.model';
import AuditLog from '../models/auditlog.model';
import blockchainService from '../services/blockchain.service';

export const donate = async (req: Request, res: Response) => {
  const { amount, currency, method, txHash } = req.body;
  const campaignId = req.params.id;
  const user = (req as any).user || null;
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Optional: if method === 'onchain' then verify txHash
    if (method === 'onchain' && txHash) {
      const receipt = await blockchainService.getTransaction(txHash);
      if (!receipt || receipt.status !== 1) {
        return res.status(400).json({ message: 'Invalid transaction' });
      }
    }

    const donation = new Donation({
      donor: user ? user._id : null,
      campaign: campaign._id,
      amount,
      currency,
      method,
      txHash
    });
    await donation.save();

    campaign.raised += amount;
    await campaign.save();

    await AuditLog.create({ action: 'donation_created', user: user?._id, meta: { donationId: donation._id } });

    return res.status(201).json({ donation });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

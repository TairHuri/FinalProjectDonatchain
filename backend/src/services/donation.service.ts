// src/services/donation.service.ts
import Donation, { CreditDonation, DonationIF } from '../models/donation.model';
import Campaign from '../models/campaign.model';
import AuditLog from '../models/auditlog.model';
import blockchainService from './blockchain.service';
import campaignService from './campaign.service';
import { ServerError } from '../middlewares/error.middleware';
import fetch from 'node-fetch';
import { sendReceiptEmail } from "../utils/receiptEmail";  // ✅ נוספה שליחה במייל
import mongoose from 'mongoose';

export default {

  cryptoDonate: async (donation: DonationIF, campaignId: string) => {

    try {
      const campaign = await Campaign.findById(campaignId);

      if (!campaign) throw new ServerError('Campaign not found', 404)

      // Optional: if method === 'onchain' then verify txHash
      if (donation.method === 'crypto' && donation.txHash) {
        const receipt = await blockchainService.getTransaction(donation.txHash);
        if (!receipt || receipt.status !== 1) {
          throw new ServerError('Invalid transaction', 400)
        }
      }

      const createdDonation = new Donation({ ...donation, campaign: campaign._id, });
      await createdDonation.save();

      await campaignService.addDonationToCampaign(campaignId, donation.amount);
      await AuditLog.create({ action: 'donation_created', meta: { donationId: createdDonation._id } });

      await sendReceiptEmail({
        donorEmail: donation.email,
        donorFirstName: donation.firstName,
        donorLastName: donation.lastName,
        amount: donation.amount,
        currency: donation.currency,
        method: "crypto",
        txHash: donation.txHash,

      });

      return donation;

    } catch (err: any) {
      throw err;
    }
  },


  creditDonate: async (creditDonation: Omit<CreditDonation, "method">, campaignId: string) => {

    try {
      const campaign = await campaignService.getById(campaignId);
      if (!campaign?.blockchainTx) {
        throw new ServerError('campaing in insuitable for crypto', 400);
      }

      const { amount, ccNumber, expYear, expMonth, cvv,
        ownerId, ownername, currency,
        email, firstName, lastName } = creditDonation;
      const chargeResponse = await fetch('http://localhost:8890/api/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount, ccNumber, expYear, expMonth, cvv,
          ownerId, ownername, currency,
          email, firstName, lastName
        }),
      });

      if (chargeResponse.status === 200) {
        const data = await chargeResponse.json() as { message: string, charge: number, code: string };

        const txHash = await blockchainService.recordFiatDonation(+(campaign?.blockchainTx), data.charge, currency, data.code)

        const donation = new Donation({
          email: creditDonation.email,
          phone: creditDonation.phone,
          firstName: creditDonation.firstName,
          lastName: creditDonation.lastName,
          campaign: campaignId,
          amount: +data.charge,
          currency,
          method: 'card',
          txHash: txHash,
          comment: creditDonation.comment,
        });

        await donation.save();
        await campaignService.addDonationToCampaign(campaignId, +data.charge)


        await AuditLog.create({ action: 'donation_created', meta: { donationId: donation._id } });

        // החזרת תגובה לפרונט
        return donation;
      } else {
        const text = await chargeResponse.text();
        throw new ServerError('Charge server error: ' + text, 502)
      }
    } catch (error) {
      console.error('❌ Error in creditDonate:', error);
      throw error;
    }
  },
  // creates donation record, validates onchain tx if needed, updates campaign.returns donation
  async createDonation({ donorId, campaignId, amount, currency = 'USD', method = 'card', txHash }: any) {
    if (method === 'crypto' && txHash) {
      const receipt = await blockchainService.getTransaction(txHash);
      if (!receipt || (receipt as any).status !== 1) throw new Error('Invalid onchain transaction');
    }

    const donation = new Donation({
      donor: donorId || null,
      campaign: campaignId,
      amount,
      currency,
      method,
      txHash,
    });
    await donation.save();

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');
    campaign.raised = (campaign.raised || 0) + amount;
    await campaign.save();

    await AuditLog.create({
      action: 'donation_created',
      user: donorId || null,
      meta: { donationId: donation._id },
    });

    return donation;
  },


  // -------------------- רשימות תרומות --------------------
  async listByUser(userId: string) {
    return Donation.find({ donor: userId })
      .populate('campaign')
      .sort({ createdAt: -1 });
  },

  async listByNgo(ngoId: string) {
    const objId = new mongoose.Types.ObjectId(ngoId);
    return Donation.aggregate([
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaign',
          foreignField: '_id',
          as: 'cDoc'
        }
      },
      { $unwind: '$cDoc' },
      {
        $match: {
          'cDoc.ngo': objId
        }
      }

    ])

    //return Donation.find().populate({ path: 'campaign', match: { ngo: ngoId } }).sort({ createdAt: -1 });
  },
  async fullListByCampaign(campaignId: string) {
    const objId = new mongoose.Types.ObjectId(campaignId);
    return Donation.find({ campaign: objId })
  },
  async listByCampaign(campaignId: string) {
    const objId = new mongoose.Types.ObjectId(campaignId);
    return Donation.aggregate([
      {
        $match: { campaign: objId }
      },
      {
        $addFields: {
          firstName: {
            $cond: {
              if: { $eq: ["$anonymous", true] },
              then: 'anonymous',
              else: '$firstName'
            }
          },
          lastName: {
            $cond: {
              if: { $eq: ["$anonymous", true] },
              then: 'anonymous',
              else: '$lastName'
            },
          }
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          amount: 1,
          currency: 1,
          comment: 1,
          txHash: 1,
        }
      }
    ])

  }
};

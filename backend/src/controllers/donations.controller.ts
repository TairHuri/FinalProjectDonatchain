import { Request, Response } from 'express';
import Donation from '../models/donation.model';
import Campaign from '../models/campaign.model';
import AuditLog from '../models/auditlog.model';
import blockchainService from '../services/blockchain.service';
import fetch from 'node-fetch'

type CreditDonation = {
  amount: number, currency: string, ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
  donorNumber:string, donorEmail:string, donorFirstName:string, donorLastName:string
}
export const creditDonate = async (req: Request, res: Response) => {
  const { amount, ccNumber, expYear, expMonth, cvv, ownerId, ownername, currency, donorNumber, donorEmail, donorFirstName, donorLastName } = req.body;
  const campaignId = req.params.id;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const chargeResponse = await fetch('http://127.0.0.1:8890/api/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, ccNumber, expYear, expMonth, cvv, ownerId, ownername, currency })
    })

    if (chargeResponse.status == 200) {
      const data = await chargeResponse.json();
      const donation = new Donation({
        //donor: user ? user._id : null,
        email: donorEmail,
        phone: donorNumber,
        firstName: donorFirstName, 
        lastName: donorLastName,
        campaign: campaign._id,
        amount: +data.charge,
        currency,
        method:'card',
      });
      await donation.save();
      
      campaign.raised = (+campaign.raised) + (+data.charge);
      await campaign.save();

      await AuditLog.create({ action: 'donation_created',  meta: { donationId: donation._id } });

      return res.status(201).json({ donation });
    } else {
      res.status(502).send({ message: 'charge server error '+  chargeResponse.status})
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).send({ message: 'charge server error ' + error })
  }

}

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

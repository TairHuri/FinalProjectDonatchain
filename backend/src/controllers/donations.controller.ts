import { Request, Response } from 'express';
import Donation from '../models/donation.model';
import Campaign from '../models/campaign.model';
import AuditLog from '../models/auditlog.model';
import blockchainService from '../services/blockchain.service';
import CampaignService from '../services/campaign.service';
import donationService from '../services/donation.service';
import fetch from 'node-fetch'

export const getDonationsByCampaign = async (req: Request, res: Response) =>{
  try{
  const {campaignId} = req.query;
  const donatios = await Donation.find({campaign:campaignId})
  res.send(donatios)
  }catch(error){
    res.status(500).send(error)
  }
}
export const getDonationsByNgo = async (req: Request, res: Response) =>{
  try{
  const {ngoId} = req.query;
  if(!ngoId)return res.status(400).send("invalid ngo id");
  const donatios = await donationService.listByNgo(ngoId.toString())
  res.send(donatios)
  }catch(error){
    res.status(500).send(error)
  }
}

type CreditDonation = {
  amount: number, currency: string, ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
  donorNumber:string, donorEmail:string, donorFirstName:string, donorLastName:string
}
export const creditDonate = async (req: Request, res: Response) => {
  const {
    amount, ccNumber, expYear, expMonth, cvv,
    ownerId, ownername, currency,
    donorNumber, donorEmail, donorFirstName, donorLastName
  } = req.body;
  const campaignId = req.params.id;

  try {
    // שולחים לשרת הסליקה גם את פרטי התורם כדי שישלח מייל קבלה
    const chargeResponse = await fetch('http://localhost:8890/api/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount, ccNumber, expYear, expMonth, cvv,
        ownerId, ownername, currency,
        donorEmail, donorFirstName, donorLastName
      }),
    });

    if (chargeResponse.status === 200) {
      const data = await chargeResponse.json();

      const donation = new Donation({
        email: donorEmail,
        phone: donorNumber,
        firstName: donorFirstName,
        lastName: donorLastName,
        campaign: campaignId,
        amount: +data.charge,
        currency,
        method: 'card',
      });

      await donation.save();
      await CampaignService.addDonationToCampaign(campaignId, +data.charge);
      await AuditLog.create({ action: 'donation_created', meta: { donationId: donation._id } });

      // החזרת תגובה לפרונט
      return res.status(201).json({ message: 'Donation successful and receipt email sent', donation });
    } else {
      const text = await chargeResponse.text();
      res.status(502).send({ message: 'Charge server error: ' + text });
    }
  } catch (error) {
    console.error('❌ Error in creditDonate:', error);
    res.status(500).send({ message: 'Charge server error ' + error });
  }
};


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



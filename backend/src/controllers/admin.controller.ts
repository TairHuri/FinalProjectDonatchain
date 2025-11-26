import { Request, Response } from 'express';
import User from '../models/user.model';
import Campaign from '../models/campaign.model';
import Donation from '../models/donation.model';
import Ngo from "../models/ngo.model";
import campaignService from '../services/campaign.service';
import { ServerError } from '../middlewares/error.middleware';
import { sendMemberStatusEmail, sendNgoStatusEmail } from '../middlewares/email.middleware';
import ngoService from '../services/ngo.service';
import serverMessages from '../config/serverMessages.json'

// ----------------------------
// Get all donors and total donated
// ----------------------------
export const getAllDonors = async (req: Request, res: Response) => {
  try {
        // Aggregate donors with their donations and calculate total donated amount
    const donors = await User.aggregate([
      { $match: { role: 'donor' } },
      {
        $lookup: {
          from: 'donations',
          localField: '_id',
          foreignField: 'donorId',
          as: 'donations',
        },
      },
      {
        $addFields: {
          totalDonated: { $sum: '$donations.amount' },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          totalDonated: 1,
        },
      },
    ]);

    res.json(donors);
  } catch (err) {
    console.error('שגיאה בשליפת התורמים:', err);
    res.status(500).send('שגיאה בשליפת רשימת התורמים');
  }
};

// ----------------------------
// Get general admin statistics
// ----------------------------
export const getAdminStats = async (req: Request, res: Response) => {
  try {
        // Run all database operations in parallel for better performance
    const [usersCount, ngosCount, campaignsCount, donationsCount, campaigns] = await Promise.all([
      User.countDocuments(),
      Ngo.countDocuments(),
      Campaign.countDocuments(),
      Donation.countDocuments(),
      campaignService.getAll(),
    ]);

      // Calculate total raised from all campaigns
    const totalRaised = campaigns.reduce((sum, d) => sum + (d.totalRaised || 0), 0);

    res.json({
      usersCount,
      ngosCount,
      campaignsCount,
      donationsCount,
      totalRaised,
    });
  } catch (err) {
    console.error("שגיאה בשליפת הנתונים:", err);
    res.status(500).json({ message: "שגיאה בשליפת הנתונים" });
  }
};

// ----------------------------
// Toggle single campaign status by admin
// ----------------------------
export const toggleCampignStatus = async(req: Request, res: Response) =>{
  const {campaignId} = req.params;
  try{
    const result = await campaignService.toggleAdminCampaignStatus(campaignId);
    res.send(result);
  }catch(error){
    res.status((error as ServerError).statusCode||500).send({status:false, message: (error as any).message})
  }
}

// ----------------------------
// Toggle multiple campaigns + NGO status
// Send email to NGO + all members
// ----------------------------
export const toggleCampignsStatus = async(req: Request, res: Response) =>{
  const {ngoId} = req.params;
  const {campaignIds, isActive} = req.body;
  try{
    console.log('**************** campaignIds', campaignIds);
    if(campaignIds.length >0){
      await campaignService.toggleAdminCampaignsStatus(campaignIds, isActive, ngoId);
    }

    const ngo = await ngoService.toggleNgoStatus(ngoId)
    if (ngo.email) {
      await sendNgoStatusEmail({
        to: ngo.email,
        ngoName: ngo.name,
        isActive: ngo.isActive,
      });
    } else {
      console.warn("⚠️ לא נמצא אימייל לעמותה:", ngo.name);
    }

 const User = (await import("../models/user.model")).default; // טעינה דינמית למניעת import מעגלי
    const members = await User.find({ ngoId: ngo._id });

    for (const member of members) {
      if (!member.email) continue;

      await sendMemberStatusEmail({
        to: member.email,
        fullName: member.name || "מתנדב/ת יקר/ה", // 👈 משתמשים בשדה הקיים
        ngoName: ngo.name,
        isActive: ngo.isActive,
      });
    }
    res.send({message: serverMessages.ngo.statusUpdate.he});
  }catch(error){
    console.log(error);
    
    res.status((error as ServerError).statusCode||500).send({status:false, message: (error as any).message})
  }
}
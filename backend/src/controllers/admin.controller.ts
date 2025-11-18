import { Request, Response } from 'express';
import User from '../models/user.model';
import Campaign from '../models/campaign.model';
import Donation from '../models/donation.model';
import Ngo from "../models/ngo.model";
import campaignService from '../services/campaign.service';

export const getAllDonors = async (req: Request, res: Response) => {
  try {
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

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [usersCount, ngosCount, campaignsCount, donationsCount, campaigns] = await Promise.all([
      User.countDocuments(),
      Ngo.countDocuments(),
      Campaign.countDocuments(),
      Donation.countDocuments(),
      campaignService.getAll(),
    ]);

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


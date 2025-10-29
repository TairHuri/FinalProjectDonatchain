import { Request, Response } from 'express';
import User from '../models/user.model';
import Campaign from '../models/campaign.model';
import Donation from '../models/donation.model';

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


export const getStats = async (req: Request, res: Response) => {
  try {
    const usersCount = await User.countDocuments();
    const campaignsCount = await Campaign.countDocuments();
    const donationsCount = await Donation.countDocuments();
    const totalRaised = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({
      usersCount,
      campaignsCount,
      donationsCount,
      totalRaised: (totalRaised[0] && totalRaised[0].total) || 0
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

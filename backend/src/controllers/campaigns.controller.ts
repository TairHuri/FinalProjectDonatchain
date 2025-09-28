// campaigns.controller.ts
import { Request, Response } from 'express';
import Campaign from '../models/campaign.model';


export const createCampaign = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== 'ngo') {
      return res.status(403).json({ message: 'רק עמותות יכולות ליצור קמפיינים' });
    }

    const {
      title,
      description,
      targetAmount,
      currency,
      tags,
      images,
      video,
      ngoLogo,
      goal,
    } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      targetAmount,
      currency,
      tags,
      images,
      video,
      ngoLogo,
      ngo: user._id,
      // אם רוצים לשמור goal גם בבסיס:
      goal,
    });

    res.status(201).json(campaign);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 🔎 קמפיין בודד לפי ID
 */
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "קמפיין לא נמצא" });
    }
    res.json(campaign);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * 📋 כל הקמפיינים (אפשר גם לפי עמותה)
 */
export const listCampaigns = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.query;
    console.log("ngoId received:", ngoId); // <-- בדיקה
    const filter = ngoId ? { ngo: ngoId.toString() } : {};
    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


import { Request, Response } from 'express';
import CampaignService from '../services/campaign.service';

/**
 * ➕ יצירת קמפיין חדש
 */
export const createCampaign = async (req: Request, res: Response) => {
  const { title, description, targetAmount, currency, tags, images, goal } = req.body;
  const user = (req as any).user;
  try {
    const campaign = await CampaignService.create({
      title,
      description,
      targetAmount,
      currency,
      goal,
      tags,
      images,
      ngoId: user._id
    });
    res.status(201).json(campaign);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 📋 הבאת רשימת קמפיינים עם תמיכה ב־חיפוש/סינון
 */
export const listCampaigns = async (req: Request, res: Response) => {
  const { q, tag, page = 1, limit = 10 } = req.query as any;
  try {
    const result = await CampaignService.search({
      q,
      tag,
      page: Number(page),
      limit: Number(limit)
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔎 הבאת קמפיין בודד לפי ID
 */
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await CampaignService.getById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCampagnsByNgo = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.query;
    if (!ngoId) return res.status(400).send({ message: 'invalid ngo id' })
    return await CampaignService.getByNgo(ngoId.toString())
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
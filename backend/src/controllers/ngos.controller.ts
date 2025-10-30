// src/controllers/ngos.controller.ts
import { Request, Response } from 'express';
import Ngo from '../models/ngo.model';
import AuditLog from '../models/auditlog.model';
import { MediaFiles, NgoMediaFiles } from '../middlewares/multer.middleware';

export const createNgo = async (req: Request, res: Response) => {
  const { name, description, website, contactEmail, logoUrl } = req.body;
  const user = (req as any).user;
  try {
    const ngo = new Ngo({
      name, description, website, contactEmail, logoUrl, createdBy: user._id
    });
    await ngo.save();
    await AuditLog.create({ action: 'ngo_created', user: user._id, meta: { ngoId: ngo._id } });
    res.status(201).json(ngo);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listNgos = async (req: Request, res: Response) => {
  try {
    const items = await Ngo.aggregate([
      {
        $lookup:{
          from:'campaigns',
          localField:'_id',
          foreignField:'ngo',
          as: 'campaigns'
        }
      },
      {
        $addFields:{
          ngoCampaignsCount: {$size: "$campaigns"}
        }
      },
      {
        $project:{
          campaigns:0
        }
      }
    ])
    // await Ngo.find().sort({ createdAt: -1 }).limit(100);
    res.json({ items });
  } catch (err: any) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
};

export const getNgo = async (req: Request, res: Response) => {
  try {
    const ngo = await Ngo.findById(req.params.id).populate('createdBy', 'name email');
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    res.json(ngo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNgo = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    // אם המשתמש אינו היוצר ולא admin — Forbidden
    if (ngo.createdBy?.toString() !== user._id.toString() && !(user.role == 'admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = req.body;
    Object.assign(ngo, updates);
    const mediaFiles = req.files as NgoMediaFiles;
    if(mediaFiles.logo){
      ngo.logoUrl = mediaFiles.logo[0].filename
    }
    await ngo.save();
    await AuditLog.create({ action: 'ngo_updated', user: user._id, meta: { ngoId: ngo._id } });
    res.json(ngo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

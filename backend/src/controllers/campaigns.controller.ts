import { Request, Response } from 'express';
import CampaignService from '../services/campaign.service';
import { MediaFiles } from '../middlewares/multer.middleware';


/**
 * ➕ יצירת קמפיין חדש
 */
export const createCampaign = async (req: Request, res: Response) => {
  
  const { title, description, startDate, endDate, tags, goal, isActive, blockchainTx } = req.body;

  const user :{_id:string, ngoId:string}= (req as any).user;
  console.log('req.files', req.files);
  
  try {
    const mediaFiles = req.files as MediaFiles
    const images:string[] = mediaFiles.images? mediaFiles.images.map((file:Express.Multer.File) => file.filename) : []
    const movie:string|null = mediaFiles.movie? mediaFiles.movie[0].filename : null
    const mainImage:string|null = mediaFiles.mainImage? mediaFiles.mainImage[0].filename : null
    const campaign = await CampaignService.create({
      title,
      description,
      raised:0,
      startDate, 
      endDate,
      blockchainTx,
      goal,
      tags,
      images,
      movie,
      mainImage,
      ngo: user.ngoId,
      isActive
    });
    res.status(201).json(campaign);
  } catch (err: any) {
    console.log(err);
    
    res.status(400).json({ message: err.message });
  }
}

/**
 * עדכון קמפיין
 * 
 * @param req 
 * @param res 
 */
export const updateCampaign = async (req: Request, res: Response) => {
  const {campaignId} = req.params;
  const { title, description, startDate, endDate, tags, goal, raised, isActive, blockchainTx, existingImages:images, existingMovie: movie, existingMainImage: mainImage } = req.body;

  const user :{_id:string, ngoId:string}= (req as any).user;
  console.log('existingImages', images);
  
  try {
    const mediaFiles = req.files as MediaFiles
    const newImages:string[] = mediaFiles.images? mediaFiles.images.map((file:Express.Multer.File) => file.filename) : []
    const newMovie:string|null = mediaFiles.movie? mediaFiles.movie[0].filename : null
    const newMainImage:string|null = mediaFiles.mainImage? mediaFiles.mainImage[0].filename : null
    
    console.log('movie', movie,newMovie, movie?movie:newMovie);
    console.log('mainImage',mainImage,newMainImage,  mainImage||newMainImage);
    const campaign = await CampaignService.update({
      _id:campaignId,
      title,
      description,
      raised,
      startDate, 
      endDate,
      blockchainTx,
      goal,
      tags,
      images: [...images, ...newImages],
      movie: movie?movie:newMovie,
      mainImage: mainImage?mainImage:newMainImage,
      ngo: user.ngoId,
      isActive
    });
    res.status(201).json(campaign);
  } catch (err: any) {
    console.log(err);
    
    res.status(400).json({ message: err.message });
  }
}

/**
 * 📋 הבאת רשימת קמפיינים עם תמיכה ב־חיפוש/סינון
 */
export const listCampaigns = async (req: Request, res: Response) => {
  const { q, tag, page = 1, limit = 10, ngoId } = req.query as any;
  try {
    if(ngoId){
      const result = await CampaignService.getByNgo(ngoId);
      res.json(result);
      return;
    }
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

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await CampaignService.getAll();
    res.json(campaigns);
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
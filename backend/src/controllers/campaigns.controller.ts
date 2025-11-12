import { Request, Response } from 'express';
import CampaignService from '../services/campaign.service';
import { MediaFiles } from '../middlewares/multer.middleware';
import { INgo } from '../models/ngo.model';
import { ServerError } from '../middlewares/error.middleware';
import { IUser } from '../models/user.model';



export const createCampaign = async (req: Request, res: Response) => {

  const { title, description, startDate, endDate, tags, goal, isActive, blockchainTx } = req.body;

  const user: { _id: string, ngoId: string } = (req as any).user;
  console.log('req.files', req.files);

  try {
    const mediaFiles = req.files as MediaFiles

    const images: string[] = mediaFiles.images ? mediaFiles.images.map((file: Express.Multer.File) => file.filename) : []
    const movie: string | null = mediaFiles.movie ? mediaFiles.movie[0].filename : null
    const mainImage: string | null = mediaFiles.mainImage ? mediaFiles.mainImage[0].filename : null
    const campaign = await CampaignService.create({
      title,
      description,
      raised: 0,
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

export const updateCampaign = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const { title, description, startDate, endDate, tags, goal, raised, isActive, blockchainTx, existingImages: images = [], existingMovie: movie, existingMainImage: mainImage } = req.body;

  const user: { _id: string, ngoId: string } = (req as any).user;
  console.log('existingImages', images);

  try {
    const mediaFiles = req.files as MediaFiles
    const newImages: string[] = mediaFiles.images ? mediaFiles.images.map((file: Express.Multer.File) => file.filename) : []
    const newMovie: string | null = mediaFiles.movie ? mediaFiles.movie[0].filename : null
    const newMainImage: string | null = mediaFiles.mainImage ? mediaFiles.mainImage[0].filename : null

    console.log('movie', movie, newMovie, movie ? movie : newMovie);
    console.log('mainImage', mainImage, newMainImage, mainImage || newMainImage);
    const campaign = await CampaignService.update({
      _id: campaignId,
      title,
      description,
      raised,
      startDate,
      endDate,
      blockchainTx,
      goal,
      tags,
      images: [...images, ...newImages],
      movie: movie ? movie : newMovie,
      mainImage: mainImage ? mainImage : newMainImage,
      ngo: user.ngoId,
      isActive
    });
    res.status(201).json(campaign);
  } catch (err: any) {
    console.log(err);

    res.status(400).json({ message: err.message });
  }
}


export const listCampaigns = async (req: Request, res: Response) => {
  const { q, tag, page = 1, limit = 20, ngoId } = req.query as any;
  try {
    if (ngoId) {
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

export const toggleCampaignStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaign = await CampaignService.getById(id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    console.log((req.user as any).ngoId.toString(), (campaign.ngo as unknown as INgo)._id.toString())
    if (req.user!.role == 'admin' || (req.user as any).ngoId.toString() != (campaign.ngo as unknown as INgo)._id.toString()) return res.status(403).json({ message: "You are not part of this NGO" });
    campaign.isActive = !campaign.isActive;
    await campaign.save();

    res.json({
      message: `קמפיין ${campaign.isActive ? "הופעל מחדש " : "הושהה "}`,
      campaign,
    });
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

export const getCampaignTags = (req: Request, res: Response) => {
  const tags = CampaignService.getCampaignTags();
  res.send(tags)
}

export const getCampaignReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const includeDonations = req.query.includeDonations === "1";
  const includeComments = req.query.includeComments === "1";
  console.log('getCampaignReport');

  try {
    const data: { filename: string, pdf: Uint8Array<ArrayBufferLike> } = await CampaignService.generateReport(id, req.user as IUser, includeDonations, includeComments);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${data.filename}"`);
    res.setHeader("Content-Length", data.pdf.length.toString());
    res.end(data.pdf);
    return;
  } catch (error) {
    let statusCode = 500;
    if (error instanceof ServerError) {
      statusCode = (error as ServerError).statusCode
    }
    res.status(statusCode).send(((error as Error).message))
  }
}
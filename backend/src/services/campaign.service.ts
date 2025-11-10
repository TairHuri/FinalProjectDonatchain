// src/services/campaign.service.ts
import Campaign from '../models/campaign.model';
import mongoose from 'mongoose';
import tags from '../config/campaignTags.json'
import fs from "node:fs";
import PDFDocument from "pdfkit";

type CreatePdfOptions = {
  outputPath?: string;                 // אם לא, יוחזר Buffer
  pageSize?: PDFKit.PDFDocumentOptions["size"];
  fontPathRegular?: string;            // הצמידי כאן פונט שתומך בעברית (WOFF/TTF/OTF)
  fontPathBold?: string;
  rtl?: boolean;                       // אם תרצי ליישר לימין
};
export default {
  async generateReport(campaignId: string) {
    const campaign = await this.getById(campaignId)
    const pdfOptions: CreatePdfOptions = { outputPath: '', pageSize: 'A4', fontPathBold: '', fontPathRegular: '', rtl: true }
    const doc = new PDFDocument({
      size: pdfOptions.pageSize,
      margin: 50,
      bufferPages: true
    });

    let outStream: fs.WriteStream | null = null;
    const chunks: Buffer[] = [];
    const resultPromise: Promise<Buffer | void> = new Promise((resolve, reject) => {
      if (pdfOptions.outputPath) {
        outStream = fs.createWriteStream(pdfOptions.outputPath);
        doc.pipe(outStream);
        outStream.on("finish", () => resolve());
        outStream.on("error", reject);
      } else {
        doc.on("data", (c: Buffer) => chunks.push(c));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
      }
      doc.on("error", reject);
    });
    if (pdfOptions.fontPathRegular) {
      doc.registerFont("Regular", pdfOptions.fontPathRegular);
      doc.font("Regular");
    }
    if (pdfOptions.fontPathBold) {
      doc.registerFont("Bold", pdfOptions.fontPathBold);
    }
    const isRTL = !!pdfOptions.rtl;
  const alignMain: PDFKit.Mixins.TextOptions["align"] = isRTL ? "right" : "left"
  },
  async create(payload: any) {
    const campaign = new Campaign(payload);
    await campaign.save();
    return campaign;
  },
  async update(payload: any) {
    const campaign = await Campaign.findByIdAndUpdate(payload._id, payload, { new: true }).populate('ngo')

    return campaign;
  },

  async search({ q, tag, page = 1, limit = 10 }: any) {
    const filter: any = { isActive: true };
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };
    const items = await Campaign.find(filter).populate('ngo')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Campaign.countDocuments(filter);
    return { items, total, page, limit };
  },
  async getAll() {
    return await Campaign.find()
      .populate('ngo')
      .sort({ createdAt: -1 });
  },
  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Campaign.findById(id).populate("ngo");
  },

  async getByNgo(ngoId: string, page = 1, limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(ngoId)) return null;
    const items = await Campaign.find({ ngo: ngoId }).populate("ngo")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { items, total: items.length, page, limit }
  },


  async addDonationToCampaign(campaignId: string, amount: number) {

    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) throw new Error('Campaign not found');
      campaign.raised = (+campaign.raised || 0) + +amount;
      campaign.numOfDonors = (campaign.numOfDonors || 0) + 1;

      await campaign.save();

      return campaign;
    } catch (err) {
      throw err;
    }
  },
  getCampaignTags: () => tags
};

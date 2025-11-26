// src/controllers/ngos.controller.ts
import { Request, Response } from "express";
import Ngo from "../models/ngo.model";
import AuditLog from "../models/auditlog.model";
import { NgoMediaFiles } from "../middlewares/multer.middleware";
import Campaign from "../models/campaign.model";
import service, { ApiSuccessType } from '../services/ngo.service'
import ngoService from "../services/ngo.service";
import aiService from '../services/ai.service'
import { ServerError } from "../middlewares/error.middleware";
import { sendMemberStatusEmail, sendNgoStatusEmail } from "../middlewares/email.middleware";

// ===============================
//  AI-based NGO search controller
// ===============================
export const aiSearchNgo = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if(!q){
      throw new ServerError("invalid or empty query", 400)
    }
    const result:{message:string, data:{name:string, ngoNumber:number,Similarity_Score:number }[]} = await aiService.search(q.toString())
    const ngoResults = await ngoService.getByNgoNumberList(result.data.map(d =>`${d.ngoNumber}`));
    
    res.send(ngoResults)
  } catch (error) {
    res.status((error as any).statusCode || 500).send({ message: (error as any).message })
  }
}

// =====================================
//  Verify NGO (Active + Approved check)
// =====================================
export const verifyNgo = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: 'הקלידו את מספר העמותה' })
  }
  const activeResult = await service.verifyNgoActive(id.toString());
  if (!activeResult.status) {
    return res.status(400).send({ message: activeResult.message })
  }

  const approveResult = await service.verifyNgoApproved(id.toString());
  const year = new Date().getFullYear();
  const currentYear = `${year}` as keyof ApiSuccessType;
  const lastYear = `${year - 1}` as keyof ApiSuccessType;
  if (approveResult.status === false) {
    return res.status(400).send({ message: approveResult.message })
  }
  const apiSuccess = approveResult as ApiSuccessType;
  if (apiSuccess[currentYear].status || apiSuccess[lastYear].status) {
    return res.send();
  }
  res.status(400).send({ message: `${currentYear}: ${apiSuccess[currentYear].message}, ${lastYear}: ${apiSuccess[lastYear]}` })

}

// ===============================
//  Create new NGO
// ===============================
export const createNgo = async (req: Request, res: Response) => {
  const { name, description, website, contactEmail, logoUrl, certificate, ngoNumber } = req.body;
  const user = (req as any).user;

  try {
    const existingNgo = await Ngo.findOne({
      $or: [
        { name: name.trim() },
        { ngoNumber: ngoNumber?.trim() }
      ],
    });

    if (existingNgo) {
      return res.status(400).json({
        message: "עמותה עם שם זה או מספר עמותה זה כבר קיימת במערכת",
      });
    }

    const ngo = new Ngo({
      name,
      ngoNumber,
      description,
      website,
      email: contactEmail,
      logoUrl,
      certificate,
      createdBy: user._id,
    });

    await ngo.save();

    await AuditLog.create({
      action: "ngo_created",
      user: user._id,
      meta: { ngoId: ngo._id },
    });

    res.status(201).json(ngo);
  } catch (err: any) {
    console.error("שגיאה ביצירת עמותה:", err);
    res.status(400).json({ message: err.message });
  }
};

// ===============================
// 📋 List NGOs with campaign count
// ===============================
export const listNgos = async (_req: Request, res: Response) => {
  try {
    const items = await Ngo.aggregate([

      {
        $lookup: {
          from: "campaigns",
          localField: "_id",
          foreignField: "ngo",
          as: "campaigns",
        },
      },
      {
        $addFields: {
          ngoCampaignsCount: { $size: "$campaigns" },
        },
      },
      {
        $project: {
          campaigns: 0,
        },
      },
    ]);

    res.json({ items });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ===============================
//  Get single NGO with creator info
// ===============================
export const getNgo = async (req: Request, res: Response) => {
  try {
    const ngo = await Ngo.findById(req.params.id).populate("createdBy", "name email");
    if (!ngo) return res.status(404).json({ message: "עמותה לא נמצאה" });
    res.json(ngo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// ============================================
//  Toggle NGO status (activate/suspend NGO)
// ============================================
export const toggleNgoStatus = async (req: Request, res: Response) => {
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: "עמותה לא נמצאה" });
    ngo.isActive = !ngo.isActive;
    await ngo.save({ validateModifiedOnly: true });
    await Campaign.updateMany({ ngo: ngo._id }, { isActive: ngo.isActive });
    await AuditLog.create({
      action: ngo.isActive ? "ngo_reactivated" : "ngo_suspended",
      user: (req as any).user._id,
      meta: { ngoId: ngo._id, newStatus: ngo.isActive },
    });

    if (ngo.email) {
      await sendNgoStatusEmail({
        to: ngo.email,
        ngoName: ngo.name,
        isActive: ngo.isActive,
      });
    } else {
      console.warn("⚠️ לא נמצא אימייל לעמותה:", ngo.name);
    }

    const User = (await import("../models/user.model")).default; 
    const members = await User.find({ ngoId: ngo._id });

    for (const member of members) {
      if (!member.email) continue;

      await sendMemberStatusEmail({
        to: member.email,
        fullName: member.name || "מתנדב/ת יקר/ה", 
        ngoName: ngo.name,
        isActive: ngo.isActive,
      });
    }

    res.json({
      success: true,
      message: ngo.isActive
        ? "✅ העמותה הופעלה מחדש, כל הקמפיינים הופעלו ונשלחו מיילים לעמותה ולחבריה."
        : "⛔ העמותה הושהתה, כל הקמפיינים הושבתו ונשלחו מיילים לעמותה ולחבריה.",
      ngo,
    });
  } catch (err: any) {
    console.error("❌ toggleNgoStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// Update NGO (including media files)
// ===============================
export const updateNgo = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {

    if (!['manager'].includes(user.role)) {
      return res.status(403).json({ message: "אין הרשאה לעדכן עמותה זו" });
    }

    const ngo = req.body;
    const {id} = req.params;
    
    const mediaFiles = req.files as NgoMediaFiles;
    if (mediaFiles?.logo) {
      ngo.logoUrl = mediaFiles.logo[0].filename;
    }
    if (mediaFiles?.certificate) {
      ngo.certificate = mediaFiles.certificate[0].filename;
    }
    const updatedNgo = await ngoService.update(id, ngo);
    await AuditLog.create({ action: "ngo_updated", user: user._id, meta: { ngoId: ngo._id } });

    res.json(updatedNgo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getNgoTags = (req: Request, res: Response) => {
  const tags = ngoService.getNgoTags();
  res.send(tags)
}
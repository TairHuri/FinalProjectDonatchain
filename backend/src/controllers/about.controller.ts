import { Request, Response } from "express";
import AboutPage from "../models/about.model";

export const getAboutPage = async (req: Request, res: Response) => {
  try {
    const page = await AboutPage.findOne();
    if (!page) return res.status(404).json({ message: "About page not found" });
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAboutPage = async (req: Request, res: Response) => {
  try {
    let page = await AboutPage.findOne();
    if (!page) {
      page = new AboutPage(req.body);
    } else {
      Object.assign(page, req.body);
    }
    await page.save();
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

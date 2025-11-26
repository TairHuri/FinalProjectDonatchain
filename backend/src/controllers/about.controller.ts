import { Request, Response } from "express";
import AboutPage from "../models/about.model";

// Fetch the About page
export const getAboutPage = async (req: Request, res: Response) => {
  try {
    // Retrieve the single About page document
    const page = await AboutPage.findOne();

    // If no document exists, return a 404 response
    if (!page) return res.status(404).json({ message: "About page not found" });

    // Return the page data
    res.json(page);
  } catch (err: any) {
    // Handle unexpected server errors
    res.status(500).json({ message: err.message });
  }
};

// Update or create the About page
export const updateAboutPage = async (req: Request, res: Response) => {
  try {
    // Check if an About page already exists
    let page = await AboutPage.findOne();

    // If not found, create a new document
    if (!page) {
      page = new AboutPage(req.body);
    } else {
      // If found, update existing fields with the incoming request data
      Object.assign(page, req.body);
    }

    // Save changes to the database
    await page.save();

    // Return the updated (or newly created) page
    res.json(page);
  } catch (err: any) {
    // Handle unexpected server errors
    res.status(500).json({ message: err.message });
  }
};

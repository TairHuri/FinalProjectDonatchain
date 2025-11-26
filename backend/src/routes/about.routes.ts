import { Router, Request, Response } from "express";

import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';
const router = Router();

const ABOUT_PATH = path.join(__dirname, '..', 'config', 'aboutContent.json');


router.get("/", async(req: Request, res: Response) => {
  const fileContent = await readFile(ABOUT_PATH, 'utf8');
    const aboutContent = JSON.parse(fileContent || '{}');
  res.json(aboutContent);
});


router.put("/", async (req: Request, res: Response) => {
  const updates = req.body;
  
const fileContent = await readFile(ABOUT_PATH, 'utf8');
    const aboutContent = JSON.parse(fileContent || '{}');

  const updatedContent = { ...aboutContent, ...updates }
  const data = JSON.stringify(updatedContent, null, 2)
  
  await writeFile(ABOUT_PATH, data,'utf8')
  res.json(aboutContent);
});

export default router;

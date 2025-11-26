import { Router, Request, Response } from "express";
import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';

const router = Router();
const ABOUT_PATH = path.join(__dirname, '..', 'config', 'rulesContent.json');


router.get("/", async (req: Request, res: Response) => {
  const fileContent = await readFile(ABOUT_PATH, 'utf8');
  const rulesContent = JSON.parse(fileContent || '{}');
  res.json(rulesContent);
});

router.put("/", async (req: Request, res: Response) => {
  const rulesContent = req.body;
  const data = JSON.stringify(rulesContent, null, 2)
  await writeFile(ABOUT_PATH, data,'utf8')      
  
  res.json(rulesContent);
});

export default router;

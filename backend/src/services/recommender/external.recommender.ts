// src/services/recommender/external.recommender.ts
// ממשק לדוגמה לשירות חיצוני — מיישם פונקציה recommendForUser
import fetch from 'node-fetch';
import { config } from '../../config';
import Campaign from '../../models/campaign.model';

const EXTERNAL_URL = process.env.EXTERNAL_AI_URL || 'https://api.example-ai.com/recommend';

export default {
  async recommendForUser(userId: string, limit = 5) {
    // דוגמה: שולחים בקשה לשירות חיצוני עם userId; מחזירים רשימת campaignIds
    // במימוש אמיתי — תשלחי טקסט/היסטוריה ורספונס יהיה JSON
    if (!config.aiApiKey) {
      throw new Error('AI API key not configured');
    }
    // לבאופן פיתוח — fallback ל־mock
    try {
      const resp = await fetch(EXTERNAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.aiApiKey}` },
        body: JSON.stringify({ userId, limit })
      });
      if (!resp.ok) throw new Error(`AI service error ${resp.status}`);
      const data = await resp.json();
      // data.campaignIds assumed
      const ids = data.campaignIds || [];
      const campaigns = await Campaign.find({ _id: { $in: ids } });
      // map to preserve order
      const ordered = ids.map((id: string) => campaigns.find(c => c._id.toString() === id.toString())).filter(Boolean);
      return ordered.map((c: any, idx: number) => ({ campaign: c, score: data.scores?.[idx] ?? 1 }));
    } catch (err) {
      // אם השירות החיצוני נכשל — כשל רך: החזרו ריק
      return [];
    }
  }
};

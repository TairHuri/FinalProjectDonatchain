// src/services/recommender/external.recommender.ts

import fetch from 'node-fetch';
import { config } from '../../config';
import Campaign from '../../models/campaign.model';

const EXTERNAL_URL = process.env.EXTERNAL_AI_URL || 'https://api.example-ai.com/recommend';

export default {
  async recommendForUser(userId: string, limit = 5) {

    if (!config.aiApiKey) {
      throw new Error('AI API key not configured');
    }

    try {
      const resp = await fetch(EXTERNAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.aiApiKey}` },
        body: JSON.stringify({ userId, limit })
      });
      if (!resp.ok) throw new Error(`AI service error ${resp.status}`);
      const data = await resp.json();

      const ids = data.campaignIds || [];
      const campaigns = await Campaign.find({ _id: { $in: ids } });
      // map to preserve order
      const ordered = ids.map((id: string) => campaigns.find(c => c._id.toString() === id.toString())).filter(Boolean);
      return ordered.map((c: any, idx: number) => ({ campaign: c, score: data.scores?.[idx] ?? 1 }));
    } catch (err) {

      return [];
    }
  }
};

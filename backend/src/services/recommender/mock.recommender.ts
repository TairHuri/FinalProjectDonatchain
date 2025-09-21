import Campaign from '../../models/campaign.model';
import Donation from '../../models/donation.model';
import User from '../../models/user.model';

const getUserTags = async (userId: string) => {
  const donations = await Donation.find({ donor: userId }).populate('campaign');
  const tags: Record<string, number> = {};
  for (const d of donations) {
    const c: any = (d as any).campaign;
    if (c && c.tags) {
      c.tags.forEach((t: string) => tags[t] = (tags[t] || 0) + 1);
    }
  }
  // fallback: empty => default popular tags
  return Object.keys(tags).length ? tags : { health:1, education:1 };
};

const scoreCampaign = (campaignTags: string[], userTags: Record<string, number>) => {
  let s = 0;
  for (const t of campaignTags) if (userTags[t]) s += userTags[t];
  return s;
};

export default {
  async recommendForUser(userId: string, limit = 5) {
    const userTags = await getUserTags(userId);
    const campaigns = await Campaign.find({ isActive: true }).limit(200);
    const scored = campaigns.map(c => ({ campaign: c, score: scoreCampaign(c.tags || [], userTags) }));
    scored.sort((a,b) => b.score - a.score);
    return scored.slice(0, limit).map(s => ({ campaign: s.campaign, score: s.score }));
  }
};

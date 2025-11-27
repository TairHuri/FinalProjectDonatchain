import { Request, Response } from 'express';
import Donation from '../models/donation.model';
import donationService from '../services/donation.service';
import { ServerError } from '../middlewares/error.middleware';
import serverMessages from '../config/serverMessages.json'
/**
 * Get all donations for a specific campaign (basic info only).
 */
export const getDonationsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.query;
    if(!campaignId)return res.status(400).send({message:serverMessages.campaign.missing_id.he})
    const donatios = await donationService.listByCampaign(campaignId.toString())  
    res.send(donatios)
  } catch (error) {
    console.log(error);
    
    res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
  }
}

/**
 * Get full donation details for a specific campaign (includes donor data, etc.).
 */
export const getFullDonationsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.query;
    if(!campaignId)return res.status(400).send({message: serverMessages.campaign.missing_id.he})
    const donatios = await donationService.fullListByCampaign(campaignId.toString())  //Donation.find({ campaign: campaignId })
    res.send(donatios)
  } catch (error) {
    console.log(error);
    
    res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
  }
}

/**
 * Get all donations for a specific NGO (aggregated from all its campaigns).
 */
export const getDonationsByNgo = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.query;
    if (!ngoId) return res.status(400).send("invalid ngo id");
    const donatios = await donationService.listByNgo(ngoId.toString())
    res.send(donatios)
  } catch (error) {
    res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
  }
}


/**
 * Process a credit card donation.
 * Also triggers email receipt sending inside the service.
 */
export const creditDonate = async (req: Request, res: Response) => {
  const {
    amount,originalAmount, ccNumber, expYear, expMonth, cvv,
    ownerId, ownername, currency,
    phone, email, firstName, lastName, comment, anonymous
  } = req.body;
  const campaignId = req.params.id;
  try {
    const donation = await donationService.creditDonate({
      amount,originalAmount, ccNumber, expYear, expMonth, cvv, ownerId, ownername, currency,
      phone, email, firstName, lastName, comment, campaign: campaignId, anonymous
    }, campaignId)


    return res.status(201).json({ message: 'Donation successful and receipt email sent', donation });

  } catch (error) {
    console.error(' Error in creditDonate:', error);
    res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
  }
};
/**
 * Retrieve all donations in the system.
 * Includes campaign and NGO information via population.
 */
export const getAllDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const donations = await Donation.find()
      .populate({
        path: "campaign",
        select: "title ngo",
        populate: {
          path: "ngo",
          select: "name",
        },
      });

    res.json(donations);
  } catch (error) {
    console.error(" Error fetching all donations:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

/**
 * Process a cryptocurrency donation.
 * Saves wallet transaction hash and donation metadata.
 */
export const cryptoDonate = async (req: Request, res: Response) => {
  const { phone, email, firstName, lastName, originalAmount, currency, method, txHash, comment, anonymous } = req.body;
  const campaignId = req.params.id;

  try {
   const donation = await  donationService.cryptoDonate(
      { phone, email, firstName, lastName, amount:originalAmount,originalAmount, campaign:campaignId, currency, method, txHash, comment, anonymous },
      campaignId
    )

    return res.status(201).json({ donation });

  } catch (error: any) {
    res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
  }
};



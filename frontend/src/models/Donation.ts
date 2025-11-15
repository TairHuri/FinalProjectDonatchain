
export interface Donation {
  _id?:string
  email:string;
  phone:string;
  firstName: string;
  lastName: string;
  campaign: string;
  amount: number;
  originalAmount:number;
  currency: string;
  method?: string; // e.g. 'card','wallet','onchain'
  txHash?: string; // blockchain tx if onchain
  comment?: string;
  createdAt?: Date;
  anonymous?: boolean
}

export interface CreditDonation extends Donation {
  ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
  
}

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
  method?: string; 
  txHash?: string;
  comment?: string;
  createdAt?: Date;
  anonymous?: boolean
}

export interface CreditDonation extends Donation {
  ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
  
}
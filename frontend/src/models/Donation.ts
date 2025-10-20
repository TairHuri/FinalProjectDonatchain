
export interface Donation {
  _id?:string
  email:string;
  phone:string;
  firstName: string;
  lastName: string;
  // donor: string;
  campaign: string;
  amount: number;
  currency: string;
  method: string; // e.g. 'card','wallet','onchain'
  txHash?: string; // blockchain tx if onchain
  createdAt?: Date;
}
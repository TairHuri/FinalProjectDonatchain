export interface Campaign  {
_id?: string;
  title: string;
  description: string;
  ngo:  string
  goal: number;
  startDate: string;
  endDate: string;
  raised: {crypto:number, credit:number};
  totalRaised?:number;  // calculated field in server
  numOfDonors: number;
  images: string[];
  movie?:string;
  mainImage?:string;
  tags: string[]; // for recommendations
  blockchainTx?: string; // optional tx that created campaign on-chain
  isActive: boolean;
  createdAt?: Date;
}

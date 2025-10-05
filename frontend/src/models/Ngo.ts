export interface Ngo {
    _id: string;
    name: string;
    description: string;
    website?: string;
    bankAccount?: string;
    wallet?: string;
    address?: string;
    phone?: string;
    email?: string;
    logoUrl?: string;
    createdBy: string;
    createdAt: Date;
    token: string;
    ngoNumber:string;
}
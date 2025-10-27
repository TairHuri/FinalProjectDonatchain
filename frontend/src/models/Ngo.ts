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
    certificate:string;
    createdBy: string;
    createdAt: Date;
    ngoNumber:string;
}
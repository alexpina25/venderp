export interface Client {
    id: string;
    name: string;
    address: string;
    contactName: string;
    contactPhone: string;
    email?: string;
    notes?: string;
    createdAt: Date;
  }
  
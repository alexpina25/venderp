export interface RouteItem {
    machineId: string;
    machineCode: string;
    location: string;
    productsToRefill: {
      productId: string;
      productName: string;
      quantity: number;
    }[];
  }
  
  export interface Route {
    id: string;
    date: Date;
    operator: string;
    notes?: string;
    machines: RouteItem[];
  }
export type ProductCategory = "SNACK" | "DRINK" | "COMBO" | "OTHER";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  stockMin: number;
  image?: string;
  createdAt: Date;
}

export type ProductCategory = "Groceries" | "Home & Living" | "Health & Beauty";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  bulkPrice: number;
  minOrder: number;
  image: string;
  discount: number;
  sizes?: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Rice (50kg Bag)",
    category: "Groceries",
    price: 4500,
    bulkPrice: 4200,
    minOrder: 10,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=80",
    discount: 15,
  },
  {
    id: "2",
    name: "Cooking Oil (20L Jerry Can)",
    category: "Groceries",
    price: 3200,
    bulkPrice: 2950,
    minOrder: 20,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&q=80",
    discount: 10,
  },
  {
    id: "3",
    name: "Maize Flour (90kg Bag)",
    category: "Groceries",
    price: 5800,
    bulkPrice: 5400,
    minOrder: 15,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=80",
    discount: 12,
  },
  {
    id: "4",
    name: "Detergent Powder (25kg)",
    category: "Home & Living",
    price: 2800,
    bulkPrice: 2500,
    minOrder: 30,
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=900&q=80",
    discount: 20,
  },
  {
    id: "5",
    name: "Sugar (50kg Bag)",
    category: "Groceries",
    price: 6500,
    bulkPrice: 6100,
    minOrder: 10,
    image: "https://images.unsplash.com/photo-1587735243574-7c28a5c525e5?w=900&q=80",
    discount: 8,
  },
  {
    id: "6",
    name: "Wheat Flour (50kg)",
    category: "Groceries",
    price: 4800,
    bulkPrice: 4500,
    minOrder: 20,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80",
    discount: 15,
  },
  {
    id: "7",
    name: "Tissue Paper (Pack of 100)",
    category: "Home & Living",
    price: 1800,
    bulkPrice: 1600,
    minOrder: 50,
    image: "https://images.unsplash.com/photo-1584736286279-4af932d3e4d1?w=900&q=80",
    discount: 18,
  },
  {
    id: "8",
    name: "Hand Sanitizer (5L)",
    category: "Health & Beauty",
    price: 3500,
    bulkPrice: 3200,
    minOrder: 25,
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=900&q=80",
    discount: 12,
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

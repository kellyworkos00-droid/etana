import type { Product } from "@/lib/products";
import { products as fallbackProducts } from "@/lib/products";
import { dbPool } from "@/lib/server/db";

type ProductRow = {
  id: number;
  name: string;
  category: Product["category"];
  price: number;
  bulk_price: number;
  min_order: number;
  image: string;
  discount: number;
};

function mapRow(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price),
    bulkPrice: Number(row.bulk_price),
    minOrder: row.min_order,
    image: row.image,
    discount: row.discount,
  };
}

export async function getProductsFromDb(): Promise<Product[]> {
  if (!dbPool) {
    return fallbackProducts;
  }

  try {
    const result = await dbPool.query(
      `
      SELECT id, name, category, price, bulk_price, min_order, image, discount
      FROM products
      ORDER BY id ASC
      `
    );

    const rows = result.rows as ProductRow[];

    if (rows.length === 0) {
      return fallbackProducts;
    }

    return rows.map(mapRow);
  } catch {
    return fallbackProducts;
  }
}

export async function getProductByIdFromDb(id: string): Promise<Product | undefined> {
  if (!dbPool) {
    return fallbackProducts.find((product) => product.id === id);
  }

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return fallbackProducts.find((product) => product.id === id);
  }

  try {
    const result = await dbPool.query(
      `
      SELECT id, name, category, price, bulk_price, min_order, image, discount
      FROM products
      WHERE id = $1
      LIMIT 1
      `,
      [numericId]
    );

    const rows = result.rows as ProductRow[];

    if (!rows[0]) {
      return fallbackProducts.find((product) => product.id === id);
    }

    return mapRow(rows[0]);
  } catch {
    return fallbackProducts.find((product) => product.id === id);
  }
}

import { z } from "zod";

export const ShopProductSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  category_name: z.string(),
  category_id: z.string(),
  sub_category_name: z.string(),
  sub_category_id: z.string(),
  price: z.number(),
  available_stock: z.number(),
  is_active: z.boolean(),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
});

export const ShopProductsResponseSchema = z.object({
  data: z.array(ShopProductSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type ShopProduct = z.infer<typeof ShopProductSchema>;
export type ShopProductsResponse = z.infer<typeof ShopProductsResponseSchema>;

export type CatalogProduct = {
  product_id: string;
  product_name: string;
  category_name: string;
  category_id: string;
  sub_category_name: string;
  sub_category_id: string;
  brand: string;
  unit: string;
};

const mockShopProducts: ShopProduct[] = [
  { product_id: "1", product_name: "Full Cream Milk 1L", category_name: "Dairy", category_id: "1", sub_category_name: "Milk", sub_category_id: "1-1", price: 25.99, available_stock: 150, is_active: true, brand: "Juhayna", unit: "Piece" },
  { product_id: "2", product_name: "Labneh Spreadable 500g", category_name: "Dairy", category_id: "1", sub_category_name: "Cheese", sub_category_id: "1-2", price: 18.50, available_stock: 80, is_active: true, brand: "Panda", unit: "Pack" },
  { product_id: "3", product_name: "Egyptian White Rice 2kg", category_name: "Grains", category_id: "2", sub_category_name: "Rice", sub_category_id: "2-1", price: 32.00, available_stock: 0, is_active: false, brand: "Abu Kass", unit: "Bag" },
  { product_id: "4", product_name: "Sunflower Oil 1.5L", category_name: "Oils", category_id: "6", sub_category_name: "Cooking Oil", sub_category_id: "6-1", price: 45.00, available_stock: 60, is_active: true, brand: "Hayat", unit: "Bottle" },
  { product_id: "5", product_name: "Pita Bread 8 Pieces", category_name: "Bakery", category_id: "7", sub_category_name: "Bread", sub_category_id: "7-1", price: 8.50, available_stock: 40, is_active: true, brand: "Americana", unit: "Pack" },
  { product_id: "6", product_name: "Tomato Paste 135g", category_name: "Canned Goods", category_id: "8", sub_category_name: "Paste", sub_category_id: "8-1", price: 6.00, available_stock: 120, is_active: true, brand: "Heinz", unit: "Can" },
  { product_id: "7", product_name: "Chicken Breast 1kg", category_name: "Meat", category_id: "5", sub_category_name: "Poultry", sub_category_id: "5-1", price: 89.00, available_stock: 25, is_active: true, brand: "Koki", unit: "Kg" },
  { product_id: "8", product_name: "Eggs 30 Pieces", category_name: "Dairy", category_id: "1", sub_category_name: "Eggs", sub_category_id: "1-4", price: 75.00, available_stock: 0, is_active: false, brand: "Domty", unit: "Tray" },
  { product_id: "9", product_name: "Cheddar Cheese 400g", category_name: "Dairy", category_id: "1", sub_category_name: "Cheese", sub_category_id: "1-2", price: 55.00, available_stock: 35, is_active: true, brand: "Domty", unit: "Pack" },
  { product_id: "10", product_name: "Pasta Penne 500g", category_name: "Grains", category_id: "2", sub_category_name: "Pasta", sub_category_id: "2-2", price: 12.00, available_stock: 90, is_active: true, brand: "Barilla", unit: "Pack" },
  { product_id: "11", product_name: "Green Tea 25 Bags", category_name: "Beverages", category_id: "3", sub_category_name: "Tea", sub_category_id: "3-3", price: 22.00, available_stock: 70, is_active: true, brand: "Lipton", unit: "Box" },
  { product_id: "12", product_name: "Orange Juice 1L", category_name: "Beverages", category_id: "3", sub_category_name: "Juice", sub_category_id: "3-1", price: 28.00, available_stock: 45, is_active: true, brand: "Minute Maid", unit: "Carton" },
  { product_id: "13", product_name: "Mineral Water 1.5L", category_name: "Beverages", category_id: "3", sub_category_name: "Water", sub_category_id: "3-2", price: 5.00, available_stock: 200, is_active: true, brand: "Baraka", unit: "Bottle" },
  { product_id: "14", product_name: "Potato Chips 160g", category_name: "Snacks", category_id: "4", sub_category_name: "Chips", sub_category_id: "4-1", price: 15.00, available_stock: 0, is_active: false, brand: "Chipsy", unit: "Bag" },
  { product_id: "15", product_name: "Dark Chocolate 100g", category_name: "Snacks", category_id: "4", sub_category_name: "Chocolate", sub_category_id: "4-2", price: 20.00, available_stock: 55, is_active: true, brand: "Cadbury", unit: "Piece" },
  { product_id: "16", product_name: "Yogurt Plain 170g", category_name: "Dairy", category_id: "1", sub_category_name: "Yogurt", sub_category_id: "1-3", price: 9.00, available_stock: 65, is_active: true, brand: "Juhayna", unit: "Cup" },
  { product_id: "17", product_name: "Tuna Can 185g", category_name: "Canned Goods", category_id: "8", sub_category_name: "Fish", sub_category_id: "8-2", price: 18.00, available_stock: 40, is_active: true, brand: "California Garden", unit: "Can" },
  { product_id: "18", product_name: "Honey 500g", category_name: "Spreads", category_id: "10", sub_category_name: "Honey", sub_category_id: "10-1", price: 65.00, available_stock: 20, is_active: true, brand: "Bee Natural", unit: "Jar" },
  { product_id: "19", product_name: "Ketchup 500ml", category_name: "Condiments", category_id: "11", sub_category_name: "Sauces", sub_category_id: "11-1", price: 22.00, available_stock: 50, is_active: true, brand: "Heinz", unit: "Bottle" },
  { product_id: "20", product_name: "Sugar 1kg", category_name: "Baking", category_id: "12", sub_category_name: "Sugar", sub_category_id: "12-1", price: 18.00, available_stock: 100, is_active: true, brand: "Delta", unit: "Bag" },
];

const catalogProducts: CatalogProduct[] = [
  { product_id: "101", product_name: "Full Cream Milk 1L", category_name: "Dairy", category_id: "1", sub_category_name: "Milk", sub_category_id: "1-1", brand: "Juhayna", unit: "Piece" },
  { product_id: "102", product_name: "Labneh Spreadable 500g", category_name: "Dairy", category_id: "1", sub_category_name: "Cheese", sub_category_id: "1-2", brand: "Panda", unit: "Pack" },
  { product_id: "103", product_name: "Egyptian White Rice 2kg", category_name: "Grains", category_id: "2", sub_category_name: "Rice", sub_category_id: "2-1", brand: "Abu Kass", unit: "Bag" },
  { product_id: "104", product_name: "Sunflower Oil 1.5L", category_name: "Oils", category_id: "6", sub_category_name: "Cooking Oil", sub_category_id: "6-1", brand: "Hayat", unit: "Bottle" },
  { product_id: "105", product_name: "Pita Bread 8 Pieces", category_name: "Bakery", category_id: "7", sub_category_name: "Bread", sub_category_id: "7-1", brand: "Americana", unit: "Pack" },
  { product_id: "106", product_name: "Instant Coffee 200g", category_name: "Beverages", category_id: "3", sub_category_name: "Coffee", sub_category_id: "3-4", brand: "Nescafe", unit: "Jar" },
  { product_id: "107", product_name: "Biscuits 200g", category_name: "Snacks", category_id: "4", sub_category_name: "Biscuits", sub_category_id: "4-3", brand: "LU", unit: "Pack" },
  { product_id: "108", product_name: "Frozen Peas 400g", category_name: "Frozen", category_id: "9", sub_category_name: "Vegetables", sub_category_id: "9-1", brand: "Americana", unit: "Bag" },
  { product_id: "109", product_name: "Mayonnaise 400g", category_name: "Condiments", category_id: "11", sub_category_name: "Sauces", sub_category_id: "11-1", brand: "Hellmann's", unit: "Jar" },
  { product_id: "110", product_name: "Salt 750g", category_name: "Baking", category_id: "12", sub_category_name: "Salt", sub_category_id: "12-2", brand: "Ras El Bar", unit: "Pack" },
  { product_id: "111", product_name: "Tomato Paste 135g", category_name: "Canned Goods", category_id: "8", sub_category_name: "Paste", sub_category_id: "8-1", brand: "Heinz", unit: "Can" },
  { product_id: "112", product_name: "Chicken Breast 1kg", category_name: "Meat", category_id: "5", sub_category_name: "Poultry", sub_category_id: "5-1", brand: "Koki", unit: "Kg" },
  { product_id: "113", product_name: "Dark Chocolate 100g", category_name: "Snacks", category_id: "4", sub_category_name: "Chocolate", sub_category_id: "4-2", brand: "Cadbury", unit: "Piece" },
  { product_id: "114", product_name: "Honey 500g", category_name: "Spreads", category_id: "10", sub_category_name: "Honey", sub_category_id: "10-1", brand: "Bee Natural", unit: "Jar" },
  { product_id: "115", product_name: "Mineral Water 1.5L", category_name: "Beverages", category_id: "3", sub_category_name: "Water", sub_category_id: "3-2", brand: "Baraka", unit: "Bottle" },
];

export const shopService = {
  async getShopProducts(shopId: string, page: number = 1): Promise<ShopProductsResponse> {
    // TODO: replace with real API call
    // const res = await http.get(`/shop/${shopId}/products?page=${page}`);
    // return res.data;

    const startIndex = (page - 1) * 25;
    const raw = {
      data: mockShopProducts.slice(startIndex, startIndex + 25),
      total: mockShopProducts.length,
      page,
      limit: 25,
    };

    const parsed = ShopProductsResponseSchema.safeParse(raw);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    return parsed.data;
  },

  async getAvailableProducts(shopId: string, search: string = "", categoryId: string = ""): Promise<CatalogProduct[]> {
    // TODO: replace with real API call
    // const res = await http.get(`/products?search=${search}&category=${categoryId}`);
    // return res.data.filter(p => !existingIds.includes(p.id));

    const existingIds = mockShopProducts.map(p => p.product_id);
    return catalogProducts
      .filter(p => !existingIds.includes(p.product_id))
      .filter(p => !search || p.product_name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => !categoryId || p.category_id === categoryId);
  },

  async addShopProduct(shopId: string, payload: {
    product_id: string;
    price: number;
    available_stock: number;
    low_stock_threshold: number;
  }): Promise<ShopProduct> {
    // TODO: replace with real API call
    // const res = await http.post(`/shop/${shopId}/products`, payload);
    // return res.data;

    const existing = mockShopProducts.find(p => p.product_id === payload.product_id);
    if (existing) {
      throw new Error("This product is already in your inventory. You can update its price and stock from the inventory table.");
    }

    const product = catalogProducts.find(p => p.product_id === payload.product_id);
    if (!product) throw new Error("Product not found");

    const newShopProduct: ShopProduct = {
      ...product,
      price: payload.price,
      available_stock: payload.available_stock,
      is_active: true,
    };

    mockShopProducts.push(newShopProduct);
    return newShopProduct;
  },

  async updateShopProduct(shopId: string, productId: string, payload: { price?: number; available_stock?: number }): Promise<ShopProduct> {
    // TODO: replace with real API call
    // const res = await http.put(`/shop/${shopId}/products/${productId}`, payload);
    // return res.data;

    const index = mockShopProducts.findIndex(p => p.product_id === productId);
    if (index !== -1) {
      mockShopProducts[index] = { ...mockShopProducts[index], ...payload };
    }
    return mockShopProducts[index];
  },

  async toggleShopProduct(shopId: string, productId: string, is_active: boolean): Promise<ShopProduct> {
    // TODO: replace with real API call
    // const res = await http.put(`/shop/${shopId}/products/${productId}`, { is_active });
    // return res.data;

    const index = mockShopProducts.findIndex(p => p.product_id === productId);
    if (index !== -1) {
      mockShopProducts[index] = { ...mockShopProducts[index], is_active };
    }
    return mockShopProducts[index];
  },
};
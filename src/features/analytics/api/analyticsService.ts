import http from "@/shared/http";

export interface DailyRevenue {
  day: string;
  total_orders: number;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  total: number;
}

export interface BestSellingProduct {
  shop_product_id: number;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

export interface LowStockProduct {
  shop_product_id: number;
  product_name: string;
  available_stock: number;
  low_stock_threshold?: number;
  is_available?: boolean;
}

export interface CustomerStats {
  unique_customers: number;
  repeat_customers: number;
}

export interface ShopDashboard {
  daily_revenue: DailyRevenue[];
  orders_by_status: OrdersByStatus[];
  best_selling_products: BestSellingProduct[];
  low_stock_products: LowStockProduct[];
  customer_stats: CustomerStats;
}

function readList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { items?: T[] }).items)) {
    return (value as { items: T[] }).items;
  }
  return [];
}

export const analyticsService = {
  async getShopDashboard(): Promise<ShopDashboard> {
    const res = await http.get("/analytics/shop");
    const d = res.data ?? {};
    return {
      daily_revenue: readList<DailyRevenue>(d.daily_revenue),
      orders_by_status: readList<OrdersByStatus>(d.orders_by_status),
      best_selling_products: readList<BestSellingProduct>(d.best_selling_products),
      low_stock_products: readList<LowStockProduct>(d.low_stock_products),
      customer_stats: d.customer_stats ?? { unique_customers: 0, repeat_customers: 0 },
    };
  },

  async getAdminDashboard(): Promise<AdminDashboard> {
    const res = await http.get("/analytics/admin");
    const d = res.data ?? {};
    return {
      platform_overview: d.platform_overview ?? {
        total_orders: 0,
        total_revenue: 0,
        orders_this_month: 0,
        revenue_this_month: 0,
      },
      orders_by_status: readList<OrdersByStatus>(d.orders_by_status),
      daily_orders: readList<DailyOrders>(d.daily_orders),
      top_shops: readList<TopShop>(d.top_shops),
      top_products: readList<TopProduct>(d.top_products),
      orders_by_area: readList<OrdersByArea>(d.orders_by_area),
      delivery_stats: d.delivery_stats ?? {
        active_drivers: 0,
        total_deliveries: 0,
        avg_orders_per_driver: 0,
      },
      shops_by_area: readList<ShopsByArea>(d.shops_by_area),
    };
  },
};

/* ---------- Admin dashboard types ---------- */
export interface PlatformOverview {
  total_orders: number;
  total_revenue: number;
  orders_this_month: number;
  revenue_this_month: number;
}

export interface DailyOrders {
  day: string;
  total_orders: number;
  revenue: number;
}

export interface TopShop {
  shop_id: number;
  shop_name: string;
  total_orders: number;
  total_revenue: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

export interface OrdersByArea {
  area_id: number;
  area_name: string;
  city_name: string;
  total_orders: number;
  total_revenue: number;
}

export interface DeliveryStats {
  active_drivers: number;
  total_deliveries: number;
  avg_orders_per_driver: number;
}

export interface ShopsByArea {
  area_id: number;
  area_name: string;
  city_name: string;
  total_shops: number;
  active_shops: number;
}

export interface AdminDashboard {
  platform_overview: PlatformOverview;
  orders_by_status: OrdersByStatus[];
  daily_orders: DailyOrders[];
  top_shops: TopShop[];
  top_products: TopProduct[];
  orders_by_area: OrdersByArea[];
  delivery_stats: DeliveryStats;
  shops_by_area: ShopsByArea[];
}
export type RevenueData = {
  month: string;
  value: number;
};

export type TopProduct = {
  name: string;
  category: string;
  sales: number;
  revenue: string;
  growth: number;
};

export type StorePerformance = {
  name: string;
  orders: number;
  revenue: string;
  growth: number;
  percent: number;
};

export type OrderStatusData = {
  label: string;
  value: number;
  percent: number;
  color: string;
};

export type ReportSummary = {
  total_revenue: string;
  total_orders: number;
  new_customers: number;
  avg_order_value: string;
  revenue_growth: number;
  orders_growth: number;
  customers_growth: number;
  avg_order_growth: number;
};

const mockSummary: ReportSummary = {
  total_revenue: "EGP 89,450",
  total_orders: 2317,
  new_customers: 58,
  avg_order_value: "EGP 274.54",
  revenue_growth: 18.6,
  orders_growth: 15.7,
  customers_growth: 8.3,
  avg_order_growth: -4.2,
};

const mockRevenueData: RevenueData[] = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 22 },
  { month: "Mar", value: 19 },
  { month: "Apr", value: 25 },
  { month: "May", value: 23 },
  { month: "Jun", value: 28 },
  { month: "Jul", value: 24 },
  { month: "Aug", value: 30 },
  { month: "Sep", value: 27 },
  { month: "Oct", value: 32 },
  { month: "Nov", value: 29 },
  { month: "Dec", value: 35 },
];

const mockTopProducts: TopProduct[] = [
  { name: "Full Cream Milk 1L", category: "Dairy", sales: 1248, revenue: "EGP 32,437", growth: 12.4 },
  { name: "Basmati Rice 5kg", category: "Grains", sales: 986, revenue: "EGP 29,580", growth: 8.2 },
  { name: "Sunflower Oil 1.5L", category: "Oils", sales: 874, revenue: "EGP 39,330", growth: -3.1 },
  { name: "Eggs 30 Pieces", category: "Dairy", sales: 762, revenue: "EGP 57,150", growth: 15.7 },
  { name: "Mineral Water 1.5L", category: "Beverages", sales: 654, revenue: "EGP 3,270", growth: 5.3 },
];

const mockStorePerformance: StorePerformance[] = [
  { name: "Cairo Store", orders: 542, revenue: "EGP 48,320", growth: 18.5, percent: 85 },
  { name: "Alexandria Store", orders: 389, revenue: "EGP 35,210", growth: 12.3, percent: 68 },
  { name: "Giza Store", orders: 312, revenue: "EGP 28,940", growth: 9.7, percent: 55 },
  { name: "Mansoura Store", orders: 198, revenue: "EGP 17,650", growth: -2.4, percent: 35 },
  { name: "Aswan Store", orders: 124, revenue: "EGP 11,280", growth: 6.1, percent: 22 },
];

const mockOrderStatus: OrderStatusData[] = [
  { label: "Delivered", value: 1248, percent: 54, color: "#16A34A" },
  { label: "Processing", value: 542, percent: 23, color: "#2563EB" },
  { label: "Out for Delivery", value: 312, percent: 13, color: "#7E22CE" },
  { label: "Pending", value: 198, percent: 9, color: "#D97706" },
  { label: "Cancelled", value: 17, percent: 1, color: "#DC2626" },
];

export const reportService = {
  async getSummary(): Promise<ReportSummary> {
    // TODO: replace with real API call
    // const res = await http.get('/reports/summary');
    // return res.data;
    return mockSummary;
  },

  async getRevenueData(): Promise<RevenueData[]> {
    // TODO: replace with real API call
    // const res = await http.get('/reports/revenue');
    // return res.data;
    return mockRevenueData;
  },

  async getTopProducts(): Promise<TopProduct[]> {
    // TODO: replace with real API call
    // const res = await http.get('/reports/top-products');
    // return res.data;
    return mockTopProducts;
  },

  async getStorePerformance(): Promise<StorePerformance[]> {
    // TODO: replace with real API call
    // const res = await http.get('/reports/store-performance');
    // return res.data;
    return mockStorePerformance;
  },

  async getOrderStatus(): Promise<OrderStatusData[]> {
    // TODO: replace with real API call
    // const res = await http.get('/reports/order-status');
    // return res.data;
    return mockOrderStatus;
  },
};
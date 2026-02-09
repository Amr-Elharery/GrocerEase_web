export type KpiStat = {
  label: string;
  value: string;
  delta: string;
  note: string;
};

export type RevenuePoint = {
  day: string;
  revenue: number;
  orders: number;
};

export type CategoryShare = {
  category: string;
  share: number;
};

export type OrderStatus =
  | 'delivered'
  | 'preparing'
  | 'out-for-delivery'
  | 'canceled';

export type OrderRow = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: OrderStatus;
  time: string;
};

export type StoreInfo = {
  name: string;
  location: string;
  manager: string;
  updatedAt: string;
};

export type NavItem = {
  label: string;
  description: string;
};

export const storeInfo: StoreInfo = {
  name: 'Cairo Central',
  location: 'Nasr City, Cairo',
  manager: 'Mariam Hassan',
  updatedAt: '10:45 AM',
};

export const storeNav: NavItem[] = [
  { label: 'Overview', description: 'KPI pulse & revenue' },
  { label: 'Orders', description: 'Fulfillment queue' },
  { label: 'Inventory', description: 'Stock health' },
  { label: 'Promotions', description: 'Active campaigns' },
  { label: 'Staff', description: 'Shifts & coverage' },
];

export const kpiStats: KpiStat[] = [
  {
    label: 'Net Revenue',
    value: '$128,420',
    delta: '+12.4%',
    note: 'vs last 7 days',
  },
  {
    label: 'Orders Fulfilled',
    value: '2,942',
    delta: '+7.8%',
    note: 'fulfillment rate 98.6%',
  },
  {
    label: 'Low Stock Alerts',
    value: '17',
    delta: '-5',
    note: 'critical SKUs',
  },
  {
    label: 'Active Promotions',
    value: '6',
    delta: '+2',
    note: 'campaigns running',
  },
];

export const revenueSeries: RevenuePoint[] = [
  { day: 'Mon', revenue: 12600, orders: 380 },
  { day: 'Tue', revenue: 13950, orders: 412 },
  { day: 'Wed', revenue: 11840, orders: 365 },
  { day: 'Thu', revenue: 15420, orders: 442 },
  { day: 'Fri', revenue: 17260, orders: 498 },
  { day: 'Sat', revenue: 18640, orders: 532 },
  { day: 'Sun', revenue: 16340, orders: 491 },
];

export const categoryShare: CategoryShare[] = [
  { category: 'Produce', share: 38 },
  { category: 'Dairy', share: 22 },
  { category: 'Bakery', share: 14 },
  { category: 'Meat', share: 16 },
  { category: 'Pantry', share: 10 },
];

export const recentOrders: OrderRow[] = [
  {
    id: 'GE-10231',
    customer: 'Noura Elsayed',
    items: 18,
    total: '$214.60',
    status: 'delivered',
    time: '10:42 AM',
  },
  {
    id: 'GE-10232',
    customer: 'Omar Youssef',
    items: 7,
    total: '$76.20',
    status: 'out-for-delivery',
    time: '11:05 AM',
  },
  {
    id: 'GE-10233',
    customer: 'Maya Ibrahim',
    items: 12,
    total: '$128.45',
    status: 'preparing',
    time: '11:26 AM',
  },
  {
    id: 'GE-10234',
    customer: 'Tarek Adel',
    items: 5,
    total: '$42.90',
    status: 'canceled',
    time: '11:41 AM',
  },
  {
    id: 'GE-10235',
    customer: 'Sara Hafez',
    items: 21,
    total: '$248.30',
    status: 'delivered',
    time: '12:02 PM',
  },
];

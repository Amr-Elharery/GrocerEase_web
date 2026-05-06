import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  customer_name: z.string(),
  store_name: z.string(),
  items_count: z.number(),
  total_price: z.number(),
  status: z.enum(["pending", "processing", "out_for_delivery", "delivered", "cancelled"]),
  payment_method: z.enum(["cash", "card"]),
  created_at: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

const mockOrders: Order[] = [
  { id: "1", order_id: "ORD-8451", customer_name: "Omar Ahmed", store_name: "Cairo Store", items_count: 8, total_price: 450.00, status: "pending", payment_method: "cash", created_at: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: "2", order_id: "ORD-8450", customer_name: "Sara Mohamed", store_name: "Alexandria Store", items_count: 5, total_price: 320.50, status: "processing", payment_method: "card", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "3", order_id: "ORD-8449", customer_name: "Ali Hassan", store_name: "Giza Store", items_count: 3, total_price: 210.00, status: "delivered", payment_method: "cash", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "4", order_id: "ORD-8448", customer_name: "Nour Magdy", store_name: "Cairo Store", items_count: 10, total_price: 780.00, status: "cancelled", payment_method: "card", created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: "5", order_id: "ORD-8447", customer_name: "Ahmed Tarek", store_name: "Mansoura Store", items_count: 7, total_price: 610.00, status: "delivered", payment_method: "cash", created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: "6", order_id: "ORD-8446", customer_name: "Mona Khaled", store_name: "Alexandria Store", items_count: 4, total_price: 195.00, status: "out_for_delivery", payment_method: "card", created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "7", order_id: "ORD-8445", customer_name: "Kareem Samir", store_name: "Giza Store", items_count: 6, total_price: 380.00, status: "processing", payment_method: "cash", created_at: new Date(Date.now() - 15 * 3600000).toISOString() },
  { id: "8", order_id: "ORD-8444", customer_name: "Layla Omar", store_name: "Cairo Store", items_count: 2, total_price: 95.00, status: "pending", payment_method: "card", created_at: new Date(Date.now() - 18 * 3600000).toISOString() },
  { id: "9", order_id: "ORD-8443", customer_name: "Hassan Ali", store_name: "Aswan Store", items_count: 9, total_price: 540.00, status: "delivered", payment_method: "cash", created_at: new Date(Date.now() - 20 * 3600000).toISOString() },
  { id: "10", order_id: "ORD-8442", customer_name: "Dina Fathy", store_name: "Mansoura Store", items_count: 1, total_price: 45.00, status: "cancelled", payment_method: "card", created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
];

export const orderService = {
  async getOrders(): Promise<Order[]> {
    // TODO: replace with real API call
    // const res = await http.get('/orders');
    // return res.data;
    return [...mockOrders].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
};
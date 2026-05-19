import { z } from "zod";

export const StoreOrderSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  customer_name: z.string(),
  items_count: z.number(),
  total: z.number(),
  status: z.enum(["pending", "assigned", "delivered", "cancelled"]),
  created_at: z.string(),
});

export type StoreOrder = z.infer<typeof StoreOrderSchema>;

const mockStoreOrders: StoreOrder[] = [
  { id: "1", order_id: "ORD-8451", customer_name: "Omar Ahmed", items_count: 8, total: 450.00, status: "pending", created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: "2", order_id: "ORD-8450", customer_name: "Sara Mohamed", items_count: 5, total: 320.50, status: "assigned", created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "3", order_id: "ORD-8449", customer_name: "Ali Hassan", items_count: 3, total: 210.00, status: "delivered", created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: "4", order_id: "ORD-8448", customer_name: "Nour Magdy", items_count: 10, total: 780.00, status: "pending", created_at: new Date(Date.now() - 1 * 60000).toISOString() },
  { id: "5", order_id: "ORD-8447", customer_name: "Ahmed Tarek", items_count: 7, total: 610.00, status: "assigned", created_at: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: "6", order_id: "ORD-8446", customer_name: "Mona Khaled", items_count: 4, total: 195.00, status: "delivered", created_at: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: "7", order_id: "ORD-8445", customer_name: "Kareem Samir", items_count: 6, total: 380.00, status: "pending", created_at: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: "8", order_id: "ORD-8444", customer_name: "Layla Omar", items_count: 2, total: 95.00, status: "cancelled", created_at: new Date(Date.now() - 30 * 60000).toISOString() },
];

export const storeOrderService = {
async getOrders(_shopId: string): Promise<StoreOrder[]> {
    // TODO: replace with real API call
    // const res = await http.get(`/shop/${shopId}/orders`);
    // return res.data;

    // TODO: upgrade to WebSocket for real-time updates
    // const ws = new WebSocket(`wss://api/shop/${shopId}/orders/live`);

    return [...mockStoreOrders].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

async updateOrderStatus(_shopId: string, orderId: string, status: StoreOrder["status"]): Promise<StoreOrder> {    // TODO: replace with real API call
    // const res = await http.patch(`/shop/${shopId}/orders/${orderId}`, { status });
    // return res.data;

    const index = mockStoreOrders.findIndex(o => o.id === orderId);
    if (index !== -1) mockStoreOrders[index].status = status;
    return mockStoreOrders[index];
  },
};
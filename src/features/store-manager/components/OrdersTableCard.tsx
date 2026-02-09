import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type OrderStatus,
  recentOrders,
} from '@/features/store-manager/data/storeManagerDashboard';

const statusStyles: Record<
  OrderStatus,
  'success' | 'warning' | 'danger' | 'info'
> = {
  delivered: 'success',
  preparing: 'warning',
  'out-for-delivery': 'info',
  canceled: 'danger',
};

export function OrdersTableCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Live fulfillment queue across all lanes.
          </CardDescription>
        </div>
        <Button variant="outline">View All</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-foreground">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusStyles[order.status]}
                    className="capitalize"
                  >
                    {order.status.replaceAll('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

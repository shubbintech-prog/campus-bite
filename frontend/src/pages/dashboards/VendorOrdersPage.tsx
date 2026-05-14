import { useVendorOrders, useUpdateOrderStatus } from "@/hooks/use-order-api";
import { toast } from "sonner";

const statusOptions = ["received", "preparing", "ready", "completed"] as const;

export default function VendorOrdersPage() {
  const { data: orders, isLoading } = useVendorOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatus({ orderId, status }, {
      onSuccess: () => toast.success(`Order #${orderId} set to ${status}`),
    });
  };

  if (isLoading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Incoming Orders</h1>

      <div className="space-y-3">
        {orders?.map((order) => (
          <div key={order.id} className="rounded-xl bg-card card-shadow p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-display font-semibold text-sm">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.studentName}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as Order["status"])}
                className="text-xs px-2 py-1 rounded-lg border border-border bg-background outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-muted-foreground py-0.5">
                <span>{item.quantity}x {item.name}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-display font-bold text-sm mt-2 pt-2 border-t border-border">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

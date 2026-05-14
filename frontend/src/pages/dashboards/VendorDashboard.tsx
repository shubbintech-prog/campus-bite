import { ShoppingBag, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react";
import DashboardStatCard from "@/components/cards/DashboardStatCard";
import OrderCard from "@/components/cards/OrderCard";
import { useUserOrders, useUpdateOrderStatus } from "@/hooks/use-order-api";

export default function VendorDashboard() {
  const { data: orders, isLoading, refetch } = useUserOrders();
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const ordersArray = Array.isArray(orders) ? orders : [];
  
  const stats = {
    today: ordersArray.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length,
    revenue: ordersArray
      .filter(o => o.order_status === "completed")
      .reduce((sum, o) => sum + parseFloat(o.total_price), 0),
    pending: ordersArray.filter(o => ["pending", "preparing"].includes(o.order_status)).length,
    completed: ordersArray.filter(o => o.order_status === "completed").length,
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Vendor Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard title="Orders Today" value={stats.today} icon={ShoppingBag} />
        <DashboardStatCard title="Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon={DollarSign} />
        <DashboardStatCard title="Pending" value={stats.pending} icon={Clock} />
        <DashboardStatCard title="Completed" value={stats.completed} icon={CheckCircle} />
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-4">
        {ordersArray.length > 0 ? (
          ordersArray.map((o) => (
            <div key={o.id} className="space-y-2">
              <OrderCard order={o} showStudent />
              {o.order_status !== "completed" && o.order_status !== "cancelled" && (
                <div className="flex gap-2">
                  {o.order_status === "pending" && (
                    <button
                      onClick={() => handleStatusUpdate(o.id, "preparing")}
                      className="text-xs bg-warning/10 text-warning hover:bg-warning/20 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Accept & Prepare
                    </button>
                  )}
                  {o.order_status === "preparing" && (
                    <button
                      onClick={() => handleStatusUpdate(o.id, "ready")}
                      className="text-xs bg-success/10 text-success hover:bg-success/20 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {o.order_status === "ready" && (
                    <button
                      onClick={() => handleStatusUpdate(o.id, "completed")}
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-card rounded-xl border border-dashed">
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

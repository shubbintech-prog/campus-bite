import { Link } from "react-router-dom";
import OrderCard from "@/components/cards/OrderCard";
import { useUserOrders } from "@/hooks/use-order-api";
import { Loader2 } from "lucide-react";

export default function OrderHistoryPage() {
  const { data: orders, isLoading } = useUserOrders();

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 max-w-2xl animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <Link key={order.id} to={`/orders/${order.id}/tracking`}>
              <OrderCard order={order} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <Link to="/vendors" className="text-primary hover:underline mt-2 inline-block font-medium">Start ordering</Link>
        </div>
      )}
    </div>
  );
}

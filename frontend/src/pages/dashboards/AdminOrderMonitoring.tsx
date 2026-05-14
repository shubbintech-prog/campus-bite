import { useState } from "react";
import OrderCard from "@/components/cards/OrderCard";
import { useAllOrders } from "@/hooks/use-order-api";

const statusFilters = ["All", "pending", "accepted", "preparing", "ready", "completed", "cancelled"];

export default function AdminOrderMonitoring() {
  const { data: allOrders, isLoading, error } = useAllOrders();
  const [filter, setFilter] = useState("All");

  if (isLoading) return <div className="p-10 text-center">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 p-10">Error loading orders.</div>;

  const filtered = filter === "All" ? allOrders : allOrders?.filter((o: any) => o.order_status === filter);

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Order Monitoring</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered?.map((o: any) => (
          <OrderCard key={o.id} order={o} showStudent />
        ))}
      </div>
    </div>
  );
}

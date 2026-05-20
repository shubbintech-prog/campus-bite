import { Link } from "react-router-dom";
import { ShoppingBag, Clock, Star, ArrowRight, Loader2, Store } from "lucide-react";
import DashboardStatCard from "@/components/cards/DashboardStatCard";
import OrderCard from "@/components/cards/OrderCard";
import FoodCard from "@/components/cards/FoodCard";
import WalletCard from "@/components/wallet/WalletCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserOrders } from "@/hooks/use-order-api";
import { useMenuItems } from "@/hooks/use-vendor-api";
import { useCartStore } from "@/store/useCartStore";
import { getImageUrl } from "@/lib/utils";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { data: orders, isLoading: loadingOrders } = useUserOrders();
  const { data: recommendations, isLoading: loadingRecs } = useMenuItems("");
  const { addItem } = useCartStore();

  if (loadingOrders || loadingRecs) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const pendingOrders = orders?.filter((o: any) => o.order_status === 'pending' || o.order_status === 'preparing').length || 0;
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-6">
        Welcome back, <span className="text-gradient">{firstName}</span>
      </h1>

      <Link to="/dashboard/apply-vendor" className="block mb-8 group">
        <div className="bg-gradient-to-r from-primary/5 via-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-primary/10 transition-all card-shadow relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-primary mb-1">Become a Campus Bites Seller</h3>
              <p className="text-sm text-muted-foreground">Launch your virtual kitchen and reach thousands of hungry students on campus daily.</p>
            </div>
          </div>
          <div className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-sm group-hover:scale-105 transition-transform shrink-0">
            Apply Now
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <WalletCard />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <DashboardStatCard title="Total Orders" value={orders?.length || 0} icon={ShoppingBag} />
          <DashboardStatCard title="Pending" value={pendingOrders} icon={Clock} trend={pendingOrders > 0 ? "In progress" : "None pending"} trendUp={pendingOrders > 0} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {orders && orders.length > 0 ? (
            orders.slice(0, 2).map((o: any) => (
              <Link key={o.id} to={`/orders/${o.id}/tracking`}>
                <OrderCard order={o} />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center bg-card rounded-xl border border-dashed border-border text-muted-foreground text-sm">
              No recent orders found.
            </div>
          )}
        </div>
      </div>

      {/* Recommended */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations?.slice(0, 4).map((item: any) => (
            <FoodCard 
              key={item.id} 
              item={{
                id: item.id,
                name: item.name,
                price: parseFloat(item.price),
                image_url: item.image_url || "",
                category: item.category,
                description: item.description,
                vendorId: "1" // Default for mock recs
              }} 
              onAdd={(cardItem) => {
                addItem({
                  id: String(cardItem.id),
                  name: cardItem.name,
                  price: cardItem.price,
                  image: getImageUrl(cardItem.image_url),
                  vendorId: "1"
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

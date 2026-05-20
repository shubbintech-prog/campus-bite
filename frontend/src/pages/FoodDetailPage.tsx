import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useVendors } from "@/hooks/use-vendor-api"; 
import { useCartStore } from "@/store/useCartStore";
import { getImageUrl } from "@/lib/utils";

export default function FoodDetailPage() {
  const { foodId } = useParams<{ foodId: string }>();
  const { data: vendors } = useVendors();
  const { addItem } = useCartStore();
  
  // Find item across all vendors for now, or add useFoodItem later
  const item = vendors?.flatMap(v => v.menu_items || []).find(f => f.id === Number(foodId));
  const vendor = vendors?.find(v => (v.menu_items || []).some((f: any) => f.id === Number(foodId)));
  
  const [qty, setQty] = useState(1);

  if (!item) return <div className="p-10 text-center">Loading product...</div>;
  return (
    <div className="animate-fade-in">
      <div className="md:container md:py-8">
        <div className="md:grid md:grid-cols-2 md:gap-8 max-w-4xl mx-auto">
          <div className="aspect-square md:rounded-2xl overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:p-0 md:py-4">
            <Link to="/vendors" className="inline-flex items-center gap-1 text-muted-foreground text-xs mb-4 hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{item.category}</span>
            <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold">{item.name}</h1>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            <p className="mt-6 font-display text-3xl font-bold text-foreground">₦{item.price.toLocaleString()}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-muted rounded-xl px-2 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  if (!item || !vendor) return;
                  for (let i = 0; i < qty; i++) {
                    addItem({
                      id: String(item.id),
                      name: item.name,
                      price: item.price,
                      image: getImageUrl(item.image_url || item.image),
                      vendorId: String(vendor.id || vendor._id)
                    });
                  }
                  toast.success(`${qty}x ${item.name} added to cart!`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-accent-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₦{(item.price * qty).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

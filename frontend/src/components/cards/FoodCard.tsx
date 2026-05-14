import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

interface FoodCardProps {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all animate-scale-in">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={item.image_url || "/placeholder-food.jpg"} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold">
          <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
          4.5
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-bold text-base mb-1">{item.name}</h3>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 h-8">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">₦{Number(item.price).toLocaleString()}</span>
          <button 
            onClick={() => {
              if (onAdd) onAdd(item);
              toast.success(`${item.name} added to cart!`);
            }}
            className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

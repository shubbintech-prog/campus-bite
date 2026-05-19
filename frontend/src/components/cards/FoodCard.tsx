import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

interface FoodCardProps {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}

const FOOD_FALLBACKS = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80",
];

const getDeterministicFoodImage = (name: string = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FOOD_FALLBACKS.length;
  return FOOD_FALLBACKS[index];
};

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  const isPlaceholder = !item.image_url || 
                        item.image_url === "" || 
                        item.image_url.includes("placeholder");
  const displayImage = isPlaceholder ? getDeterministicFoodImage(item.name) : item.image_url;

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all animate-scale-in">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={displayImage} 
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

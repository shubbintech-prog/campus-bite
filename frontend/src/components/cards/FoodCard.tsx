import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

interface FoodCardProps {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}

const matchFoodImageByName = (name: string = "") => {
  const normalized = name.toLowerCase();
  
  // 1. Amala / Ewedu / Nigerian Swallow
  if (normalized.includes("amala") || normalized.includes("ewedu") || normalized.includes("gbegiri") || normalized.includes("swallow") || normalized.includes("eba") || normalized.includes("okra") || normalized.includes("pounded yam") || normalized.includes("egusi") || normalized.includes("fufu")) {
    return "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=500&q=80"; // Swallow and Nigerian traditional soup
  }

  // 2. Rice / Jollof / Fried Rice
  if (normalized.includes("rice") || normalized.includes("jollof") || normalized.includes("fried rice") || normalized.includes("coconut rice")) {
    return "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80"; // Nigerian Jollof Rice
  }

  // 3. Shawarma / Wraps / Kebab / Burger
  if (normalized.includes("shawarma") || normalized.includes("wrap") || normalized.includes("taco") || normalized.includes("burger") || normalized.includes("kebab")) {
    return "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=500&q=80"; // Gourmet wrap / Shawarma
  }

  // 4. Pizza
  if (normalized.includes("pizza") || normalized.includes("pepperoni") || normalized.includes("margherita")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"; // Premium Pizza
  }

  // 5. Suya / Grills / Chicken / Meat
  if (normalized.includes("suya") || normalized.includes("grill") || normalized.includes("barbecue") || normalized.includes("meat") || normalized.includes("beef") || normalized.includes("chicken") || normalized.includes("wings")) {
    return "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=500&q=80"; // Spicy Grilled Beef / Suya style
  }

  // 6. Coke / Soft Drink / Soda
  if (normalized.includes("coke") || normalized.includes("cola") || normalized.includes("soda") || normalized.includes("pepsi") || normalized.includes("fanta") || normalized.includes("sprite")) {
    return "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"; // Chilled Coke Cola Can
  }

  // 7. Chapman / Cocktail / Mocktail
  if (normalized.includes("chapman") || normalized.includes("cocktail") || normalized.includes("mocktail") || normalized.includes("juice") || normalized.includes("drink")) {
    return "https://images.unsplash.com/photo-1513558111299-67ff2213425f?auto=format&fit=crop&w=500&q=80"; // Chapman cocktail
  }

  // 8. Maltina / Malt / Beer
  if (normalized.includes("malt") || normalized.includes("maltina") || normalized.includes("guinness") || normalized.includes("amstel")) {
    return "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=500&q=80"; // Nourishing Malt Drink
  }

  // 9. Water
  if (normalized.includes("water") || normalized.includes("aquafina") || normalized.includes("eva")) {
    return "https://images.unsplash.com/photo-1548839140-29a742115f08?auto=format&fit=crop&w=500&q=80"; // Clean spring water
  }

  // 10. Snacks / Pastry / Cakes / Pies
  if (normalized.includes("snack") || normalized.includes("pie") || normalized.includes("cake") || normalized.includes("pastry") || normalized.includes("donut") || normalized.includes("chin chin") || normalized.includes("puff puff")) {
    return "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80"; // Glazed donuts / Desserts
  }

  // General Fallback
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"; 
};

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  const isGenericOrDuplicate = !item.image_url || 
                               item.image_url === "" || 
                               item.image_url.includes("placeholder") ||
                               // Clean up the identical duplicates seeded for distinct swallows/drinks
                               (item.name !== "Amala & Ewedu" && item.image_url.includes("photo-1604329760661-e71dc83f8f26")) ||
                               (item.name !== "Coke (50cl)" && item.image_url.includes("photo-1622483767028-3f66f32aef97"));

  const displayImage = isGenericOrDuplicate ? matchFoodImageByName(item.name) : item.image_url;

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

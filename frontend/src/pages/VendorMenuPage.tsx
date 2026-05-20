import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Loader2 } from "lucide-react";
import FoodCard from "@/components/cards/FoodCard";
import CampusMap from "@/components/ui/CampusMap";
import { useVendorDetails, useVendorMenu } from "@/hooks/use-vendor-api";
import { toast } from "sonner";

const categories = ["All", "Nigerian", "Rice", "Swallow", "FastFood", "Snacks", "Grills", "Drinks"];

export default function VendorMenuPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vendor, isLoading: loadingVendor } = useVendorDetails(id || "");
  const { data: menuItems, isLoading: loadingMenu } = useVendorMenu(id || "");
  const [activeCategory, setActiveCategory] = useState("All");

  if (loadingVendor || loadingMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold">Vendor not found</h1>
        <Link to="/vendors" className="text-primary hover:underline mt-2">Back to vendors</Link>
      </div>
    );
  }

  const filtered = activeCategory === "All" 
    ? menuItems 
    : menuItems?.filter((f: any) => f.category === activeCategory);

  const displayVendor = {
    id: vendor.id,
    name: vendor.vendor_name,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    rating: vendor.rating || 0,
    location: vendor.location || "Main Campus",
    deliveryTime: "15-25 min"
  };

  return (
    <div className="animate-fade-in">
      {/* Vendor header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={displayVendor.image} alt={displayVendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-6">
          <Link to="/vendors" className="inline-flex items-center gap-1 text-card/80 text-xs mb-3 hover:text-card">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to vendors
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-card">{displayVendor.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-card/80 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" /> {displayVendor.rating}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {displayVendor.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {displayVendor.deliveryTime}</span>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vendor.vendor_name} Activities Area Campus Bites Ikorodu`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" /> Track on Google Map
            </a>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Vendor Location Map */}
        <div className="mb-8">
          <h2 className="font-display font-semibold mb-3">Vendor Location</h2>
          <CampusMap 
            selectedLandmark={vendor.location_landmark} 
            highlightedVendors={[{ name: vendor.vendor_name, landmark: vendor.location_landmark || "" }]} 
          />
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Find us near the {vendor.location_landmark} ({vendor.location})
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered?.map((item: any) => (
            <FoodCard 
              key={item.id} 
              item={{
                id: item.id,
                menu_id: item.menu_id || item.id,
                name: item.name,
                price: parseFloat(item.price),
                image_url: item.image_url || "",
                category: item.category,
                description: item.description,
                available: true
              }} 
              onAdd={() => toast.success(`${item.name} added to cart!`)} 
            />
          ))}
          {filtered?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No items found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

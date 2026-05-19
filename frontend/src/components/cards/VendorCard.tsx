import { Link } from "react-router-dom";
import { Star, Clock, MapPin } from "lucide-react";
import type { Vendor } from "@/types";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7ed938cabd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
];

const getDeterministicImage = (name: string = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const isPlaceholder = !vendor.image_url || 
                        vendor.image_url === "" || 
                        vendor.image_url.includes("placeholder");
  const displayImage = isPlaceholder ? getDeterministicImage(vendor.vendor_name) : vendor.image_url;

  return (
    <Link to={`/vendors/${vendor.id}`} className="block rounded-xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scale-in">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={displayImage} 
          alt={vendor.vendor_name} 
          className="w-full h-full object-cover" 
          loading="lazy" 
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-display font-bold text-lg">
            {vendor.vendor_name}
          </h3>
          <div className="flex items-center gap-1 bg-accent/10 px-1.5 py-0.5 rounded text-accent font-medium text-xs">
            <Star className="w-3 h-3 fill-accent" />
            {vendor.rating || '4.5'}
          </div>
        </div>
        
        <p className="text-muted-foreground text-xs mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {vendor.location_landmark}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {vendor.categories?.slice(0, 2).map((cat) => (
              <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {cat}
              </span>
            ))}
          </div>
          
          {vendor.is_busy ? (
            <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px] animate-pulse">
              <Clock className="w-3 h-3" /> BUSY ({vendor.wait_time_estimate}m)
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-500 font-medium text-[10px]">
              <Clock className="w-3 h-3" /> {vendor.wait_time_estimate || '15'}m
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

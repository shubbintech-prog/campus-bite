import { Link } from "react-router-dom";
import { Star, Clock, MapPin } from "lucide-react";
import type { Vendor } from "@/types";

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link to={`/vendors/${vendor.id}`} className="block rounded-xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all animate-scale-in">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={vendor.image_url || "/placeholder-vendor.jpg"} 
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

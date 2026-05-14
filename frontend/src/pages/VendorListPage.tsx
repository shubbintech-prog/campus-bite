import { useState } from "react";
import { Search, Filter, Map as MapIcon, Grid } from "lucide-react";
import VendorCard from "@/components/cards/VendorCard";
import CampusMap from "@/components/ui/CampusMap";
import { useVendors } from "@/hooks/use-vendor-api";

const categories = ["All", "Nigerian", "Fast Food", "Grills", "Snacks", "Drinks"];

export default function VendorListPage() {
  const { data: vendors, isLoading, error } = useVendors();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  if (error) return <div className="text-center text-red-500 p-10">Error loading vendors. Please try again later.</div>;

  const filtered = (vendors || []).filter((v) => {
    const matchSearch = v.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
                       v.location_landmark?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || v.categories?.includes(activeCategory);
    return matchSearch && matchCategory;
  });

  const highlightedVendors = filtered.map(v => ({ name: v.vendor_name || "", landmark: v.location_landmark || "" }));

  return (
    <div className="container py-6 md:py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Campus Vendors</h1>

        <div className="flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            <Grid className="w-4 h-4" /> Grid
          </button>
          <button 
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "map" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            <MapIcon className="w-4 h-4" /> Map View
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center bg-card rounded-xl border border-border px-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors or dishes..."
            className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
          />
        </div>
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

      {/* View Content */}
      {viewMode === "map" ? (
        <div className="space-y-6">
          <CampusMap highlightedVendors={highlightedVendors} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-display font-semibold">No vendors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

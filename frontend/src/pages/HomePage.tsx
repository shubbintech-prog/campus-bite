import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ShoppingBag, CheckCircle, Loader2 } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import VendorCard from "@/components/cards/VendorCard";
import FoodCard from "@/components/cards/FoodCard";
import { useVendors, useMenuItems } from "@/hooks/use-vendor-api";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: vendors, isLoading: loadingVendors } = useVendors(searchQuery);
  const { data: foodItems, isLoading: loadingFood } = useMenuItems(searchQuery);

  const isSearching = searchQuery.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Campus food spread" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="container relative py-16 md:py-28">
          <div className="max-w-lg">
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-card leading-tight">
              Campus Food,<br />
              <span className="text-accent">Delivered Fast.</span>
            </h1>
            <p className="mt-4 text-card/80 text-sm md:text-base max-w-md">
              Order from your favourite campus vendors. Fresh meals, snacks & drinks — ready when you are.
            </p>
            <div className="mt-6 flex items-center bg-card rounded-xl p-1.5 max-w-md card-shadow">
              <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search for food, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button className="px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="container py-10 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold">
            {isSearching ? `Search Results for "${searchQuery}" (Vendors)` : "Featured Vendors"}
          </h2>
          {!isSearching && (
            <Link to="/vendors" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {loadingVendors ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendors?.slice(0, isSearching ? undefined : 4).map((v: any) => (
              <VendorCard key={v.id} vendor={{
                id: v.id,
                vendor_name: v.vendor_name,
                owner_name: v.owner_name,
                email: v.email,
                phone: v.phone,
                location: v.location,
                location_landmark: v.location_landmark,
                rating: v.rating,
                image_url: v.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
                status: v.status,
                wait_time_estimate: 15
              }} />
            ))}
            {vendors?.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No vendors found matching your search.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Popular Meals */}
      <section className="bg-card py-10 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold">
              {isSearching ? `Search Results for "${searchQuery}" (Meals)` : "Popular Meals"}
            </h2>
            {!isSearching && (
              <Link to="/vendors" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                See more <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {loadingFood ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {foodItems?.slice(0, isSearching ? undefined : 4).map((item: any) => (
                <FoodCard key={item.id} item={{
                  id: item.id,
                  menu_id: item.menu_id,
                  name: item.name,
                  price: parseFloat(item.price),
                  image_url: item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
                  category: item.category,
                  description: item.description,
                  available: true
                }} />
              ))}
              {foodItems?.length === 0 && (
                <div className="col-span-full py-10 text-center text-muted-foreground">
                  No meals found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      {!isSearching && (
        <section className="container py-10 md:py-16">
          <h2 className="font-display text-xl md:text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Search, title: "Browse & Choose", desc: "Explore campus vendors and find your favourite meals" },
              { icon: ShoppingBag, title: "Place Order", desc: "Add items to cart and checkout in seconds" },
              { icon: CheckCircle, title: "Pick Up & Enjoy", desc: "Get notified when your order is ready for pickup" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-12 md:py-16 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">Ready to Order?</h2>
          <p className="mt-2 text-primary-foreground/80 text-sm">Join thousands of students already using Campus Bites</p>
          <Link
            to="/vendors"
            className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-accent text-accent-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity"
          >
            Start Ordering <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

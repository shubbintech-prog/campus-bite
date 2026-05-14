import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Home, Store, ClipboardList, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useSocket } from "@/hooks/use-socket";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useSocket();
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Vendors", href: "/vendors", icon: Store },
  ];

  if (isAuthenticated) {
    const isAdmin = ["super_admin", "auditor", "support"].includes(user?.role || "");
    if (isAdmin) {
      navLinks.push({ label: "Admin Panel", href: "/dashboard/admin", icon: LayoutDashboard });
    } else if (user?.role === "vendor") {
      navLinks.push({ label: "Vendor Panel", href: "/dashboard/vendor", icon: LayoutDashboard });
    } else {
      navLinks.push({ label: "My Orders", href: "/orders", icon: ClipboardList });
      navLinks.push({ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard });
    }
  }

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">Campus<span className="text-primary">Bites</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-border mx-2" />
          
          <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/profile" className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors overflow-hidden border border-border">
                {user?.image_url ? (
                  <img src={user.image_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border animate-slide-down">
          <div className="container px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({cartCount})
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-primary text-primary-foreground rounded-xl text-center font-semibold">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

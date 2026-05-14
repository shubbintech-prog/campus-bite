import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Star, Users, BarChart3, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import Navbar from "./Navbar";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ElementType;
}

const studentLinks: SidebarLink[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/orders", label: "My Orders", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: Users },
];

const vendorLinks: SidebarLink[] = [
  { to: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/vendor/menu", label: "Menu Management", icon: UtensilsCrossed },
  { to: "/dashboard/vendor/orders", label: "Orders", icon: ClipboardList },
  { to: "/dashboard/vendor/reviews", label: "Reviews", icon: Star },
];

const adminLinks: SidebarLink[] = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/admin/vendors", label: "Vendor Management", icon: ShieldCheck },
  { to: "/dashboard/admin/users", label: "User Management", icon: Users },
  { to: "/dashboard/admin/orders", label: "Order Monitoring", icon: ClipboardList },
  { to: "/dashboard/admin/applications", label: "Vendor Applications", icon: UtensilsCrossed },
  { to: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuthStore();
  const isVendor = user?.role === "vendor";
  const isAdmin = ["super_admin", "auditor", "support"].includes(user?.role || "");
  
  let links = studentLinks;
  let title = "Student Dashboard";
  
  if (isVendor) {
    links = vendorLinks;
    title = "Vendor Dashboard";
  } else if (isAdmin && user) {
    links = adminLinks;
    title = user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Dashboard";
    
    // Customize links based on specific admin role
    if (user.role === 'super_admin') {
      links = adminLinks;
    } else if (user.role === 'auditor') {
      links = adminLinks.filter(l => l.label === "Overview" || l.label === "Reports" || l.label === "Order Monitoring");
    } else if (user.role === 'support') {
      links = adminLinks.filter(l => l.label === "Overview" || l.label === "Vendor Management" || l.label === "Order Monitoring");
    } else {
      links = adminLinks.filter(l => l.label !== "User Management");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-card border-r border-border p-4 gap-1">
          <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4 px-3">{title}</h3>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-xl animate-slide-in-right p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-sm">{title}</h3>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

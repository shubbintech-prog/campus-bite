import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display font-bold text-lg text-primary">Campus Bites</span>
            <p className="mt-2 text-sm text-muted-foreground">Your campus food ordering platform. Fast, easy, delicious.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
              <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
              <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Help Center</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
              <a href="#" className="hover:text-primary transition-colors">FAQs</a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 LASUSTECH Campus Food Ordering System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

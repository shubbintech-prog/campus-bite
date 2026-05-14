import { User, Mail, Phone, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="container py-6 md:py-10 max-w-lg animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">My Profile</h1>

      <div className="flex items-center gap-4 mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg overflow-hidden">
          {user.image_url ? (
            <img src={user.image_url} alt={user.full_name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-primary-foreground" />
          )}
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">{user.full_name}</h2>
          <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <label className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Full Name</label>
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-primary" /> {user.full_name}
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border">
          <label className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Email Address</label>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-primary" /> {user.email}
          </div>
        </div>

        {user.phone && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <label className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Phone Number</label>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 text-primary" /> {user.phone}
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 border border-destructive/20 text-destructive bg-destructive/5 rounded-xl font-display font-semibold hover:bg-destructive hover:text-white transition-all duration-300"
        >
          <LogOut className="w-5 h-5" /> Logout from Account
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegister } from "@/hooks/use-auth-api";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl mx-auto mb-4">LE</span>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join LASUSTECH Eats today</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="student@campusbites.edu.ng" 
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="08012345678" 
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-10" 
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={register.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {register.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {register.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

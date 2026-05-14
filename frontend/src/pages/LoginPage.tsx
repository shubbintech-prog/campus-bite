import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-auth-api";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl mx-auto mb-4">CB</span>
          <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your Campus Bites account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input 
              type="email" 
              placeholder="student@campusbites.edu.ng" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={login.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {login.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

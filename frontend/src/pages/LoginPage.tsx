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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 animate-fade-in text-slate-100 relative overflow-hidden">
      
      {/* Premium Professional Gradient Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800/80 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-3 shadow-lg shadow-indigo-600/20">CB</span>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">Sign in to your Campus Bites account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
            <input 
              type="email" 
              placeholder="student@campusbites.edu.ng" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-semibold text-sm" 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-semibold text-sm pr-10" 
              />
              <button 
                type="button" 
                onClick={() => setShowPw(!showPw)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={login.isPending}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm mt-6"
          >
            {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {login.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

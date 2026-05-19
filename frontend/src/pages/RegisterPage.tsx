import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShoppingBag, Store } from "lucide-react";
import { useRegister } from "@/hooks/use-auth-api";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student", // default role selection
  });
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (role: "student" | "vendor") => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 animate-fade-in text-slate-100 relative overflow-hidden">
      
      {/* Dynamic Background Blur Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-3 shadow-lg shadow-indigo-600/20">CB</span>
          <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-slate-400 mt-1">Join the campus-wide marketplace today</p>
        </div>

        {/* Premium Dual Role Cards Selection */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 block">Choose Account Type</label>
          <div className="grid grid-cols-2 gap-4">
            
            <button
              type="button"
              onClick={() => selectRole("student")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                formData.role === "student"
                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              <ShoppingBag className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold block">Buy Food</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Order to faculty / hostels</span>
            </button>

            <button
              type="button"
              onClick={() => selectRole("vendor")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                formData.role === "vendor"
                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              <Store className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold block">Sell Food</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Manage custom menu logs</span>
            </button>

          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="student@campusbites.edu.ng" 
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="08012345678" 
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm pr-10" 
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-200">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={register.isPending}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm mt-6"
          >
            {register.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {register.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

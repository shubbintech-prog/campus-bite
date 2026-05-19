import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Store, Clock, MapPin, Tag, Phone, ArrowRight, CheckCircle, FileText, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function BecomeSellerPage() {
  const { user, token, setAuth } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Form Fields
  const [businessName, setBusinessName] = useState("");
  const [categories, setCategories] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("Main Campus");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [phone, setPhone] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-bold text-slate-200">Access Denied</h2>
        <p className="text-slate-400 text-sm mt-2">Please login first to apply as a merchant.</p>
        <button 
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1 && !businessName.trim()) {
      setError("Please specify your business or kitchen name.");
      return;
    }
    if (step === 2 && (!categories.trim() || !phone.trim())) {
      setError("Active categories and phone number are required.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://campus-bite-ndg1.onrender.com"}/api/auth/upgrade-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName,
          logo: bannerUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
          categories: categories.split(",").map(c => c.trim()),
          schoolLocation,
          operatingHours: { open: openTime, close: closeTime },
          phone,
          description,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit onboarding application.");

      // Sync updated multi-role states in local store
      setAuth(data.user, data.token);
      setStep(4); // Success step
      toast.success("Merchant storefront activated!");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Application activation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 md:py-16 max-w-2xl min-h-[80vh] flex flex-col justify-center animate-fade-in">
      <div className="relative w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 overflow-hidden text-slate-100">
        
        {/* Glow Accent Circles */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Merchant Hub Onboarding
              </span>
              <span className="text-xs text-slate-500 ml-auto">Step {step} of 3</span>
            </div>
            
            {/* Custom visual step progress indicators */}
            <div className="flex items-center gap-3">
              <span className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-indigo-500" : "bg-slate-800"}`} />
              <span className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-indigo-500" : "bg-slate-800"}`} />
              <span className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? "bg-indigo-500" : "bg-slate-800"}`} />
            </div>
          </div>
        )}

        {/* Step 1: Branding & Description */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Let's brand your kitchen</h2>
                <p className="text-slate-400 text-sm mt-0.5">Setup your brand presence so campus buyers recognize you.</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Store / Kitchen Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Iya Basira Delicacies"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3.5 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kitchen Description</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell students about your famous recipes, spices, and cooking passion..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3.5 text-sm font-medium resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Food categories & Phone */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Food items & Contact</h2>
                <p className="text-slate-400 text-sm mt-0.5">Specify your food specialties and customer communication lines.</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Food categories (comma separated)</label>
                <input 
                  type="text" 
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Jollof Rice, Swallow, Fast Food, Snacks, Shakes"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3.5 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active Contact Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="080XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3.5 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Logistics & Branding image */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Logistics & Storefront Image</h2>
                <p className="text-slate-400 text-sm mt-0.5">Specify delivery landmarks, operating hours, and banner designs.</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">School Location Landmark</label>
                <input 
                  type="text" 
                  value={schoolLocation}
                  onChange={(e) => setSchoolLocation(e.target.value)}
                  placeholder="e.g. SUB Building, Main Gate, Faculty of Law"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3.5 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Opening Time</label>
                  <input 
                    type="time" 
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Closing Time</label>
                  <input 
                    type="time" 
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Store Banner Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="Paste a direct image web link or leave blank for preset"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-2xl px-4 py-3.5 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Full Success Screen */}
        {step === 4 && (
          <div className="text-center py-6 md:py-10 space-y-6 animate-slide-in">
            <div className="flex items-center justify-center w-20 h-20 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold font-display text-white">Storefront Activated!</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Congratulations, **{businessName}** is officially live! Your hybrid customer-merchant portal is now active on the network.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Operational Hours:</span>
                <span className="font-semibold text-slate-200">{openTime} - {closeTime}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Landmark Location:</span>
                <span className="font-semibold text-slate-200">{schoolLocation}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Store Status:</span>
                <span className="text-emerald-400 font-bold px-2 py-0.5 rounded-lg bg-emerald-400/10 uppercase tracking-widest">Active</span>
              </div>
            </div>

            <button 
              onClick={() => {
                navigate("/dashboard/vendor");
                window.location.reload();
              }}
              className="w-full max-w-xs mx-auto py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
            >
              Enter Merchant Console
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Step Actions */}
        {step < 4 && (
          <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-850">
            {step > 1 && (
              <button 
                onClick={handleBack}
                disabled={loading}
                className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-2xl font-semibold transition-all active:scale-[0.98] text-sm"
              >
                Back
              </button>
            )}
            
            <button 
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
              className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === 3 ? (
                "Launch Storefront"
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

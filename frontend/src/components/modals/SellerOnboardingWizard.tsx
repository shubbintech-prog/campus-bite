import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { X, CheckCircle, ArrowRight, Store, Clock, MapPin, Tag, Phone } from "lucide-react";

interface SellerOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellerOnboardingWizard: React.FC<SellerOnboardingWizardProps> = ({ isOpen, onClose }) => {
  const { user, token, setAuth } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [categories, setCategories] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("Main Campus");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !businessName.trim()) {
      setError("Please specify your business name");
      return;
    }
    if (step === 2 && (!categories.trim() || !phone.trim())) {
      setError("Categories and phone number are required");
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
          logo: "",
          categories: categories.split(",").map(c => c.trim()),
          schoolLocation,
          operatingHours: { open: openTime, close: closeTime },
          phone,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to complete onboarding");

      // Update local storage credentials
      setAuth(data.user, data.token);
      setStep(4); // Success step
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden text-slate-100">
        
        {/* Absolute Background Accent Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Indicators */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            <span className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-indigo-500" : "bg-slate-800"}`} />
            <span className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-indigo-500" : "bg-slate-800"}`} />
            <span className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? "bg-indigo-500" : "bg-slate-800"}`} />
          </div>
        )}

        {/* STEP 1: Basic business details */}
        {step === 1 && (
          <div className="animate-slide-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Create Your Merchant Profile</h3>
            <p className="text-slate-400 text-sm mt-1 mb-6">Let's set up your brand and storefront metadata for the campus.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Iya Basira Delicacies"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Categories and Phone */}
        {step === 2 && (
          <div className="animate-slide-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Contact & Categories</h3>
            <p className="text-slate-400 text-sm mt-1 mb-6">List what types of foods you offer and how hungry students can call you.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Food Categories (comma separated)</label>
                <input 
                  type="text" 
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Rice, Swallow, Desserts, Fast Food"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Active Contact Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="080XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: School location and hours */}
        {step === 3 && (
          <div className="animate-slide-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Location & Operating Hours</h3>
            <p className="text-slate-400 text-sm mt-1 mb-6">Specify your physical landmark and normal business hours.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">School Location Landmark</label>
                <input 
                  type="text" 
                  value={schoolLocation}
                  onChange={(e) => setSchoolLocation(e.target.value)}
                  placeholder="e.g. SUB Building, Main Gate, Faculty of Art"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Opening Time</label>
                  <input 
                    type="time" 
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Closing Time</label>
                  <input 
                    type="time" 
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Success confirmation */}
        {step === 4 && (
          <div className="text-center py-6 animate-slide-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Storefront Activated!</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 mb-8">
              Congratulations! Your merchant profile is now live. You can instantly toggle between Buyer & Seller modes in your navigation bar!
            </p>

            <button 
              onClick={() => {
                onClose();
                window.location.reload(); // Refresh to dynamically update dashboards and navigation items
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
            >
              Enter Seller Console
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Navigation Action Buttons */}
        {step < 4 && (
          <div className="flex items-center gap-4 mt-8">
            {step > 1 && (
              <button 
                onClick={handleBack}
                disabled={loading}
                className="flex-1 bg-slate-950 hover:bg-slate-800 active:scale-[0.98] border border-slate-800 text-slate-300 py-3 rounded-xl font-semibold transition-all text-sm"
              >
                Back
              </button>
            )}
            
            <button 
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === 3 ? (
                "Finish & Activate"
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
};

import React, { useState } from "react";
import { User, Mail, Phone, LogOut, MapPin, Calendar, FileText, Camera, Edit2, Check, X, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, token, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [defaultAddress, setDefaultAddress] = useState(user?.default_address || "");
  const [imageUrl, setImageUrl] = useState(user?.image_url || "");
  const [newSavedAddress, setNewSavedAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<string[]>(user?.saved_addresses || []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://campus-bite-ndg1.onrender.com"}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          bio,
          default_address: defaultAddress,
          saved_addresses: savedAddresses,
          image_url: imageUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      // Sync Zustand store
      updateUser({
        full_name: data.user.full_name,
        phone: data.user.phone,
        bio: data.user.bio,
        default_address: data.user.default_address,
        saved_addresses: data.user.saved_addresses,
        image_url: data.user.image_url,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Could not update profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newSavedAddress.trim()) return;
    if (savedAddresses.includes(newSavedAddress.trim())) {
      toast.error("Landmark already added.");
      return;
    }
    const updated = [...savedAddresses, newSavedAddress.trim()];
    setSavedAddresses(updated);
    setNewSavedAddress("");
    toast.success("Secondary landmark added!");
  };

  const handleRemoveAddress = (indexToRemove: number) => {
    const updated = savedAddresses.filter((_, idx) => idx !== indexToRemove);
    setSavedAddresses(updated);
    toast.success("Secondary landmark removed.");
  };

  const getRoleLabel = (role: string) => {
    if (role === "student") return "Customer";
    if (role === "vendor") return "Merchant";
    if (role === "super_admin" || role === "admin") return "Platform Administrator";
    return role;
  };

  return (
    <div className="container py-8 md:py-16 max-w-2xl animate-fade-in text-slate-100">
      
      {/* Upper Brand Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Avatar Display / Upload field */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 p-1 shadow-lg overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-full bg-slate-950" />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <User className="w-10 h-10 text-indigo-400" />
              </div>
            )}
          </div>
        </div>

        <div className="text-center md:text-left flex-1 space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-2.5">
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-white">{user.full_name}</h2>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
              {getRoleLabel(user.active_role || user.role)}
            </span>
          </div>

          <p className="text-slate-400 text-sm italic max-w-sm">
            {user.bio ? `"${user.bio}"` : "Add a biography to customize your customer footprint."}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>
            {user.created_at && (
              <span className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
                <Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
            isEditing 
              ? "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900" 
              : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500 shadow-md shadow-indigo-600/10"
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-3.5 h-3.5" /> Cancel Edit
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        /* ================= EDIT MODE FORM ================= */
        <form onSubmit={handleSave} className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative">
          <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-lg font-bold font-display text-white border-b border-slate-850 pb-3 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-indigo-400" /> Modify Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-xl px-4 py-3 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-xl px-4 py-3 text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Biography / Status Quote</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Hungry student, dessert lover, or Jollof rice enthusiast..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-xl px-4 py-3 text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avatar URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste direct profile picture url (https://...)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-xl px-4 py-3 text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Default Campus Landmark (Primary Delivery)</label>
              <input
                type="text"
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="e.g. SUB Building 2nd Floor, Room 14"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-xl px-4 py-3 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Secondary Saved Landmarks Manager */}
          <div className="pt-4 border-t border-slate-850">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Saved Delivery Landmarks</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSavedAddress}
                onChange={(e) => setNewSavedAddress(e.target.value)}
                placeholder="Add other common landmarks (e.g. Library, Faculty of Engineering)"
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all rounded-xl px-4 py-3 text-sm font-semibold"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="px-5 bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Add Landmark
              </button>
            </div>

            {savedAddresses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((addr, idx) => (
                  <span 
                    key={idx} 
                    className="flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-medium text-slate-300"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {addr}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAddress(idx)}
                      className="p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No secondary delivery landmarks defined yet.</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-850">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save Profile Configurations
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* ================= READ MODE DISPLAY ================= */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            
            {/* Core Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-widest">Full Name</label>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <User className="w-4 h-4 text-indigo-400" /> {user.full_name}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Mail className="w-4 h-4 text-indigo-400" /> {user.email}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-widest">Phone Number</label>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Phone className="w-4 h-4 text-indigo-400" /> {user.phone || <span className="text-slate-500 font-medium italic">None configured</span>}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-widest">Primary Delivery Landmark</label>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <MapPin className="w-4 h-4 text-indigo-400" /> {user.default_address || <span className="text-slate-500 font-medium italic">None configured</span>}
                </div>
              </div>
            </div>

            {/* Saved Delivery Locations List */}
            {savedAddresses.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-widest">Saved Delivery Landmarks</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {savedAddresses.map((addr, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {addr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone Actions */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-4 border border-red-500/10 text-red-400 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl font-display font-bold transition-all duration-300 shadow-lg shadow-red-500/5"
          >
            <LogOut className="w-5 h-5" /> Logout from Session
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from "react";
import { User, Mail, Phone, LogOut, MapPin, Calendar, Camera, Edit3, Check, X, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

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
  
  // File upload staging states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user?.image_url ? getImageUrl(user.image_url) : "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newSavedAddress, setNewSavedAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<string[]>(user?.saved_addresses || []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(user?.full_name || "");
    setPhone(user?.phone || "");
    setBio(user?.bio || "");
    setDefaultAddress(user?.default_address || "");
    setImageUrl(user?.image_url || "");
    setImageFile(null);
    setPreviewUrl(user?.image_url ? getImageUrl(user.image_url) : "");
    setSavedAddresses(user?.saved_addresses || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("bio", bio);
      formData.append("default_address", defaultAddress);
      formData.append("saved_addresses", JSON.stringify(savedAddresses));
      
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image_url", imageUrl);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://campus-bite-ndg1.onrender.com"}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
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

      setImageUrl(data.user.image_url || "");
      setImageFile(null);
      setPreviewUrl(data.user.image_url ? getImageUrl(data.user.image_url) : "");

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

  // Upload/Drag-drop event handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max size is 5MB.");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image staged for upload!");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max size is 5MB.");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image staged for upload!");
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "student") return "Customer";
    if (role === "vendor") return "Merchant";
    if (role === "super_admin" || role === "admin") return "Platform Administrator";
    return role;
  };

  return (
    <div className="container py-8 md:py-16 max-w-3xl animate-scale-in text-foreground">
      
      {/* Brand Header Panel - Dynamic glassmorphism with layout reflections */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/60 p-6 md:p-8 rounded-3xl relative overflow-hidden card-shadow flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8 transition-all duration-300">
        
        {/* Decorative corner visual overlay */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-amber-500" />
        
        {/* Interactive Avatar Area */}
        <div 
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative shrink-0 select-none group w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary via-accent to-amber-500 transition-all duration-300 ${
            isEditing 
              ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98] focus:ring-4 focus:ring-primary/20" 
              : ""
          } ${
            isDragging ? "ring-4 ring-primary ring-offset-4 scale-105" : ""
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png,image/webp" 
            className="hidden" 
          />
          
          <div className="w-full h-full rounded-full bg-background overflow-hidden relative flex items-center justify-center border border-background">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={name} 
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground/60" />
              </div>
            )}

            {/* Hover overlay indicator in edit mode */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest gap-1">
                <Camera className="w-5 h-5 text-white/90 animate-pulse" />
                <span>Upload</span>
              </div>
            )}
          </div>
          
          {/* Accent edit sticker indicator */}
          {isEditing && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-2 rounded-full border-2 border-background shadow-md group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* User context information */}
        <div className="text-center md:text-left flex-1 space-y-3 z-10">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-foreground">{user.full_name}</h2>
            <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">
              {getRoleLabel(user.active_role || user.role)}
            </span>
          </div>

          <p className="text-muted-foreground text-sm italic font-medium max-w-md">
            {user.bio ? `"${user.bio}"` : "Add a biography to customize your customer footprint."}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors">
              <Mail className="w-3.5 h-3.5 text-primary/75" /> {user.email}
            </span>
            {user.created_at && (
              <span className="flex items-center gap-1.5 border-l border-border/80 pl-4 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary/75" /> Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Top level button trigger */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="z-10 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-95 shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-[0.97]"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        /* ================= EDIT MODE FORM ================= */
        <form onSubmit={handleSave} className="space-y-6 bg-card border border-border/60 rounded-3xl p-6 md:p-8 card-shadow relative overflow-hidden transition-all duration-300">
          <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-amber-500" />
          
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2.5">
              <Edit3 className="w-5 h-5 text-primary" /> Modify Profile Details
            </h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Primary Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080XXXXXXXX"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Biography / Status Quote</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Hungry student, dessert lover, or Jollof rice enthusiast..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Default Campus Landmark (Primary Delivery)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  placeholder="e.g. SUB Building 2nd Floor, Room 14"
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Secondary Saved Landmarks Manager */}
          <div className="pt-6 border-t border-border/60">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Saved Delivery Landmarks</label>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={newSavedAddress}
                  onChange={(e) => setNewSavedAddress(e.target.value)}
                  placeholder="Add other landmarks (e.g. Library, Faculty of Engineering)"
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="px-5 bg-background hover:bg-muted border border-border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-[0.97]"
              >
                <Plus className="w-4 h-4 text-primary" /> Add
              </button>
            </div>

            {savedAddresses.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {savedAddresses.map((addr, idx) => (
                  <span 
                    key={idx} 
                    className="flex items-center gap-2 pl-3.5 pr-2 py-2 bg-background border border-border rounded-xl text-xs font-semibold text-foreground group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {addr}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAddress(idx)}
                      className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic pl-1">No secondary delivery landmarks defined yet.</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/60">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-5 py-3 border border-border hover:bg-muted rounded-xl text-sm font-bold transition-colors text-center"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary hover:opacity-95 text-primary-foreground rounded-xl font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 card-shadow space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-amber-500" />
            
            {/* Core Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors">
                <label className="text-[10px] font-extrabold text-muted-foreground mb-1.5 block uppercase tracking-widest">Full Name</label>
                <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <User className="w-4 h-4 text-primary" /> {user.full_name}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors">
                <label className="text-[10px] font-extrabold text-muted-foreground mb-1.5 block uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <Mail className="w-4 h-4 text-primary" /> {user.email}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors">
                <label className="text-[10px] font-extrabold text-muted-foreground mb-1.5 block uppercase tracking-widest">Phone Number</label>
                <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <Phone className="w-4 h-4 text-primary" /> {user.phone || <span className="text-muted-foreground font-semibold italic">None configured</span>}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors">
                <label className="text-[10px] font-extrabold text-muted-foreground mb-1.5 block uppercase tracking-widest">Primary Delivery Landmark</label>
                <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" /> {user.default_address || <span className="text-muted-foreground font-semibold italic">None configured</span>}
                </div>
              </div>
            </div>

            {/* Saved Delivery Locations List */}
            {savedAddresses.length > 0 && (
              <div className="p-5 rounded-2xl bg-background border border-border/40 space-y-4">
                <label className="text-[10px] font-extrabold text-muted-foreground block uppercase tracking-widest">Saved Delivery Landmarks</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {savedAddresses.map((addr, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border/60 rounded-xl text-xs font-semibold text-foreground"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary" />
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
            className="w-full flex items-center justify-center gap-2.5 py-4 border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive hover:text-destructive-foreground rounded-2xl font-display font-bold transition-all duration-300 shadow-sm"
          >
            <LogOut className="w-5 h-5 animate-pulse" /> Logout from Session
          </button>
        </div>
      )}
    </div>
  );
}

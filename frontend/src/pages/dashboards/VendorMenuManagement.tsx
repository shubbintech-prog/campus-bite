import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ShoppingBag, Upload, Image as ImageIcon, Store, MapPin } from "lucide-react";
import { useVendorMenu, useAddMenuItem, useUpdateMenuItem, useDeleteMenuItem, useVendorDetails, useUpdateVendorStorefront } from "@/hooks/use-vendor-api";
import { useAuthStore } from "@/store/useAuthStore";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function VendorMenuManagement() {
  const { user } = useAuthStore();
  const { data: menuItems, isLoading, refetch } = useVendorMenu(user?.id || "");
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const { data: vendor, refetch: refetchVendor } = useVendorDetails(user?.id || "");
  const updateStorefront = useUpdateVendorStorefront();

  const [showStorefrontForm, setShowStorefrontForm] = useState(false);
  const [storefrontFile, setStorefrontFile] = useState<File | null>(null);
  const [storefrontPreview, setStorefrontPreview] = useState<string>("");
  const [isDraggingStorefront, setIsDraggingStorefront] = useState(false);
  const storefrontFileInputRef = useRef<HTMLInputElement>(null);

  // Sync current vendor image on load or change
  useEffect(() => {
    if (vendor?.image_url) {
      setStorefrontPreview(getImageUrl(vendor.image_url));
    }
  }, [vendor]);

  const handleStorefrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please upload an image.");
        return;
      }
      setStorefrontFile(file);
      setStorefrontPreview(URL.createObjectURL(file));
    }
  };

  const handleStorefrontDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingStorefront(true);
  };

  const handleStorefrontDragLeave = () => {
    setIsDraggingStorefront(false);
  };

  const handleStorefrontDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingStorefront(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please upload an image.");
        return;
      }
      setStorefrontFile(file);
      setStorefrontPreview(URL.createObjectURL(file));
    }
  };

  const clearStorefrontImage = () => {
    setStorefrontFile(null);
    setStorefrontPreview(vendor?.image_url ? getImageUrl(vendor.image_url) : "");
    if (storefrontFileInputRef.current) {
      storefrontFileInputRef.current.value = "";
    }
  };

  const handleStorefrontSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vendor) return;

    const formDataRaw = new FormData(e.currentTarget);
    const submitData = new FormData();
    submitData.append("vendor_name", formDataRaw.get("vendor_name") as string);
    submitData.append("location_landmark", formDataRaw.get("location_landmark") as string);

    if (storefrontFile) {
      submitData.append("image", storefrontFile);
    } else if (vendor.image_url) {
      submitData.append("image_url", vendor.image_url);
    }

    try {
      await updateStorefront.mutateAsync({ vendorId: user?.id || "", vendorData: submitData });
      toast.success("Restaurant storefront details updated successfully!");
      setShowStorefrontForm(false);
      setStorefrontFile(null);
      refetchVendor();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update storefront details");
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // High fidelity file upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please upload an image.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
        toast.error("Invalid file type. Please upload an image.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataRaw = new FormData(e.currentTarget);
    
    // Construct multi-part FormData object
    const submitData = new FormData();
    submitData.append("name", formDataRaw.get("name") as string);
    submitData.append("price", formDataRaw.get("price") as string);
    submitData.append("category", formDataRaw.get("category") as string);
    submitData.append("description", formDataRaw.get("description") as string);
    
    if (selectedFile) {
      submitData.append("image", selectedFile);
    } else if (editingItem?.image_url) {
      submitData.append("image_url", editingItem.image_url);
    }

    try {
      if (editingItem) {
        await updateMenuItem.mutateAsync({ itemId: editingItem.id, itemData: submitData });
        toast.success("Food item updated successfully");
      } else {
        await addMenuItem.mutateAsync(submitData);
        toast.success("Food item added successfully");
      }
      setShowForm(false);
      setEditingItem(null);
      setSelectedFile(null);
      setPreviewUrl("");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save food item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const itemsArray = Array.isArray(menuItems) ? menuItems : [];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Menu Storefront</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage food lists and update images</p>
        </div>
        
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingItem(null);
              setSelectedFile(null);
              setPreviewUrl("");
            } else {
              setShowForm(true);
              setEditingItem(null);
              setSelectedFile(null);
              setPreviewUrl("");
              if (showStorefrontForm) setShowStorefrontForm(false);
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all card-shadow"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add New Item"}
        </button>
      </div>

      {/* Restaurant Storefront Display / Settings Card */}
      {vendor && (
        <div className="rounded-2xl bg-card border border-border/80 overflow-hidden mb-8 card-shadow relative">
          <div className="h-36 md:h-48 overflow-hidden relative">
            <img 
              src={vendor.image_url ? getImageUrl(vendor.image_url) : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"} 
              alt={vendor.vendor_name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-md">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <div className="text-foreground">
                  <h2 className="font-display font-extrabold text-xl md:text-2xl drop-shadow-sm">{vendor.vendor_name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {vendor.location_landmark || "No location landmark set"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStorefrontForm(!showStorefrontForm);
                  if (showForm) setShowForm(false);
                }}
                className="px-4 py-2 bg-background/95 hover:bg-background border border-border text-foreground font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.97]"
              >
                {showStorefrontForm ? "Close Settings" : "Storefront Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Storefront Editing Panel */}
      {showStorefrontForm && vendor && (
        <div className="rounded-2xl bg-card border border-border/80 p-6 md:p-8 mb-8 card-shadow relative overflow-hidden transition-all duration-300 animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-amber-500" />
          
          <h3 className="font-display font-bold text-xl mb-6 text-foreground/90 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" /> Edit Storefront Details
          </h3>
          
          <form className="grid md:grid-cols-2 gap-6" onSubmit={handleStorefrontSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Restaurant Name</label>
              <input 
                name="vendor_name" 
                type="text" 
                defaultValue={vendor.vendor_name} 
                required 
                placeholder="e.g. Mama T's Kitchen" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Landmark Location</label>
              <input 
                name="location_landmark" 
                type="text" 
                defaultValue={vendor.location_landmark} 
                required 
                placeholder="e.g. Shop 05, Activities Area" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
              />
            </div>
            
            {/* Storefront Image Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Storefront Cover Image</label>
              
              <div 
                onDragOver={handleStorefrontDragOver}
                onDragLeave={handleStorefrontDragLeave}
                onDrop={handleStorefrontDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[180px] ${
                  isDraggingStorefront 
                    ? "border-primary bg-primary/5 scale-[0.99]" 
                    : "border-border hover:border-muted-foreground/50 bg-background"
                }`}
                onClick={() => {
                  storefrontFileInputRef.current?.click();
                }}
              >
                <input 
                  type="file" 
                  ref={storefrontFileInputRef}
                  onChange={handleStorefrontFileChange}
                  accept="image/*"
                  className="hidden" 
                />

                {storefrontPreview ? (
                  <div className="relative w-full max-w-[480px] aspect-[16/9] rounded-xl overflow-hidden shadow-inner group">
                    <img src={storefrontPreview} alt="Storefront Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearStorefrontImage();
                        }}
                        className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        title="Reset to Original"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 pointer-events-none select-none">
                    <div className="w-12 h-12 bg-muted/60 border border-border rounded-xl flex items-center justify-center mx-auto text-muted-foreground/80 hover:text-foreground transition-colors">
                      <Upload className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Drag & Drop Storefront Photo</p>
                      <p className="text-xs text-muted-foreground mt-0.5">JPEG, PNG, WebP up to 5MB</p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-1.5 bg-muted border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        storefrontFileInputRef.current?.click();
                      }}
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 pt-2 flex items-center gap-3">
              <button 
                type="submit" 
                disabled={updateStorefront.isPending} 
                className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 card-shadow"
              >
                {updateStorefront.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Storefront Details
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowStorefrontForm(false);
                  setStorefrontFile(null);
                  setStorefrontPreview(vendor.image_url ? getImageUrl(vendor.image_url) : "");
                }}
                className="px-5 py-3 border border-border rounded-xl font-bold text-sm hover:bg-muted transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl bg-card border border-border/80 p-6 md:p-8 mb-8 card-shadow relative overflow-hidden transition-all duration-300 animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
          
          <h3 className="font-display font-bold text-xl mb-6 text-foreground/90">
            {editingItem ? "Edit Food Details" : "New Culinary Creation"}
          </h3>
          
          <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Food Name</label>
              <input 
                name="name" 
                type="text" 
                defaultValue={editingItem?.name} 
                required 
                placeholder="e.g. Smoky Jollof Rice" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Price (₦)</label>
              <input 
                name="price" 
                type="number" 
                defaultValue={editingItem?.price} 
                required 
                placeholder="1500" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Category</label>
              <select 
                name="category" 
                defaultValue={editingItem?.category || "Rice"} 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
              >
                <option>Rice</option>
                <option>Swallow</option>
                <option>FastFood</option>
                <option>Snacks</option>
                <option>Grills</option>
                <option>Drinks</option>
              </select>
            </div>
            
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Description</label>
              <textarea 
                name="description" 
                defaultValue={editingItem?.description} 
                rows={3} 
                required
                placeholder="List ingredients, sides, or custom packaging options..." 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all font-medium" 
              />
            </div>
            
            {/* High fidelity image upload component */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Food Image</label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[160px] ${
                  isDragging 
                    ? "border-primary bg-primary/5 scale-[0.99]" 
                    : "border-border hover:border-muted-foreground/50 bg-background"
                }`}
                onClick={() => {
                  if (!previewUrl) {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden" 
                />

                {previewUrl ? (
                  <div className="relative w-full max-w-[320px] aspect-[16/10] rounded-xl overflow-hidden shadow-inner group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 pointer-events-none select-none">
                    <div className="w-12 h-12 bg-muted/60 border border-border rounded-xl flex items-center justify-center mx-auto text-muted-foreground/80 hover:text-foreground transition-colors">
                      <Upload className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Drag & Drop Food Photo</p>
                      <p className="text-xs text-muted-foreground mt-0.5">JPEG, PNG, WebP up to 5MB</p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-1.5 bg-muted border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 pt-2 flex items-center gap-3">
              <button 
                type="submit" 
                disabled={addMenuItem.isPending || updateMenuItem.isPending} 
                className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 card-shadow"
              >
                {(addMenuItem.isPending || updateMenuItem.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingItem ? "Update Item" : "Save Culinary Item"}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setSelectedFile(null);
                  setPreviewUrl("");
                }}
                className="px-5 py-3 border border-border rounded-xl font-bold text-sm hover:bg-muted transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Item list */}
      <div className="space-y-4">
        {itemsArray.length > 0 ? (
          itemsArray.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-5 rounded-2xl bg-card card-shadow p-4 border border-border/40 hover:border-border/80 transition-all duration-300 group"
            >
              <div className="w-20 h-20 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden border border-border/30 relative">
                {item.image_url ? (
                  <img src={getImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-base truncate">{item.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-md">{item.description}</p>
                <p className="text-base font-extrabold mt-1.5 text-foreground/90">₦{parseFloat(item.price).toLocaleString()}</p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => {
                    setEditingItem(item);
                    setPreviewUrl(item.image_url ? getImageUrl(item.image_url) : "");
                    setShowForm(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-[0.95] transition-all"
                  title="Edit Item"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to permanently delete this culinary item?")) {
                      try {
                        await deleteMenuItem.mutateAsync(item.id);
                        toast.success("Culinary item removed");
                        refetch();
                      } catch (err) {
                        toast.error("Failed to delete item");
                      }
                    }
                  }}
                  className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/20 active:scale-[0.95] transition-all"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border/80 card-shadow flex flex-col items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">Your store menu is currently empty</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Click the button above to publish your first food item</p>
          </div>
        )}
      </div>
    </div>
  );
}

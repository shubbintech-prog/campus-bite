import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ShoppingBag } from "lucide-react";
import { useVendorMenu, useAddMenuItem, useUpdateMenuItem, useDeleteMenuItem } from "@/hooks/use-vendor-api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function VendorMenuManagement() {
  const { user } = useAuthStore();
  const { data: menuItems, isLoading, refetch } = useVendorMenu(user?.id || "");
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
      vendor_id: user?.id,
    };

    try {
      if (editingItem) {
        await updateMenuItem.mutateAsync({ itemId: editingItem.id, itemData: data });
        toast.success("Item updated successfully");
      } else {
        await addMenuItem.mutateAsync(data);
        toast.success("Item added successfully");
      }
      setShowForm(false);
      setEditingItem(null);
      refetch();
    } catch (error) {
      toast.error("Failed to save item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const itemsArray = Array.isArray(menuItems) ? menuItems : [];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Menu Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl bg-card card-shadow p-4 mb-6 border border-border">
          <h3 className="font-display font-semibold mb-4">{editingItem ? "Edit Menu Item" : "New Menu Item"}</h3>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Food Name</label>
              <input name="name" type="text" defaultValue={editingItem?.name} required placeholder="e.g. Jollof Rice" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Price (₦)</label>
              <input name="price" type="number" defaultValue={editingItem?.price} required placeholder="1500" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <select name="category" defaultValue={editingItem?.category || "Rice"} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>Rice</option><option>Fast Food</option><option>Snacks</option><option>Grills</option><option>Drinks</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea name="description" defaultValue={editingItem?.description} rows={2} placeholder="Describe the dish..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Image URL</label>
              <input name="image_url" type="text" defaultValue={editingItem?.image_url} placeholder="https://images.unsplash.com/photo-..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={addMenuItem.isPending || updateMenuItem.isPending} className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {editingItem ? "Update Item" : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Item list */}
      <div className="space-y-3">
        {itemsArray.length > 0 ? (
          itemsArray.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl bg-card card-shadow p-3 border border-border/50">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-sm truncate">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <p className="text-sm font-bold mt-0.5">₦{parseFloat(item.price).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => {
                    setEditingItem(item);
                    setShowForm(true);
                  }}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this item?")) {
                      await deleteMenuItem.mutateAsync(item.id);
                      toast.success("Item deleted");
                      refetch();
                    }
                  }}
                  className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-card rounded-xl border border-dashed">
            <p className="text-muted-foreground">No menu items yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

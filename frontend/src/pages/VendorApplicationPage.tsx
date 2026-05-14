import { useState } from "react";
import { Loader2, ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useApplyAsVendor } from "@/hooks/use-vendor-application-api";

export default function VendorApplicationPage() {
  const applyMutation = useApplyAsVendor();
  const [formData, setFormData] = useState({
    business_name: "",
    phone_number: "",
    food_category: "Rice",
    description: "",
    location_landmark: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-10 max-w-2xl animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl bg-card card-shadow p-6 md:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold mb-2">Apply to become a Vendor</h1>
          <p className="text-muted-foreground text-sm">Fill out the details below to start selling on Campus Bites.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business / Vendor Name</label>
              <input
                required
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="e.g. Mama T's Kitchen"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                required
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="08012345678"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Food Category</label>
              <select
                name="food_category"
                value={formData.food_category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="Rice">Rice Dishes</option>
                <option value="Swallow">Swallow & Soups</option>
                <option value="FastFood">Fast Food / Snacks</option>
                <option value="Drinks">Drinks & Beverages</option>
                <option value="Grills">Grills & BBQ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location Landmark</label>
              <input
                required
                name="location_landmark"
                value={formData.location_landmark}
                onChange={handleChange}
                placeholder="e.g. Near ICT Center"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about the kinds of food you sell..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={applyMutation.isPending}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {applyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Apply to Become a Vendor
            </button>
            <p className="text-[11px] text-center text-muted-foreground mt-4">
              By applying, you agree to our vendor terms and conditions. Your application will be reviewed by the admin panel.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

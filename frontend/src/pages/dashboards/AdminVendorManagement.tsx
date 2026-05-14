import { useState } from "react";
import { CheckCircle, XCircle, Eye, Loader2, Search, Filter, Mail, Phone, MapPin, Building2, User } from "lucide-react";
import { useVendors, useVendorApplications, useUpdateApplicationStatus } from "@/hooks/use-vendor-api";
import { toast } from "sonner";

const statusStyle: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  disabled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminVendorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vendors, isLoading: loadingVendors } = useVendors();
  const { data: applications, isLoading: loadingApps, refetch: refetchApps } = useVendorApplications();
  const updateStatus = useUpdateApplicationStatus();

  const handleAction = (appId: string, status: 'approved' | 'rejected') => {
    updateStatus.mutate({ appId, status }, {
      onSuccess: () => {
        toast.success(`Application ${status} successfully`);
        refetchApps();
      },
      onError: () => {
        toast.error(`Failed to ${status} application`);
      }
    });
  };

  if (loadingVendors || loadingApps) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing vendor records...</p>
      </div>
    );
  }

  const pendingApps = applications?.filter((app: any) => app.status === 'pending') || [];
  const activeVendors = vendors?.filter((v: any) => 
    v.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Vendor Ecosystem</h1>
          <p className="text-muted-foreground text-sm">Manage applications and oversee registered campus outlets.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search vendors or owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border shadow-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
          />
        </div>
      </div>

      {/* Applications Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-warning rounded-full" />
          <h2 className="font-display text-xl font-bold">Pending Applications</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold">
            {pendingApps.length}
          </span>
        </div>

        {pendingApps.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingApps.map((app: any) => (
              <div key={app.id} className="glass-card rounded-3xl p-6 border border-warning/10 flex flex-col gap-6 hover:scale-[1.02] transition-transform">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center text-warning shadow-inner">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(app.id, 'approved')}
                      className="w-10 h-10 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleAction(app.id, 'rejected')}
                      className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg leading-tight">{app.business_name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <User className="w-3.5 h-3.5" /> {app.applicant_name}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Location</p>
                    <p className="text-xs font-semibold truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" /> {app.location_landmark}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Contact</p>
                    <p className="text-xs font-semibold truncate">{app.phone_number}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center glass-card rounded-3xl border-dashed border-2 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">The queue is empty. All applications processed.</p>
          </div>
        )}
      </section>

      {/* Active Vendors Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="font-display text-xl font-bold">Outlet Directory</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {vendors?.length || 0}
          </span>
        </div>

        <div className="overflow-hidden glass-card rounded-3xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Outlet Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {activeVendors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-display font-bold shadow-sm">
                          {v.vendor_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-none mb-1">{v.vendor_name}</p>
                          <p className="text-xs text-muted-foreground">ID: #{v.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{v.location}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {v.location_landmark}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs flex items-center gap-1.5 font-medium">
                          <Mail className="w-3 h-3 text-muted-foreground" /> {v.email}
                        </p>
                        <p className="text-xs flex items-center gap-1.5 font-medium">
                          <Phone className="w-3 h-3 text-muted-foreground" /> {v.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase border tracking-wider ${v.status === 'active' ? statusStyle.active : v.status === 'pending' ? statusStyle.pending : statusStyle.disabled}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all inline-flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeVendors.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm italic">
              No matching records found for "{searchQuery}"
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

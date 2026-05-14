import { useState } from "react";
import { Loader2, Search, Trash2, Mail, Phone, Calendar, Shield, User as UserIcon, MoreVertical } from "lucide-react";
import { useAdminUsers, useDeleteUser } from "@/hooks/use-admin-api";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const roleColors: Record<string, string> = {
  super_admin: "text-purple-600 bg-purple-50 border-purple-100",
  support: "text-blue-600 bg-blue-50 border-blue-100",
  auditor: "text-amber-600 bg-amber-50 border-amber-100",
  vendor: "text-primary bg-primary/5 border-primary/10",
  student: "text-muted-foreground bg-muted/50 border-border",
};

export default function AdminUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading, refetch } = useAdminUsers();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      deleteUserMutation.mutate(userId, {
        onSuccess: () => {
          toast.success("User deleted successfully");
          refetch();
        },
        onError: () => {
          toast.error("Failed to delete user");
        }
      });
    }
  };

  const filteredUsers = users?.filter((u: any) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Fetching system accounts...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Account Management</h1>
          <p className="text-muted-foreground text-sm">Control system access and oversee all user types.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border shadow-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Account</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-display font-bold shadow-sm group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none mb-1">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase border tracking-wider whitespace-nowrap ${roleColors[u.role] || roleColors.student}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs flex items-center gap-1.5 font-medium">
                        <Phone className="w-3 h-3 text-muted-foreground" /> {u.phone || 'No phone'}
                      </p>
                      <p className="text-xs flex items-center gap-1.5 font-medium">
                        <Mail className="w-3 h-3 text-muted-foreground" /> {u.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDelete(u.id, u.name)}
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all flex items-center justify-center"
                        title="Delete User"
                        disabled={u.id === currentUser?.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-16 text-center text-muted-foreground text-sm italic">
            No accounts found matching "{searchQuery}"
          </div>
        )}
      </div>

      {currentUser?.role === 'super_admin' && (
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-primary">System Security</p>
              <p className="text-xs text-muted-foreground leading-relaxed">As a Super Admin, you have authority to manage all system tiers. Use deletion with caution.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity whitespace-nowrap">
            Audit Security Logs
          </button>
        </div>
      )}
    </div>
  );
}

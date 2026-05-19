import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function RoleGuard({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/login");
    } else if (isInitialized && user) {
      const currentRole = user.active_role || user.role;
      if (!allowedRoles.includes(currentRole)) {
        // Redirect to their correct dashboard based on current active role state
        if (["super_admin", "auditor", "support"].includes(currentRole)) navigate("/dashboard/admin");
        else if (currentRole === "vendor") navigate("/dashboard/vendor");
        else navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, allowedRoles, navigate, isInitialized]);

  if (!isInitialized || (isAuthenticated && !user)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

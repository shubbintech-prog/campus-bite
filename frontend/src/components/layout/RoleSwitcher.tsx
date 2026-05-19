import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeftRight, Store, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RoleSwitcher: React.FC = () => {
  const { user, token, setAuth } = useAuthStore();
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const isHybrid = user.roles && user.roles.includes("student") && user.roles.includes("vendor");
  const isVendorOnly = user.roles && user.roles.includes("vendor") && !user.roles.includes("student");

  const handleRoleToggle = async () => {
    if (!isHybrid) return;
    setSwitching(true);

    const targetRole = user.active_role === "student" ? "vendor" : "student";

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://campus-bite-ndg1.onrender.com"}/api/auth/switch-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role: targetRole }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to switch role");

      // Update state
      setAuth({ ...user, active_role: data.active_role }, token!);
      window.location.reload(); // Refresh to dynamically rebuild navigation pathways
    } catch (err) {
      console.error("Error switching role:", err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isHybrid ? (
        <button
          onClick={handleRoleToggle}
          disabled={switching}
          className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-700 text-indigo-400 hover:text-indigo-300 font-semibold px-4 py-2 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg text-xs"
        >
          {switching ? (
            <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
          ) : (
            <ArrowLeftRight className="w-4 h-4" />
          )}
          {user.active_role === "student" ? "Switch to Seller" : "Switch to Buyer"}
        </button>
      ) : !isVendorOnly && user.role !== "admin" && (
        <button
          onClick={() => navigate("/become-seller")}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold px-4.5 py-2 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-md shadow-indigo-600/20 text-xs"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-indigo-200" />
          Start Selling
        </button>
      )}
    </div>
  );
};

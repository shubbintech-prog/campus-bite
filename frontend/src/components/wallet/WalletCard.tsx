import { Wallet, Plus, ArrowUpRight, History } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet-api";
import { useState } from "react";
import { useDeposit } from "@/hooks/use-wallet-api";
import { toast } from "sonner";

export default function WalletCard() {
  const { data: wallet, isLoading } = useWallet();
  const deposit = useDeposit();
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    deposit.mutate({ amount: numAmount, reference: "DEP-" + Date.now() }, {
      onSuccess: () => {
        toast.success(`₦${numAmount.toLocaleString()} deposited successfully!`);
        setShowDeposit(false);
        setAmount("");
      }
    });
  };

  if (isLoading) return <div className="h-32 bg-card rounded-2xl animate-pulse" />;

  const balance = parseFloat(wallet?.balance || "0");

  return (
    <div className="bg-primary text-primary-foreground rounded-2xl p-5 shadow-lg shadow-primary/20 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <button 
            onClick={() => setShowDeposit(!showDeposit)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors backdrop-blur-md"
          >
            <Plus className="w-3.5 h-3.5" /> Fund Wallet
          </button>
        </div>

        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Foodie Balance</p>
          <p className="text-3xl font-display font-bold mt-1">₦{balance.toLocaleString()}</p>
        </div>

        {showDeposit && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">₦</span>
                <input 
                  type="number" 
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:bg-white/20 transition-all placeholder:text-white/30"
                />
              </div>
              <button 
                onClick={handleDeposit}
                disabled={deposit.isPending}
                className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                {deposit.isPending ? "..." : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Building, RefreshCw } from "lucide-react";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export default function SimulatePaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount") || "0";
  const reference = searchParams.get("reference") || "";

  const [activeTab, setActiveTab] = useState<"card" | "transfer" | "ussd">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const formattedAmount = parseFloat(amount).toLocaleString();

  const handleSimulateSuccess = async () => {
    setIsProcessing(true);
    try {
      // Small simulated latency for authentic feeling
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await apiClient.post("/payments/simulate-success", {
        order_id: orderId,
        reference: reference,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Payment successful!");
        setTimeout(() => {
          navigate(`/orders/${orderId}/tracking`);
        }, 2500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment simulation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
        {/* Header Branding */}
        <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-tight text-white">Campus Bites Secure</h2>
              <p className="text-[10px] text-slate-400">Sandbox Payment Portal</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Amount Due</span>
            <span className="font-display font-extrabold text-lg text-emerald-400">₦{formattedAmount}</span>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-white">Payment Authorized</h3>
            <p className="mt-2 text-sm text-slate-400">Your mock transaction has been captured successfully.</p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Ref: {reference}</p>
            <div className="mt-8 flex items-center gap-2 text-xs text-indigo-400 animate-pulse font-medium">
              <span>Redirecting to Order Tracking</span>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
          </div>
        ) : (
          <div>
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/20">
              <button
                onClick={() => setActiveTab("card")}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "card"
                    ? "border-indigo-500 text-indigo-400 bg-slate-800/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Card
              </button>
              <button
                onClick={() => setActiveTab("transfer")}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "transfer"
                    ? "border-indigo-500 text-indigo-400 bg-slate-800/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Transfer
              </button>
              <button
                onClick={() => setActiveTab("ussd")}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "ussd"
                    ? "border-indigo-500 text-indigo-400 bg-slate-800/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                USSD
              </button>
            </div>

            <div className="p-6">
              {/* Card tab content */}
              {activeTab === "card" && (
                <div className="space-y-4">
                  {/* Premium Credit Card Mockup */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 border border-indigo-600/30 p-5 shadow-lg flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-7 bg-amber-500/20 rounded-md border border-amber-500/30 flex items-center justify-center">
                        <div className="w-6 h-4 bg-amber-500/30 rounded" />
                      </div>
                      <span className="font-display font-extrabold text-sm tracking-widest text-slate-300">VISA</span>
                    </div>
                    <div>
                      <div className="font-mono text-sm tracking-widest text-white/90">
                        {cardNumber || "••••  ••••  ••••  ••••"}
                      </div>
                      <div className="flex justify-between mt-4">
                        <div>
                          <span className="text-[8px] text-white/50 block uppercase tracking-wider">Card Holder</span>
                          <span className="font-display font-bold text-[10px] text-white uppercase tracking-wider">
                            {cardName || "YOUR NAME"}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-[8px] text-white/50 block uppercase tracking-wider">Expires</span>
                            <span className="font-mono text-[10px] text-white">{cardExpiry || "MM/YY"}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-white/50 block uppercase tracking-wider">CVV</span>
                            <span className="font-mono text-[10px] text-white">{cardCvv || "•••"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form inputs */}
                  <div className="space-y-3 mt-4">
                    <div className="grid grid-cols-1 gap-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Card Number</label>
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCardNumber(val);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expiration Date</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length > 2) {
                              val = val.substring(0, 2) + "/" + val.substring(2, 4);
                            }
                            setCardExpiry(val);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Security Code (CVV)</label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer tab content */}
              {activeTab === "transfer" && (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3">
                    <p className="text-[11px] text-slate-400">
                      Transfer exactly <strong className="text-white">₦{formattedAmount}</strong> to the mock virtual bank details below to authorize:
                    </p>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Bank Name</span>
                        <span className="font-semibold text-white">Campus Bites Virtual Bank</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Account Number</span>
                        <span className="font-mono font-semibold text-emerald-400">9028374829</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Account Name</span>
                        <span className="font-semibold text-white">CB Sandbox Payment</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 italic text-center">
                      *Clicking the simulate button triggers standard instant receipt verification.
                    </div>
                  </div>
                </div>
              )}

              {/* USSD tab content */}
              {activeTab === "ussd" && (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3 text-center">
                    <p className="text-xs text-slate-350">
                      Dial the code below on your mobile device associated with your student profile to confirm:
                    </p>
                    <div className="py-4 bg-slate-900 rounded-xl">
                      <span className="font-mono font-extrabold text-xl text-indigo-400 tracking-wider">
                        *737*1*9*9028#
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Standard transaction fees do not apply to this simulation.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleSimulateSuccess}
                disabled={isProcessing}
                className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all rounded-2xl text-xs font-display font-extrabold tracking-wider uppercase text-white shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Simulation...
                  </>
                ) : (
                  <>
                    Simulate Payment Succeeded
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-550 font-medium tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                100% Secure Sandbox Connection
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, Wallet, Smartphone, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCreateOrder, useInitializePayment } from "@/hooks/use-order-api";
import { useWallet, usePayWithWallet } from "@/hooks/use-wallet-api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartStore((state) => state.subtotal());
  
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  const createOrder = useCreateOrder();
  const initializePayment = useInitializePayment();
  const { data: wallet } = useWallet();
  const payWithWallet = usePayWithWallet();

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const totalAmount = subtotal + 100;

    if (paymentMethod === "wallet") {
      if (!wallet || parseFloat(wallet.balance) < totalAmount) {
        toast.error("Insufficient wallet balance. Please fund your wallet.");
        return;
      }
    }

    const vendorId = items[0].vendorId;
    
    const orderData = {
      vendor_id: vendorId,
      items: items.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: totalAmount
    };

    createOrder.mutate(orderData, {
      onSuccess: (data) => {
        setOrderId(data.id);
        if (paymentMethod === "paystack") {
          initializePayment.mutate({ orderId: data.id, amount: totalAmount }, {
            onSuccess: (payData) => {
              window.location.href = payData.authorization_url;
            },
            onError: () => {
              setConfirmed(true);
            }
          });
        } else if (paymentMethod === "wallet") {
          payWithWallet.mutate({ orderId: data.id, amount: totalAmount }, {
            onSuccess: () => {
              setConfirmed(true);
              clearCart();
              toast.success("Paid with Foodie Wallet!");
            },
            onError: (err: any) => {
              toast.error(err.response?.data?.message || "Wallet payment failed");
            }
          });
        } else {
          setConfirmed(true);
          clearCart();
        }
      }
    });
  };

  if (confirmed) {
    return (
      <div className="container py-16 max-w-md text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="font-display text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your order #{orderId || "ORD-005"} has been placed successfully.</p>
        <Link to={`/orders/${orderId}/tracking`} className="mt-6 inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity">
          Track Order
        </Link>
      </div>
    );
  }

  const methods = [
    { id: "wallet", label: "Foodie Wallet (₦" + (wallet?.balance || "0").toLocaleString() + ")", icon: Wallet },
    { id: "paystack", label: "Pay with Paystack", icon: CreditCard },
    { id: "transfer", label: "Bank Transfer", icon: Smartphone },
    { id: "pos", label: "Pay on Pickup", icon: Smartphone },
  ];

  return (
    <div className="container py-6 md:py-10 max-w-2xl animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Link to="/vendors" className="text-primary hover:underline mt-2 inline-block">Browse vendors</Link>
        </div>
      ) : (
        <>
          {/* Order Summary */}
          <div className="rounded-xl bg-card card-shadow p-4 mb-4">
            <h2 className="font-display font-semibold text-sm mb-3">Order Summary</h2>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm py-1 text-muted-foreground">
              <span>Service fee</span>
              <span>₦100</span>
            </div>
            <div className="flex justify-between font-display font-bold mt-2 pt-2 border-t border-border">
              <span>Total</span>
              <span>₦{(subtotal + 100).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl bg-card card-shadow p-4 mb-6">
            <h2 className="font-display font-semibold text-sm mb-3">Payment Method</h2>
            <div className="space-y-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  disabled={createOrder.isPending}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-sm ${
                    paymentMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                >
                  <m.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={createOrder.isPending || initializePayment.isPending}
            className="w-full py-3.5 bg-accent text-accent-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {(createOrder.isPending || initializePayment.isPending) && <Loader2 className="w-5 h-5 animate-spin" />}
            {createOrder.isPending ? "Placing Order..." : initializePayment.isPending ? "Initializing Payment..." : `Confirm Order — ₦${(subtotal + 100).toLocaleString()}`}
          </button>
        </>
      )}
    </div>
  );
}

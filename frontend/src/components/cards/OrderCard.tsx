const statusStyles: Record<string, string> = {
  pending: "bg-primary/10 text-primary",
  preparing: "bg-warning/10 text-warning",
  ready: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

interface OrderCardProps {
  order: {
    id: number | string;
    vendor_name?: string;
    student_name?: string;
    order_status: string;
    total_price: string | number;
    created_at?: string;
    items?: { name: string; quantity: number; price: number | string }[];
  };
  showStudent?: boolean;
}

export default function OrderCard({ order, showStudent }: OrderCardProps) {
  const status = order.order_status?.toLowerCase();
  
  // Safely parse total price
  const totalPrice = typeof order.total_price === 'string' 
    ? (parseFloat(order.total_price) || 0) 
    : (order.total_price ?? 0);
    
  // Safely parse order ID
  const orderIdText = order.id 
    ? (typeof order.id === 'string' && order.id.length > 8 ? `#${order.id.slice(0, 8)}` : `#${order.id}`)
    : "#unknown";

  return (
    <div className="rounded-xl bg-card border border-border p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display font-semibold text-sm text-foreground">Order {orderIdText}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{order.vendor_name || "Vendor"}</p>
          {showStudent && order.student_name && (
            <p className="text-xs text-muted-foreground">Student: {order.student_name}</p>
          )}
          {order.created_at && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <span className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize ${statusStyles[status] || ""}`}>
          {status}
        </span>
      </div>
      
      {order.items && order.items.length > 0 && (
        <div className="mt-3 space-y-1">
          {order.items.map((item, i) => {
            const itemPrice = typeof item.price === 'string' 
              ? (parseFloat(item.price) || 0) 
              : (item.price ?? 0);
            const itemQuantity = item.quantity ?? 1;
            const itemTotal = itemPrice * itemQuantity;
            
            return (
              <div key={i} className="flex justify-between text-xs text-muted-foreground">
                <span>{itemQuantity}x {item.name}</span>
                <span>₦{itemTotal.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-border flex justify-between text-sm">
        <span className="text-muted-foreground font-medium">Total Amount</span>
        <span className="font-display font-bold text-primary">₦{totalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
}

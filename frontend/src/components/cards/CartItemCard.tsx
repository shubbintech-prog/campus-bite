import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onUpdateQty, onRemove }: CartItemCardProps) {
  return (
    <div className="flex gap-3 rounded-xl bg-card card-shadow p-3">
      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-sm text-foreground truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">₦{item.price.toLocaleString()}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</span>
            <button onClick={() => onRemove(item.id)} className="text-destructive hover:text-destructive/80 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

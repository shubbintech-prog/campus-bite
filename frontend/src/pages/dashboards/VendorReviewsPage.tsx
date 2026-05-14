import { Star } from "lucide-react";

const reviews = [
  { id: 1, student: "Adebayo J.", rating: 5, comment: "Best jollof rice on campus! Always fresh and well seasoned.", date: "Mar 12, 2026" },
  { id: 2, student: "Chioma O.", rating: 4, comment: "Nice food but delivery took a bit long today.", date: "Mar 11, 2026" },
  { id: 3, student: "Emeka N.", rating: 5, comment: "The fried rice is amazing. Large portions too!", date: "Mar 10, 2026" },
  { id: 4, student: "Fatima B.", rating: 3, comment: "Food was okay but could use more pepper.", date: "Mar 9, 2026" },
];

export default function VendorReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Customer Reviews</h1>

      <div className="rounded-xl bg-card card-shadow p-5 mb-6 flex items-center gap-6">
        <div className="text-center">
          <p className="font-display text-4xl font-bold">{avg}</p>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-4 h-4 ${i <= Math.round(Number(avg)) ? "fill-warning text-warning" : "text-border"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl bg-card card-shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {r.student.charAt(0)}
                </div>
                <span className="font-medium text-sm">{r.student}</span>
              </div>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? "fill-warning text-warning" : "text-border"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

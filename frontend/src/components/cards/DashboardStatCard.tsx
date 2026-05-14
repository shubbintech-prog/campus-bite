interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function DashboardStatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={`glass-card rounded-3xl p-6 md:p-7 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
            trendUp ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
        <p className="font-display text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

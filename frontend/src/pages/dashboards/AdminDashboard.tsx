import { Users, Store, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import DashboardStatCard from "@/components/cards/DashboardStatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const dailyOrders = [
  { day: "Mon", orders: 45, revenue: 120000 },
  { day: "Tue", orders: 52, revenue: 156000 },
  { day: "Wed", orders: 49, revenue: 147000 },
  { day: "Thu", orders: 63, revenue: 189000 },
  { day: "Fri", orders: 78, revenue: 234000 },
  { day: "Sat", orders: 35, revenue: 105000 },
  { day: "Sun", orders: 28, revenue: 84000 },
];

const vendorShare = [
  { name: "Mama's Kitchen", value: 35 },
  { name: "Tasty Bites", value: 25 },
  { name: "Campus Grills", value: 20 },
  { name: "Others", value: 20 },
];

const COLORS = ["hsl(157,61%,31%)", "hsl(30,100%,50%)", "hsl(142,71%,45%)", "hsl(218,11%,46%)"];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const roleTitle = user?.role?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "Admin";

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-1">
            Welcome back, <span className="text-gradient">{user?.full_name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground text-sm">Here's what's happening at Campus Bites today.</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-1.5 rounded-2xl border border-border shadow-sm">
          <div className="px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-xs font-semibold border border-primary/10">
            {roleTitle}
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard title="Total Students" value="1,248" icon={Users} trend="+5.2%" trendUp className="premium-shadow hover:scale-[1.02] transition-transform" />
        <DashboardStatCard title="Active Vendors" value="12" icon={Store} trend="+2 new" trendUp className="premium-shadow hover:scale-[1.02] transition-transform" />
        <DashboardStatCard title="Weekly Orders" value="3,459" icon={ShoppingBag} trend="+12%" trendUp className="premium-shadow hover:scale-[1.02] transition-transform" />
        <DashboardStatCard title="Total Revenue" value="₦2.48M" icon={DollarSign} trend="+8.4%" trendUp className="premium-shadow hover:scale-[1.02] transition-transform" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-bold text-lg">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Daily performance tracking</p>
            </div>
            <select className="bg-muted/50 border-none rounded-xl text-xs font-medium px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyOrders}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(157,61%,31%)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(157,61%,31%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(218,11%,46%)" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(218,11%,46%)" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(157,61%,31%)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart/Insight */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col">
          <h3 className="font-display font-bold text-lg mb-2">Vendor Distribution</h3>
          <p className="text-xs text-muted-foreground mb-8">Order volume by outlet</p>
          
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vendorShare} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                  {vendorShare.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {vendorShare.map((v, i) => (
              <div key={v.name} className="flex flex-col gap-1 p-3 rounded-2xl bg-muted/30 border border-muted-foreground/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{v.name.split(' ')[0]}</span>
                </div>
                <span className="text-lg font-bold">{v.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Recent Activity/Summary */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg">System Insights</h3>
          <button className="text-xs font-semibold text-primary hover:underline">View All Notifications</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl border border-border bg-muted/20 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Peak Hour Alert</p>
              <p className="text-xs text-muted-foreground leading-relaxed">System activity is currently 45% higher than usual. Optimal server performance maintained.</p>
            </div>
          </div>
          <Link to="/dashboard/admin/applications" className="p-4 rounded-2xl border border-border bg-muted/20 flex gap-4 items-start hover:bg-muted/40 transition-colors text-left w-full">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">New Applications</p>
              <p className="text-xs text-muted-foreground leading-relaxed">You have new vendor applications awaiting review in the management portal.</p>
            </div>
          </Link>
          <div className="p-4 rounded-2xl border border-border bg-muted/20 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">User Engagement</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Student registrations have increased by 15% following the latest campus campaign.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

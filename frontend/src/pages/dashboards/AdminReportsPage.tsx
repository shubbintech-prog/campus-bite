import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const dailyData = [
  { day: "Mon", orders: 45, revenue: 67500 },
  { day: "Tue", orders: 52, revenue: 78000 },
  { day: "Wed", orders: 49, revenue: 73500 },
  { day: "Thu", orders: 63, revenue: 94500 },
  { day: "Fri", orders: 78, revenue: 117000 },
  { day: "Sat", orders: 35, revenue: 52500 },
  { day: "Sun", orders: 28, revenue: 42000 },
];

const topMeals = [
  { name: "Jollof Rice", orders: 156 },
  { name: "Shawarma", orders: 123 },
  { name: "Fried Rice", orders: 98 },
  { name: "Suya", orders: 87 },
  { name: "Puff Puff", orders: 76 },
];

export default function AdminReportsPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Reports & Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-card card-shadow p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(157,61%,31%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-card card-shadow p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(30,100%,50%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-card card-shadow p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Popular Meals</h3>
        <div className="space-y-3">
          {topMeals.map((meal, i) => (
            <div key={meal.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{meal.name}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(meal.orders / topMeals[0].orders) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-12 text-right">{meal.orders}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

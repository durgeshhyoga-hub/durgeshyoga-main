import { Eye, Users, Monitor, Globe, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/usePageViews";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F"];

export default function Analytics() {
  const {
    isLoading,
    todayViews,
    weekViews,
    monthViews,
    totalViews,
    uniqueVisitors,
    uniqueVisitorsToday,
    deviceCounts,
    browserCounts,
    pageCounts,
    viewsByDay,
    recentViews,
  } = useAnalytics();

  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(browserCounts).map(([name, value]) => ({ name, value }));
  const pageData = Object.entries(pageCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Website traffic and visitor insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Today</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : todayViews}</p>
          <p className="text-xs text-muted-foreground mt-1">{uniqueVisitorsToday} unique</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : weekViews}</p>
          <p className="text-xs text-muted-foreground mt-1">page views</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : monthViews}</p>
          <p className="text-xs text-muted-foreground mt-1">page views</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Visitors</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : uniqueVisitors}</p>
          <p className="text-xs text-muted-foreground mt-1">unique visitors</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Views Chart */}
        <div className="rounded-xl bg-card border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4">Views (Last 7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsByDay}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) => format(new Date(value), "MMMM d, yyyy")}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-xl bg-card border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4">Device Types</h2>
          <div className="h-64 flex items-center justify-center">
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Top Pages</h2>
          </div>
          <div className="divide-y divide-border">
            {pageData.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No page views yet</div>
            ) : (
              pageData.map((page, index) => (
                <div key={page.name} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{page.name}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{page.value} views</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Browsers</h2>
          </div>
          <div className="divide-y divide-border">
            {browserData.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No data yet</div>
            ) : (
              browserData.slice(0, 5).map((browser) => (
                <div key={browser.name} className="p-4 flex items-center justify-between">
                  <span className="text-sm text-foreground">{browser.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(browser.value / totalViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                      {browser.value}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

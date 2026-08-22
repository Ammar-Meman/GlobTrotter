import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

const CATEGORY_COLORS = {
  transport: "#3b82f6",
  stay: "#8b5cf6",
  activity: "#10b981",
  meal: "#f59e0b",
};

const CATEGORY_LABELS = {
  transport: "Transport",
  stay: "Stay",
  activity: "Activities",
  meal: "Meals",
};

export default function BudgetChart({ byCategory, byDay, chartType = "pie", dailyBudgetThreshold }) {
  if (chartType === "pie") {
    const data = Object.entries(byCategory)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: CATEGORY_LABELS[key] || key,
        value,
        color: CATEGORY_COLORS[key] || "#6b7280",
      }));

    if (data.length === 0) {
      return <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">No budget data</div>;
    }

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name}: $${value}`}
              labelLine={false}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value}`, ""]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: "0.75rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="font-medium text-foreground">${entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Bar chart — cost by day
  if (chartType === "bar") {
    const data = (byDay || []).map((d) => ({
      name: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cost: d.cost,
      overBudget: d.overBudget,
    }));

    if (data.length === 0) {
      return <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">No daily data</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
          {dailyBudgetThreshold && (
            <ReferenceLine y={dailyBudgetThreshold} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Budget: $${dailyBudgetThreshold}`, position: "insideTopRight", fontSize: 10, fill: "#ef4444" }} />
          )}
          <Tooltip
            formatter={(value) => [`$${value}`, "Cost"]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
            }}
          />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.overBudget ? "#ef4444" : "#10b981"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

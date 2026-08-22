import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, AlertCircle, IndianRupee, TrendingUp, Calendar, PieChart as PieChartIcon, BarChart3,
} from "lucide-react";
import { Button } from "../components/ui/button";
import BudgetChart from "../components/trip/BudgetChart";
import Navbar from "../components/Navbar";
import api from "../lib/api";

export default function Budget() {
  const { id: tripId } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartView, setChartView] = useState("pie"); // "pie" | "bar"

  useEffect(() => {
    fetchBudget();
  }, [tripId]);

  const fetchBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/trips/${tripId}/budget`);
      setBudget(data);
    } catch (err) {
      setError(err.message || "Failed to load budget");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading / Error ──────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading budget…</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchBudget}>Retry</Button>
        </div>
      </>
    );
  }

  if (!budget) return null;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/trips/${tripId}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Trip Budget</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your spending by category and day</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <SummaryCard icon={IndianRupee} label="Total Cost" value={`₹${budget.totalCost.toFixed(0)}`} color="text-emerald-600 bg-emerald-500/10" />
          <SummaryCard icon={TrendingUp} label="Avg / Day" value={`$${budget.averagePerDay}`} color="text-blue-600 bg-blue-500/10" />
          <SummaryCard icon={Calendar} label="Days" value={budget.byDay.length} color="text-purple-600 bg-purple-500/10" />
          <SummaryCard icon={AlertCircle} label="Daily Budget" value={`$${budget.dailyBudgetThreshold}`} color="text-amber-600 bg-amber-500/10" />
        </div>

        {/* Chart Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={chartView === "pie" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setChartView("pie")}
          >
            <PieChartIcon className="w-3.5 h-3.5" /> By Category
          </Button>
          <Button
            variant={chartView === "bar" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setChartView("bar")}
          >
            <BarChart3 className="w-3.5 h-3.5" /> By Day
          </Button>
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
          <BudgetChart
            byCategory={budget.byCategory}
            byDay={budget.byDay}
            chartType={chartView}
            dailyBudgetThreshold={budget.dailyBudgetThreshold}
          />
        </div>

        {/* Category Breakdown Table */}
        <div className="mt-8 rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border/40">
            <h2 className="font-semibold text-sm text-foreground">Category Breakdown</h2>
          </div>
          <div className="divide-y divide-border/30">
            {Object.entries(budget.byCategory).map(([cat, cost]) => (
              <div key={cat} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm capitalize">{cat}</span>
                </div>
                <div className="text-sm font-medium">${cost.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground w-16 text-right">
                  {budget.totalCost > 0 ? ((cost / budget.totalCost) * 100).toFixed(0) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold text-foreground mt-0.5">{value}</div>
    </div>
  );
}
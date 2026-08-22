import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Luggage,
  Activity,
  MapPin,
  TrendingUp,
  RefreshCw,
  Clock,
  Compass,
  ArrowUpRight,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const data = await api.get("/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setError(err.message || "Failed to load platform analytics. Ensure you have administrator privileges.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalUsers = stats?.totalUsers || 0;
  const totalTrips = stats?.totalTrips || 0;
  const activeUsers = stats?.activeUsersLast7Days || 0;
  const avgTripsPerUser = totalUsers > 0 ? (totalTrips / totalUsers).toFixed(1) : 0;
  const topCities = stats?.topCities || [];
  const topActivities = stats?.topActivities || [];

  const maxCityCount = topCities.length > 0 ? Math.max(...topCities.map((c) => c.count)) : 1;
  const maxActivityCount = topActivities.length > 0 ? Math.max(...topActivities.map((a) => a.count)) : 1;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Platform Admin Console</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Live Metrics
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Monitor real-time user registrations, itinerary creation volume, and destination discovery trends.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadStats(true)}
              disabled={loading || refreshing}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
            </Button>

            <Button size="sm" onClick={() => navigate("/dashboard")} className="text-xs">
              Go to App
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Analytics KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-border/50 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Total Users
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-3xl font-black">{loading ? "-" : totalUsers}</h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>Registered travel planners</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Total Itineraries
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Luggage className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-3xl font-black">{loading ? "-" : totalTrips}</h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Multi-city journeys created</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Active (Last 7 Days)
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-3xl font-black">{loading ? "-" : activeUsers}</h3>
                <p className="text-[11px] text-muted-foreground">
                  Active travelers in the past week
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Avg. Trips / User
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-3xl font-black">{loading ? "-" : avgTripsPerUser}</h3>
                <p className="text-[11px] text-muted-foreground">
                  High platform engagement index
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Rankings Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Destination Cities */}
          <Card className="border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Top Destination Cities</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground font-medium">By stop occurrence</span>
              </div>
              <CardDescription>Most frequently planned stops across all user travel itineraries.</CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-3 py-2 animate-pulse">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-10 bg-muted/60 rounded-xl" />
                  ))}
                </div>
              ) : topCities.length > 0 ? (
                <div className="space-y-4">
                  {topCities.map((city, idx) => {
                    const percentage = Math.round((city.count / maxCityCount) * 100);
                    return (
                      <div key={city.cityName} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-foreground">{city.cityName}</span>
                          </div>
                          <span className="text-muted-foreground">{city.count} {city.count === 1 ? "Stop" : "Stops"}</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">No stop data collected yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Top Activities */}
          <Card className="border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <CardTitle className="text-lg">Top Planned Activities</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground font-medium">By booking count</span>
              </div>
              <CardDescription>Most popular experiences added by travelers to their daily schedules.</CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-3 py-2 animate-pulse">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-10 bg-muted/60 rounded-xl" />
                  ))}
                </div>
              ) : topActivities.length > 0 ? (
                <div className="space-y-4">
                  {topActivities.map((act, idx) => {
                    const percentage = Math.round((act.count / maxActivityCount) * 100);
                    return (
                      <div key={act.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-foreground line-clamp-1 max-w-[240px] sm:max-w-xs">{act.name}</span>
                          </div>
                          <span className="text-muted-foreground shrink-0">{act.count} {act.count === 1 ? "time" : "times"}</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">No activity data collected yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System & Cloud Service Health Strip */}
        <Card className="border-border/50 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Service Status & Cloud Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="font-semibold text-foreground">PostgreSQL Database</p>
                  <p className="text-[11px] text-muted-foreground">Prisma ORM Connected</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="font-semibold text-foreground">Cloudinary Media CDN</p>
                  <p className="text-[11px] text-muted-foreground">Image Uploads Active</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="font-semibold text-foreground">Discovery Geo-APIs</p>
                  <p className="text-[11px] text-muted-foreground">Mapbox & Geoapify Proxy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
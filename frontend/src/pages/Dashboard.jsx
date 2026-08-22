import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Plane,
  MapPin,
  Calendar,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  Luggage,
  ShieldCheck,
  Plus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import useTripStore from "@/store/tripStore";
import useLanguageStore from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const POPULAR_DESTINATIONS = [
  {
    name: "Agra",
    country: "India",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    popularity: "99% Match",
    tag: "Historic & Majestic",
  },
  {
    name: "Jaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    popularity: "96% Match",
    tag: "Palaces & Culture",
  },
  {
    name: "Kerala",
    country: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
    cost: "₹₹",
    popularity: "94% Match",
    tag: "Backwaters & Nature",
  },
  {
    name: "Varanasi",
    country: "India",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80",
    cost: "₹",
    popularity: "93% Match",
    tag: "Spiritual & Ancient",
  },
  {
    name: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    popularity: "91% Match",
    tag: "Beaches & Nightlife",
  },
  {
    name: "Mumbai",
    country: "India",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    popularity: "95% Match",
    tag: "Metropolis & Bollywood",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trips, fetchTrips, loading } = useTripStore();
  const t = useLanguageStore((state) => state.t);

  useEffect(() => {
    fetchTrips().catch((err) => console.error("Error loading trips:", err));
  }, [fetchTrips]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const getDurationDays = (start, end) => {
    if (!start || !end) return 1;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Compute summary stats
  const totalTrips = trips.length;
  const totalStops = trips.reduce((acc, t) => acc + (t.stopCount || 0), 0);
  const totalDays = trips.reduce((acc, t) => acc + getDurationDays(t.startDate, t.endDate), 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-r from-primary/15 via-primary/5 to-background p-6 sm:p-10 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GlobeTrotter India</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("dashboardGreeting")}, {user?.name ? user.name.split(" ")[0] : "Traveler"}! ✈️
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              {t("dashboardSubtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={() => navigate("/trips/new")} className="gap-2 shadow-sm font-semibold">
                <PlusCircle className="w-4 h-4" />
                <span>{t("createNewTrip")}</span>
              </Button>
              <Button variant="outline" onClick={() => navigate("/cities")} className="gap-2">
                <Compass className="w-4 h-4" />
                <span>{t("exploreCities")}</span>
              </Button>
            </div>
          </div>

          {/* Background Decorative Plane Graphic */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none hidden lg:block">
            <Plane className="w-80 h-80 text-primary transform -rotate-12" />
          </div>
        </div>

        {/* Quick Analytics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/40 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Luggage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("totalTrips")}</p>
                <h3 className="text-2xl font-bold">{loading ? "-" : totalTrips}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("stops")}</p>
                <h3 className="text-2xl font-bold">{loading ? "-" : totalStops}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("totalDays")}</p>
                <h3 className="text-2xl font-bold">{loading ? "-" : totalDays}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Trips Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t("recentTrips")}</h2>
              <p className="text-xs text-muted-foreground">{t("dashboardSubtitle")}</p>
            </div>
            {trips.length > 0 && (
              <Link
                to="/trips"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>{t("viewAllTrips")} ({trips.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="animate-pulse border-border/40">
                  <div className="h-44 bg-muted/60 rounded-t-xl" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-muted/80 rounded w-2/3" />
                    <div className="h-4 bg-muted/50 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => {
                const duration = getDurationDays(trip.startDate, trip.endDate);
                return (
                  <Card
                    key={trip.id}
                    className="overflow-hidden border-border/50 group hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Trip Card Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        <img
                          src={
                            trip.coverPhoto ||
                            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80"
                          }
                          alt={trip.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                            {trip.stopCount || 0} {trip.stopCount === 1 ? "Stop" : "Stops"}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                            {duration} {duration === 1 ? "Day" : "Days"}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <CardContent className="p-5 space-y-2.5">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                          {trip.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>
                            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                          </span>
                        </div>

                        {trip.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                            {trip.description}
                          </p>
                        )}
                      </CardContent>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-2 border-t border-border/40 mt-3 pt-3">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 text-xs gap-1"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        <span>View Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => navigate(`/trips/${trip.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-dashed border-2 border-border/80 bg-card/40 p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Plane className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-bold text-lg">No trips created yet</h3>
                <p className="text-xs text-muted-foreground">
                  Your travel passport is currently empty. Design your next adventure in minutes with our interactive route builder.
                </p>
              </div>
              <Button onClick={() => navigate("/trips/new")} className="gap-2 font-medium">
                <Plus className="w-4 h-4" />
                Create Your First Trip
              </Button>
            </Card>
          )}
        </div>

        {/* Curated Global Destinations */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Popular Destinations</h2>
              <p className="text-xs text-muted-foreground">Get inspired by top traveler-favorite cities</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/cities")} className="text-xs gap-1">
              <span>View City Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                className="group relative rounded-2xl overflow-hidden border border-border/60 bg-card hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() =>
                  navigate(`/trips/new?name=${encodeURIComponent(dest.name + " Gateway")}&city=${encodeURIComponent(dest.name)}`)
                }
              >
                <div className="h-32 w-full overflow-hidden bg-muted">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-0.5">
                  <h4 className="font-bold text-sm tracking-tight">{dest.name}</h4>
                  <p className="text-[10px] text-white/80">{dest.country}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    + Plan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Luggage,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Compass,
  AlertTriangle,
  Loader2,
  X,
  Plane,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TripCard from "@/components/TripCard";
import useTripStore from "@/store/tripStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function MyTrips() {
  const navigate = useNavigate();
  const { trips, fetchTrips, deleteTrip, loading } = useTripStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'upcoming' | 'inprogress' | 'completed'
  const [sortBy, setSortBy] = useState("departure-asc"); // 'departure-asc' | 'departure-desc' | 'created-desc' | 'stops-desc'
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTrips().catch((err) => console.error("Error fetching trips:", err));
  }, [fetchTrips]);

  // Compute status helper
  const getStatus = (start, end) => {
    if (!start || !end) return "upcoming";
    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "inprogress";
    return "completed";
  };

  // Status counts
  const counts = useMemo(() => {
    const res = { all: trips.length, upcoming: 0, inprogress: 0, completed: 0 };
    trips.forEach((t) => {
      const st = getStatus(t.startDate, t.endDate);
      if (res[st] !== undefined) res[st]++;
    });
    return res;
  }, [trips]);

  // Filter & Sort Logic
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        // Status filter
        if (statusFilter !== "all") {
          const st = getStatus(trip.startDate, trip.endDate);
          if (st !== statusFilter) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = trip.name?.toLowerCase().includes(q);
          const descMatch = trip.description?.toLowerCase().includes(q);
          if (!nameMatch && !descMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "departure-asc") {
          return new Date(a.startDate || 0) - new Date(b.startDate || 0);
        }
        if (sortBy === "departure-desc") {
          return new Date(b.startDate || 0) - new Date(a.startDate || 0);
        }
        if (sortBy === "created-desc") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "stops-desc") {
          return (b.stopCount || 0) - (a.stopCount || 0);
        }
        return 0;
      });
  }, [trips, statusFilter, searchQuery, sortBy]);

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete.id);
      setTripToDelete(null);
    } catch (err) {
      console.error("Failed to delete trip:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">My Trips</h1>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review, edit, and organize all your upcoming and past global journeys.
            </p>
          </div>

          <Button onClick={() => navigate("/trips/new")} className="gap-2 shadow-sm font-semibold shrink-0">
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </Button>
        </div>

        {/* Search, Filter Tabs & Sort Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search trips by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="departure-asc">Departure Date (Earliest First)</option>
                <option value="departure-desc">Departure Date (Latest First)</option>
                <option value="created-desc">Recently Created</option>
                <option value="stops-desc">Most Stops</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Itineraries", count: counts.all },
              { id: "upcoming", label: "Upcoming", count: counts.upcoming },
              { id: "inprogress", label: "In Progress", count: counts.inprogress },
              { id: "completed", label: "Past Journeys", count: counts.completed },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trips Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse border-border/40 overflow-hidden">
                <div className="h-48 bg-muted/60" />
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 bg-muted/80 rounded w-2/3" />
                  <div className="h-4 bg-muted/50 rounded w-1/2" />
                  <div className="h-8 bg-muted/40 rounded w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={(id) => navigate(`/trips/${id}`)}
                onEdit={(id) => navigate(`/trips/${id}/edit`)}
                onDelete={() => setTripToDelete(trip)}
              />
            ))}
          </div>
        ) : (
          /* Empty / No Results State */
          <Card className="border-dashed border-2 border-border/80 bg-card/40 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Plane className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="font-bold text-lg">
                {searchQuery || statusFilter !== "all" ? "No matching trips found" : "No trips created yet"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search terms or filter settings to find what you're looking for."
                  : "Start planning your next dream adventure! Add cities, discover activities, and keep track of your travel budget."}
              </p>
            </div>

            {searchQuery || statusFilter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            ) : (
              <Button onClick={() => navigate("/trips/new")} className="gap-2 font-medium">
                <Plus className="w-4 h-4" />
                Create Your First Trip
              </Button>
            )}
          </Card>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border/80 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Delete Trip</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">&ldquo;{tripToDelete.name}&rdquo;</strong>? This will remove all
              associated stops, activities, and budget records.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTripToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete Trip"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Clock, DollarSign, Copy, ExternalLink,
  Loader2, AlertCircle, Globe, ChevronRight, LogIn,
} from "lucide-react";
import { Button } from "../components/ui/button";
import ActivityCard from "../components/trip/ActivityCard";
import useAuthStore from "../store/authStore";
import api from "../lib/api";

export default function PublicShare() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchPublicTrip();
  }, [shareId]);

  const fetchPublicTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/trips/public/${shareId}`);
      setTrip(data);
    } catch (err) {
      setError(err.message || "Trip not found or not public");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setCopying(true);
    try {
      const copied = await api.post(`/trips/${trip.id}/copy`);
      setCopySuccess(true);
      setTimeout(() => navigate(`/trips/${copied.id}`), 1500);
    } catch (err) {
      console.error("Copy trip failed:", err);
      alert(err.message || "Failed to copy trip");
    } finally {
      setCopying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatDateFull = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const getDayCount = (s, e) => Math.ceil((new Date(e) - new Date(s)) / 86400000);

  function getStopDays(stop) {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const days = [];
    const current = new Date(start);
    while (current < end) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayActivities = (stop.activities || []).filter(
        (a) => a.scheduledAt && a.scheduledAt.slice(0, 10) === dateStr
      );
      days.push({ date: new Date(current), dateStr, activities: dayActivities });
      current.setDate(current.getDate() + 1);
    }
    const assignedIds = new Set(days.flatMap((d) => d.activities.map((a) => a.id)));
    const unassigned = (stop.activities || []).filter((a) => !assignedIds.has(a.id));
    if (unassigned.length > 0 && days.length > 0) days[0].activities.push(...unassigned);
    return days;
  }

  // ── Loading / Error ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading shared trip…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Globe className="w-12 h-12 text-muted-foreground/50" />
        <AlertCircle className="w-6 h-6 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchPublicTrip}>Retry</Button>
        <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">← Back to login</Link>
      </div>
    );
  }

  if (!trip) return null;

  const stops = trip.stops || [];
  const totalActivities = stops.reduce((sum, s) => sum + (s.activities || []).length, 0);
  const totalCost = stops.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Public Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">GlobeTrotter</span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">Shared Trip</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleCopyLink}>
              <ExternalLink className="w-3 h-3" /> Copy Link
            </Button>
            {token ? (
              <Button size="sm" className="gap-1.5 text-xs" onClick={handleCopyTrip} disabled={copying || copySuccess}>
                {copySuccess ? "✓ Copied!" : copying ? <><Loader2 className="w-3 h-3 animate-spin" /> Copying…</> : <><Copy className="w-3.5 h-3.5" /> Copy Trip</>}
              </Button>
            ) : (
              <Button size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/login")}>
                <LogIn className="w-3.5 h-3.5" /> Login to Copy
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Trip Header */}
        {trip.coverPhoto && (
          <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-5">
            <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{trip.name}</h1>
            </div>
          </div>
        )}

        {!trip.coverPhoto && (
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{trip.name}</h1>
        )}

        {trip.description && (
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{trip.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
          <span>{getDayCount(trip.startDate, trip.endDate)} days</span>
          <span>{stops.length} stops</span>
          <span>{totalActivities} activities</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${totalCost.toFixed(0)} est.</span>
        </div>

        {/* Itinerary */}
        <div className="space-y-8">
          {stops.map((stop, stopIdx) => {
            const days = getStopDays(stop);
            return (
              <div key={stop.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                    {stopIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{stop.cityName}</h2>
                      <span className="text-sm text-muted-foreground">{stop.country}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(stop.startDate)} – {formatDate(stop.endDate)} • {getDayCount(stop.startDate, stop.endDate)} days
                    </p>
                  </div>
                </div>

                <div className="space-y-3 ml-5 pl-6 border-l-2 border-border/40">
                  {days.map((day) => (
                    <div key={day.dateStr} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                      <div className="pb-2">
                        <h3 className="text-sm font-semibold text-foreground mb-2">
                          {formatDateFull(day.date)}
                        </h3>
                        {day.activities.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">No activities</p>
                        ) : (
                          <div className="space-y-2">
                            {day.activities.map((act) => (
                              <ActivityCard key={act.id} activity={act} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {stopIdx < stops.length - 1 && (
                  <div className="flex items-center justify-center my-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 py-1.5 rounded-full bg-secondary">
                      <ChevronRight className="w-3 h-3" /> Next: {stops[stopIdx + 1].cityName}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
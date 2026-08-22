import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Calendar, Clock, DollarSign, Pencil, ArrowLeft,
  Loader2, AlertCircle, BarChart3, Share2, ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import useTripStore from "../store/tripStore";
import ActivityCard from "../components/trip/ActivityCard";
import Navbar from "../components/Navbar";

export default function ItineraryView() {
  const { id: tripId } = useParams();
  const { currentTrip, loading, error, fetchTrip } = useTripStore();

  useEffect(() => {
    if (tripId) fetchTrip(tripId);
  }, [tripId, fetchTrip]);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatDateFull = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const getDayCount = (s, e) => Math.ceil((new Date(e) - new Date(s)) / 86400000);

  // Group activities by day within each stop
  function getStopDays(stop) {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const days = [];
    const current = new Date(start);
    while (current < end) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayActivities = (stop.activities || []).filter((a) => {
        if (!a.scheduledAt) return false;
        return a.scheduledAt.slice(0, 10) === dateStr;
      });
      days.push({ date: new Date(current), dateStr, activities: dayActivities });
      current.setDate(current.getDate() + 1);
    }
    // Add any activities without a matching day to the first day
    const assignedIds = new Set(days.flatMap((d) => d.activities.map((a) => a.id)));
    const unassigned = (stop.activities || []).filter((a) => !assignedIds.has(a.id));
    if (unassigned.length > 0 && days.length > 0) {
      days[0].activities.push(...unassigned);
    }
    return days;
  }

  // ── Loading / Error / Empty ─────────────────────────────
  if (loading && !currentTrip) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading trip…</div>
        </div>
      </>
    );
  }

  if (error && !currentTrip) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchTrip(tripId)}>Retry</Button>
        </div>
      </>
    );
  }

  if (!currentTrip) return null;

  const stops = currentTrip.stops || [];
  const totalActivities = stops.reduce((sum, s) => sum + (s.activities || []).length, 0);
  const totalCost = stops.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* ── Trip Header ──────────────────────────────────── */}
        <div className="mb-8">
          <Link to="/trips" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> My Trips
          </Link>

          {/* Cover Photo */}
          {currentTrip.coverPhoto && (
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-5">
              <img src={currentTrip.coverPhoto} alt={currentTrip.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{currentTrip.name}</h1>
              </div>
            </div>
          )}

          {!currentTrip.coverPhoto && (
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{currentTrip.name}</h1>
          )}

          {currentTrip.description && (
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{currentTrip.description}</p>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(currentTrip.startDate)} – {formatDate(currentTrip.endDate)}</span>
            <span>{getDayCount(currentTrip.startDate, currentTrip.endDate)} days</span>
            <span>{stops.length} stops</span>
            <span>{totalActivities} activities</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${totalCost.toFixed(0)} total</span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 mt-4">
            <Link to={`/trips/${tripId}/edit`}>
              <Button size="sm" className="gap-1.5"><Pencil className="w-3.5 h-3.5" />Edit Trip</Button>
            </Link>
            <Link to={`/trips/${tripId}/budget`}>
              <Button variant="outline" size="sm" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Budget</Button>
            </Link>
            <Link to={`/trips/${tripId}/timeline`}>
              <Button variant="outline" size="sm" className="gap-1.5"><Clock className="w-3.5 h-3.5" />Timeline</Button>
            </Link>
            {currentTrip.isPublic && currentTrip.shareId && (
              <Link to={`/share/${currentTrip.shareId}`}>
                <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="w-3.5 h-3.5" />Public Link</Button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Day-wise Itinerary ───────────────────────────── */}
        {stops.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-2xl">
            <MapPin className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No stops planned yet</p>
            <Link to={`/trips/${tripId}/edit`}><Button className="gap-1.5"><Pencil className="w-4 h-4" />Start Planning</Button></Link>
          </div>
        )}

        <div className="space-y-8">
          {stops.map((stop, stopIdx) => {
            const days = getStopDays(stop);
            return (
              <div key={stop.id}>
                {/* Stop Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                    {stopIdx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{stop.cityName}</h2>
                      <span className="text-sm text-muted-foreground">{stop.country}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(stop.startDate)} – {formatDate(stop.endDate)} • {getDayCount(stop.startDate, stop.endDate)} days
                    </p>
                  </div>
                </div>

                {/* Days */}
                <div className="space-y-3 ml-5 pl-6 border-l-2 border-border/40">
                  {days.map((day, dayIdx) => (
                    <div key={day.dateStr} className="relative">
                      {/* Day dot on timeline */}
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />

                      <div className="pb-2">
                        <h3 className="text-sm font-semibold text-foreground mb-2">
                          Day {stopIdx > 0 ? getDaysBefore(stops, stopIdx) + dayIdx + 1 : dayIdx + 1}
                          <span className="font-normal text-muted-foreground ml-2">{formatDateFull(day.date)}</span>
                        </h3>

                        {day.activities.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic pl-1">No activities scheduled</p>
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

                {/* Connector to next stop */}
                {stopIdx < stops.length - 1 && (
                  <div className="flex items-center justify-center my-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 py-1.5 rounded-full bg-secondary">
                      <ChevronRight className="w-3 h-3" />
                      Next: {stops[stopIdx + 1].cityName}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

function getDaysBefore(stops, currentIdx) {
  let total = 0;
  for (let i = 0; i < currentIdx; i++) {
    total += Math.ceil((new Date(stops[i].endDate) - new Date(stops[i].startDate)) / 86400000);
  }
  return total;
}
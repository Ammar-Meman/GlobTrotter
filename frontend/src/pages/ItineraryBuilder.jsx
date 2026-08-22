import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Plus, Calendar, ChevronDown, ChevronUp,
  Trash2, Pencil, ArrowLeft, Loader2, AlertCircle, BarChart3, Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import useTripStore from "../store/tripStore";
import CitySearchModal from "../components/trip/CitySearchModal";
import ActivitySearchModal from "../components/trip/ActivitySearchModal";
import StopForm from "../components/trip/StopForm";
import ActivityCard from "../components/trip/ActivityCard";
import Navbar from "../components/Navbar";

export default function ItineraryBuilder() {
  const { id: tripId } = useParams();
  const { currentTrip, loading, error, fetchTrip, addStop, deleteStop, addActivity, deleteActivity } = useTripStore();

  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopFormOpen, setStopFormOpen] = useState(false);
  const [activitySearchOpen, setActivitySearchOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState(null);
  const [expandedStops, setExpandedStops] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (tripId) fetchTrip(tripId);
  }, [tripId, fetchTrip]);

  // Expand all stops by default when trip loads
  useEffect(() => {
    if (currentTrip?.stops) {
      const expanded = {};
      currentTrip.stops.forEach((s) => (expanded[s.id] = true));
      setExpandedStops(expanded);
    }
  }, [currentTrip?.stops?.length]);

  const toggleStop = (stopId) => setExpandedStops((p) => ({ ...p, [stopId]: !p[stopId] }));

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySearchOpen(false);
    setStopFormOpen(true);
  };

  const handleAddStop = async (stopData) => {
    setStopFormOpen(false);
    setActionLoading("addStop");
    try {
      await addStop(tripId, stopData);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
    setSelectedCity(null);
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm("Delete this stop and all its activities?")) return;
    setActionLoading(stopId);
    try {
      await deleteStop(stopId);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleOpenActivitySearch = (stopId) => {
    setActiveStopId(stopId);
    setActivitySearchOpen(true);
  };

  const handleAddActivity = async (suggestion) => {
    if (!activeStopId) return;
    setActivitySearchOpen(false);
    setActionLoading("addAct-" + activeStopId);
    try {
      await addActivity(activeStopId, {
        name: suggestion.name,
        type: suggestion.type,
        category: "activity",
        cost: suggestion.estimatedCost || 0,
        duration: 0,
        description: suggestion.description || "",
        imageUrl: suggestion.imageUrl || "",
      });
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleDeleteActivity = async (activityId) => {
    setActionLoading(activityId);
    try {
      await deleteActivity(activityId);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const getDayCount = (s, e) => Math.ceil((new Date(e) - new Date(s)) / 86400000);

  // ── Loading / Error / Empty states ────────────────────────
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

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* ── Trip Header ──────────────────────────────────── */}
        <div className="mb-8">
          <Link to={`/trips/${tripId}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{currentTrip.name}</h1>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(currentTrip.startDate)} – {formatDate(currentTrip.endDate)}</span>
                <span>{getDayCount(currentTrip.startDate, currentTrip.endDate)} days</span>
                <span>{stops.length} stops</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/trips/${tripId}/budget`}>
                <Button variant="outline" size="sm" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Budget</Button>
              </Link>
              <Link to={`/trips/${tripId}/timeline`}>
                <Button variant="outline" size="sm" className="gap-1.5"><Clock className="w-3.5 h-3.5" />Timeline</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stops List ───────────────────────────────────── */}
        <div className="space-y-4">
          {stops.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-2xl">
              <MapPin className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No stops yet. Add your first destination!</p>
              <Button onClick={() => setCitySearchOpen(true)} className="gap-1.5"><Plus className="w-4 h-4" />Add Stop</Button>
            </div>
          )}

          {stops.map((stop, idx) => (
            <div key={stop.id} className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Stop Header */}
              <button
                onClick={() => toggleStop(stop.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors"
              >
                {/* Stop Number Badge */}
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{stop.cityName}</h3>
                    <span className="text-xs text-muted-foreground">{stop.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{formatDate(stop.startDate)} – {formatDate(stop.endDate)}</span>
                    <span>{getDayCount(stop.startDate, stop.endDate)} days</span>
                    <span>{(stop.activities || []).length} activities</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id); }}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete stop"
                    disabled={actionLoading === stop.id}
                  >
                    {actionLoading === stop.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  {expandedStops[stop.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded Activities */}
              {expandedStops[stop.id] && (
                <div className="px-4 pb-4 border-t border-border/30">
                  <div className="space-y-2 pt-3">
                    {(stop.activities || []).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No activities yet</p>
                    )}
                    {(stop.activities || []).map((act) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        compact
                        onRemove={() => handleDeleteActivity(act.id)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full gap-1.5 border-dashed"
                    onClick={() => handleOpenActivitySearch(stop.id)}
                    disabled={actionLoading === "addAct-" + stop.id}
                  >
                    {actionLoading === "addAct-" + stop.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Add Activity
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Add Stop Button (always visible) ─────────────── */}
        {stops.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setCitySearchOpen(true)}
              className="gap-2 px-6"
              disabled={actionLoading === "addStop"}
            >
              {actionLoading === "addStop" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Another Stop
            </Button>
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────── */}
      <CitySearchModal open={citySearchOpen} onClose={() => setCitySearchOpen(false)} onSelect={handleCitySelect} />
      <StopForm open={stopFormOpen} onCancel={() => { setStopFormOpen(false); setSelectedCity(null); }} onSubmit={handleAddStop} initialCity={selectedCity} />
      <ActivitySearchModal
        open={activitySearchOpen}
        onClose={() => setActivitySearchOpen(false)}
        cityName={stops.find((s) => s.id === activeStopId)?.cityName || ""}
        onAdd={handleAddActivity}
      />
    </>
  );
}
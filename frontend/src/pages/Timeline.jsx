import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import {
  ArrowLeft, Loader2, AlertCircle, ChevronDown, ChevronRight,
  GripVertical, Calendar, MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import DraggableActivity from "../components/trip/DraggableActivity";
import useTripStore from "../store/tripStore";
import Navbar from "../components/Navbar";

export default function Timeline() {
  const { id: tripId } = useParams();
  const { currentTrip, loading, error, fetchTrip, reorderStops, reorderActivities } = useTripStore();
  const [expandedStops, setExpandedStops] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (tripId) fetchTrip(tripId);
  }, [tripId, fetchTrip]);

  useEffect(() => {
    if (currentTrip?.stops) {
      const ex = {};
      currentTrip.stops.forEach((s) => (ex[s.id] = true));
      setExpandedStops(ex);
    }
  }, [currentTrip?.stops?.length]);

  const toggleStop = (id) => setExpandedStops((p) => ({ ...p, [id]: !p[id] }));

  // ── Stop reorder ─────────────────────────────────────────
  const handleStopDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !currentTrip) return;

      const stops = currentTrip.stops || [];
      const oldIdx = stops.findIndex((s) => s.id === active.id);
      const newIdx = stops.findIndex((s) => s.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(stops, oldIdx, newIdx);
      // Optimistic update
      useTripStore.setState((state) => ({
        currentTrip: { ...state.currentTrip, stops: reordered },
      }));
      try {
        await reorderStops(tripId, reordered.map((s) => s.id));
      } catch (err) {
        console.error(err);
      }
    },
    [currentTrip, tripId, reorderStops]
  );

  // ── Activity reorder (within a stop) ─────────────────────
  const handleActivityDragEnd = useCallback(
    (stopId) => async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !currentTrip) return;

      const stop = currentTrip.stops?.find((s) => s.id === stopId);
      if (!stop) return;

      const activities = stop.activities || [];
      const oldIdx = activities.findIndex((a) => a.id === active.id);
      const newIdx = activities.findIndex((a) => a.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(activities, oldIdx, newIdx);
      // Optimistic update
      useTripStore.setState((state) => ({
        currentTrip: {
          ...state.currentTrip,
          stops: state.currentTrip.stops.map((s) =>
            s.id === stopId ? { ...s, activities: reordered } : s
          ),
        },
      }));
      try {
        await reorderActivities(stopId, reordered.map((a) => a.id));
      } catch (err) {
        console.error(err);
      }
    },
    [currentTrip, reorderActivities]
  );

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // ── Loading / Error ──────────────────────────────────────
  if (loading && !currentTrip) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading timeline…</div>
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/trips/${tripId}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{currentTrip.name} — Timeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag stops to reorder your route. Drag activities within a stop to reschedule.
          </p>
        </div>

        {stops.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-2xl">
            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No stops to display</p>
          </div>
        )}

        {/* ── Sortable Stops ──────────────────────────────── */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStopDragEnd}>
          <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {stops.map((stop, idx) => (
                <SortableStop
                  key={stop.id}
                  stop={stop}
                  index={idx}
                  expanded={!!expandedStops[stop.id]}
                  onToggle={() => toggleStop(stop.id)}
                  formatDate={formatDate}
                  sensors={sensors}
                  onActivityDragEnd={handleActivityDragEnd(stop.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </>
  );
}

// ── SortableStop sub-component ────────────────────────────
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableStop({ stop, index, expanded, onToggle, formatDate, sensors, onActivityDragEnd }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const activities = stop.activities || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border bg-card overflow-hidden shadow-sm ${isDragging ? "shadow-lg ring-2 ring-primary/30 border-primary/30" : "border-border/40"}`}
    >
      {/* Stop Header */}
      <div className="flex items-center gap-2 p-3">
        {/* Drag Handle */}
        <button {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
          {index + 1}
        </div>

        <button onClick={onToggle} className="flex-1 flex items-center gap-2 text-left min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-semibold text-sm text-foreground truncate">{stop.cityName}</span>
              <span className="text-xs text-muted-foreground">{stop.country}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {formatDate(stop.startDate)} – {formatDate(stop.endDate)} • {activities.length} activities
            </div>
          </div>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
        </button>
      </div>

      {/* Expanded: Sortable Activities */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-border/30">
          {activities.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No activities</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onActivityDragEnd}>
              <SortableContext items={activities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5 pt-3">
                  {activities.map((act) => (
                    <DraggableActivity key={act.id} activity={act} id={act.id} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
}
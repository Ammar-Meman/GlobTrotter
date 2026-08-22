import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Trash2,
  Edit,
  ArrowRight,
  Share2,
  Check,
  IndianRupee,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function TripCard({
  trip,
  onView,
  onEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);

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

  const getTripStatus = (start, end) => {
    if (!start || !end) return { label: "Planned", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" };
    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) {
      return { label: "Upcoming", color: "bg-primary/10 text-primary border-primary/20" };
    } else if (now >= startTime && now <= endTime) {
      return { label: "In Progress", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
    } else {
      return { label: "Completed", color: "bg-muted text-muted-foreground border-border" };
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/share/${trip.shareId || trip.id}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const duration = getDurationDays(trip?.startDate, trip?.endDate);
  const status = getTripStatus(trip?.startDate, trip?.endDate);

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cover Photo Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={
              trip?.coverPhoto ||
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80"
            }
            alt={trip?.name || "Trip cover"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Top Badges & Share Button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-xs ${status.color}`}
            >
              {status.label}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white backdrop-blur-md border border-white/20"
              title="Copy share link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Bottom Banner Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-primary" />
              {trip?.stopCount || 0} {trip?.stopCount === 1 ? "Stop" : "Stops"}
            </span>

            <span className="font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              {duration} {duration === 1 ? "Day" : "Days"}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <CardContent className="p-5 space-y-3">
          <div className="space-y-1">
            <h3
              onClick={() => onView && onView(trip.id)}
              className="font-bold text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
              title={trip?.name}
            >
              {trip?.name || "Untitled Journey"}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                {formatDate(trip?.startDate)} – {formatDate(trip?.endDate)}
              </span>
            </div>
          </div>

          {trip?.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}

          {trip?.budgetLimit && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Target Budget: ${Number(trip.budgetLimit).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 mt-2 flex items-center gap-2 border-t border-border/40 pt-3">
        <Button
          variant="default"
          size="sm"
          className="flex-1 text-xs gap-1.5"
          onClick={() => onView && onView(trip.id)}
        >
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit && onEdit(trip.id)}
          title="Edit trip details & stops"
        >
          <Edit className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete && onDelete(trip.id)}
          title="Delete trip"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}

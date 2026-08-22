import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, DollarSign } from "lucide-react";

const CATEGORY_ICONS = { transport: "🚗", stay: "🏨", activity: "🎯", meal: "🍽️" };

export default function DraggableActivity({ activity, id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const catIcon = CATEGORY_ICONS[activity.category] || "📌";
  const duration = activity.duration;
  const timeStr = activity.scheduledAt
    ? new Date(activity.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background border border-border/40 transition-colors ${isDragging ? "shadow-lg ring-2 ring-primary/30" : "hover:border-border"}`}
    >
      {/* Drag Handle */}
      <button {...attributes} {...listeners} className="p-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
        <GripVertical className="w-4 h-4" />
      </button>

      <span className="text-base shrink-0">{catIcon}</span>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{activity.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {timeStr && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{timeStr}</span>}
          <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" />${activity.cost}</span>
          {duration > 0 && (
            <span>{duration >= 60 ? `${Math.floor(duration / 60)}h${duration % 60 ? ` ${duration % 60}m` : ""}` : `${duration}m`}</span>
          )}
        </div>
      </div>
    </div>
  );
}

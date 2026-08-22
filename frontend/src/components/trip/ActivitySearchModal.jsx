import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X, Clock, DollarSign, Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import api from "../../lib/api";

export default function ActivitySearchModal({ open, onClose, cityName, onAdd }) {
  const [type, setType] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !cityName) return;
    setType("");
    setMaxCost("");
    fetchActivities("", "");
  }, [open, cityName]);

  const fetchActivities = async (filterType, filterMaxCost) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/activities/search?city=${encodeURIComponent(cityName)}`;
      if (filterType) url += `&type=${encodeURIComponent(filterType)}`;
      if (filterMaxCost) url += `&maxCost=${encodeURIComponent(filterMaxCost)}`;
      const data = await api.get(url);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newType, newMaxCost) => {
    setType(newType);
    setMaxCost(newMaxCost);
    fetchActivities(newType, newMaxCost);
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden ring-1 ring-border/20 animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-sm text-foreground">Activities in {cityName}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 p-3 border-b border-border/30 bg-muted/30">
          <input
            type="text"
            value={type}
            onChange={(e) => handleFilterChange(e.target.value, maxCost)}
            placeholder="Filter by type..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-input text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          <input
            type="number"
            value={maxCost}
            onChange={(e) => handleFilterChange(type, e.target.value)}
            placeholder="Max cost"
            className="w-28 px-3 py-1.5 rounded-lg bg-background border border-input text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading activities...
            </div>
          )}

          {error && <div className="py-12 text-center text-sm text-destructive">{error}</div>}

          {!loading && !error && results.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No activities found</div>
          )}

          {results.map((activity, idx) => (
            <div
              key={activity.name + idx}
              className="flex items-start gap-3 px-4 py-3.5 border-b border-border/20 last:border-0 hover:bg-secondary/40 transition-colors group"
            >
              {activity.imageUrl ? (
                <img src={activity.imageUrl} alt={activity.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{activity.name}</div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{activity.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {activity.type}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <DollarSign className="w-3 h-3" />${activity.estimatedCost}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onAdd(activity)}
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

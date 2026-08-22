import { useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Calendar } from "lucide-react";
import { Button } from "../ui/button";

export default function StopForm({ open, onSubmit, onCancel, initialCity }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

  if (!open || !initialCity) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Both start and end dates are required");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date");
      return;
    }
    setError(null);
    onSubmit({
      cityName: initialCity.cityName,
      country: initialCity.country,
      latitude: initialCity.latitude,
      longitude: initialCity.longitude,
      costIndex: initialCity.costIndex,
      popularity: initialCity.popularity,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
    setStartDate("");
    setEndDate("");
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onCancel} />

      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden ring-1 ring-border/20 animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <h2 className="font-semibold text-sm text-foreground">Add Stop</h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Selected City Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{initialCity.cityName}</div>
              <div className="text-xs text-muted-foreground">{initialCity.country} • Cost Index {initialCity.costIndex} • Pop {initialCity.popularity}</div>
            </div>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="flex-1">Add Stop</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

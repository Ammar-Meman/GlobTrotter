import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X, MapPin, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import api from "../../lib/api";

export default function CitySearchModal({ open, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/cities/search?q=${encodeURIComponent(query.trim())}`);
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden ring-1 ring-border/20 animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/40">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city (e.g. Paris, Tokyo...)"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-sm text-destructive">{error}</div>
          )}

          {!loading && !error && results.length === 0 && query.trim() && (
            <div className="py-12 text-center text-sm text-muted-foreground">No cities found for &ldquo;{query}&rdquo;</div>
          )}

          {!loading && !error && results.length === 0 && !query.trim() && (
            <div className="py-12 text-center text-sm text-muted-foreground">Start typing to search cities</div>
          )}

          {results.map((city) => (
            <button
              key={`${city.cityName}-${city.country}`}
              onClick={() => onSelect(city)}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-secondary/60 transition-colors border-b border-border/20 last:border-0 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{city.cityName}</div>
                <div className="text-xs text-muted-foreground">{city.country}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Cost Index">
                  <DollarSign className="w-3 h-3" />
                  {city.costIndex}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Popularity">
                  <TrendingUp className="w-3 h-3" />
                  {city.popularity}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

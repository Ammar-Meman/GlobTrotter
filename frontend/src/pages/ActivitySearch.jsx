import { useState, useEffect } from "react";
import { Search, Sparkles, IndianRupee, MapPin, Filter, Plus, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import api from "../lib/api";
import useLanguageStore from "../store/languageStore";
import { Link } from "react-router-dom";

const POPULAR_DESTINATIONS = [
  "Delhi", "Jaipur", "Agra", "Varanasi", "Goa", "Mumbai",
  "Manali", "Bengaluru", "Kochi", "Munnar", "Tokyo", "Paris"
];

const ACTIVITY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Sightseeing", value: "sightseeing" },
  { label: "Food & Dining", value: "food" },
  { label: "Adventure", value: "adventure" },
  { label: "Shopping", value: "shopping" },
];

export default function ActivitySearch() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [cityInput, setCityInput] = useState("Delhi");
  const [type, setType] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const t = useLanguageStore((state) => state.t);

  useEffect(() => {
    fetchActivities(selectedCity, type, maxCost);
  }, [selectedCity, type, maxCost]);

  const fetchActivities = async (city, filterType, filterMaxCost) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      let url = `/activities/search?city=${encodeURIComponent(city)}`;
      if (filterType) url += `&type=${encodeURIComponent(filterType)}`;
      if (filterMaxCost) url += `&maxCost=${encodeURIComponent(filterMaxCost)}`;
      const res = await api.get(url);
      setActivities(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || "Failed to load activities");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setSelectedCity(cityInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 rounded-3xl p-6 sm:p-10 border border-primary/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Activity & Tour Discovery
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Explore Things to Do in <span className="text-primary">{selectedCity}</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover authentic heritage tours, street food walks, river cruises, and thrilling adventures.
            </p>
          </div>
        </div>

        {/* Quick Destination Pills & Search */}
        <div className="space-y-4">
          <form onSubmit={handleCitySearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Search city (e.g. Jaipur, Manali, Tokyo)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-input text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" size="sm" className="gap-1.5 px-4 font-medium rounded-xl">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </form>

          {/* Quick city selection tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground shrink-0 font-medium">Popular:</span>
            {POPULAR_DESTINATIONS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCityInput(c);
                  setSelectedCity(c);
                }}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                  selectedCity.toLowerCase() === c.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Type & Price Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {ACTIVITY_TYPES.map((tItem) => (
              <button
                key={tItem.value}
                onClick={() => setType(tItem.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  type === tItem.value
                    ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Max Cost:</span>
            <input
              type="number"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              placeholder="e.g. 1000"
              className="w-24 px-2.5 py-1 text-xs rounded-lg bg-background border border-input outline-none focus:ring-1 focus:ring-primary"
            />
            {maxCost && (
              <button
                onClick={() => setMaxCost("")}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Activity Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-border/40 bg-card p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-muted rounded-xl w-full" />
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-8 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive space-y-2">
            <p className="font-semibold text-lg">{error}</p>
            <p className="text-sm text-muted-foreground">Try selecting a popular destination from the list above.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto stroke-1" />
            <h3 className="text-lg font-semibold text-foreground">No activities found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't find any activities matching your filter criteria in {selectedCity}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, index) => (
              <div
                key={act.name + index}
                className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={act.imageUrl || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600"}
                    alt={act.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md capitalize">
                    {act.type}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-md flex items-center gap-0.5">
                    <IndianRupee className="w-3 h-3" />
                    {act.estimatedCost === 0 ? "Free" : act.estimatedCost}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-1">
                      {act.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedCity}</span>
                    </div>

                    <Link to="/trips">
                      <Button size="sm" variant="secondary" className="gap-1 text-xs font-medium rounded-lg h-8">
                        <Plus className="w-3.5 h-3.5" />
                        Add to Trip
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
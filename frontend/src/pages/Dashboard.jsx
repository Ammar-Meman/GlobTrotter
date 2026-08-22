import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Plane,
  MapPin,
  Calendar,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  ChevronRight,
  Luggage,
  Plus,
  ChevronLeft,
  Search,
  Flame,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import useTripStore from "@/store/tripStore";
import { Button } from "@/components/ui/button";

/* ── Hero Slides Data (Indian & Global Wonders) ──────────── */
const HERO_SLIDES = [
  {
    id: "jaipur",
    city: "Jaipur, Rajasthan",
    tagline: "The Royal Pink City",
    title: "Fuel Your Wanderlust, Your Next Escape Awaits!",
    description:
      "Crafting Exceptional Journeys: Your Personalized Multi-City Travel Planner. Unleash wanderlust across heritage palaces, majestic forts, and rich royal culture.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=85&w=2400&auto=format&fit=crop",
    vibe: "Palaces & Forts",
    rating: "4.9",
  },
  {
    id: "kerala",
    city: "Alleppey & Munnar, Kerala",
    tagline: "God's Own Country",
    title: "Drift Through Backwaters & Emerald Hills",
    description:
      "Cruise on tranquil houseboats, savor fragrant tea estates, and design effortless tropical getaways tailored to your rhythm.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=85&w=2400&auto=format&fit=crop",
    vibe: "Nature & Backwaters",
    rating: "4.95",
  },
  {
    id: "ladakh",
    city: "Leh & Pangong, Ladakh",
    tagline: "Land of High Mountain Passes",
    title: "Conquer Majestic Peaks & Crystal Lakes",
    description:
      "Experience high-altitude serenity, vibrant monasteries, and starlit Himalayan nights with seamless day-by-day itineraries.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop",
    vibe: "Adventure & Peaks",
    rating: "4.92",
  },
  {
    id: "varanasi",
    city: "Varanasi, Uttar Pradesh",
    tagline: "The World's Oldest Living City",
    title: "Immerse in Timeless Ghats & Ganga Aarti",
    description:
      "Witness mesmerizing evening rituals along the sacred Ganges, navigate ancient lanes, and explore profound cultural roots.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=85&w=2400&auto=format&fit=crop",
    vibe: "Spiritual & Ancient",
    rating: "4.88",
  },
  {
    id: "goa",
    city: "North & South Goa",
    tagline: "Sun, Sand & Coastal Serenity",
    title: "Golden Coastlines & Vibrant Seaside Nights",
    description:
      "From serene palm-fringed southern coves to pulsating seaside cafes, plan your ideal coastal escape with instant budget tracking in ₹.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=85&w=2400&auto=format&fit=crop",
    vibe: "Beaches & Cafes",
    rating: "4.85",
  },
];

/* ── Popular Indian Destinations ──────────────────────────── */
const POPULAR_DESTINATIONS = [
  {
    name: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹2,800 / day",
    tag: "Palaces & Forts",
  },
  {
    name: "Kerala",
    state: "Alleppey",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,200 / day",
    tag: "Backwaters & Tea",
  },
  {
    name: "Ladakh",
    state: "Leh",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹3,500 / day",
    tag: "Mountains & Lakes",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=700&auto=format&fit=crop&q=80",
    cost: "₹",
    budgetPerDay: "₹1,400 / day",
    tag: "Ghats & Heritage",
  },
  {
    name: "Goa",
    state: "West Coast",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,400 / day",
    tag: "Beaches & Sunsets",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹3,100 / day",
    tag: "Lakes & Royalty",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { trips, fetchTrips, loading } = useTripStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("All");

  useEffect(() => {
    fetchTrips().catch((err) => console.error("Error loading trips:", err));
  }, [fetchTrips]);

  // Auto-advance hero slides every 7 seconds
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString("en-IN", {
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

  // Compute summary stats
  const totalTrips = trips.length;
  const totalStops = trips.reduce((acc, t) => acc + (t.stopCount || 0), 0);
  const totalDays = trips.reduce((acc, t) => acc + getDurationDays(t.startDate, t.endDate), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentHero = HERO_SLIDES[currentSlide];

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/cities?search=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate("/cities");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* ── IMMERSIVE TOP HERO STAGE ──────────────────────────── */}
      <div className="relative w-full min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden bg-slate-950">
        
        {/* Dynamic Background Image Carousel (Cross-fading with natural opacity) */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-65" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
          />
        ))}

        {/* Ambient Natural Gradient Overlay for Clear Contrast (No Glass, No Fake Tint) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Navbar Sitting Directly on the Hero Image */}
        <Navbar transparent={true} />

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Warm Travel Greeting Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-sm">
                  <span>🌍 Explore India</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/20 text-xs font-semibold text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentHero.city}</span>
                </div>
              </div>

              {/* Main Headline & Description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-title-${currentSlide}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="space-y-3.5 max-w-2xl"
                >
                  <h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]"
                    style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
                  >
                    {currentHero.title}
                  </h1>

                  <p
                    className="text-white/90 text-sm sm:text-base font-normal leading-relaxed max-w-xl"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                  >
                    {getGreeting()}, <strong className="font-semibold text-amber-300">{user?.name ? user.name.split(" ")[0] : "Daksh"}</strong>! {currentHero.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons & Carousel Arrows */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button
                  onClick={() => navigate("/trips/new")}
                  className="h-12 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md gap-2 transition-transform hover:scale-102 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Plan a New Journey</span>
                </Button>

                <Button
                  onClick={() => navigate("/cities")}
                  className="h-12 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm gap-2 transition-transform hover:scale-102 cursor-pointer shadow-sm"
                >
                  <Compass className="w-4 h-4 text-slate-700" />
                  <span>Explore Destinations</span>
                </Button>

                {/* Slider Controls */}
                <div className="flex items-center gap-2 sm:ml-4">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Vignette Cards (Featured Destination Stack) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-0.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Escapes</span>
              </div>

              {HERO_SLIDES.slice(0, 3).map((item, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={item.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`relative rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? "bg-slate-900 border-amber-400 text-white shadow-lg ring-1 ring-amber-400"
                        : "bg-black/50 border-white/15 hover:bg-black/70 text-white"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.city}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold truncate">{item.city.split(",")[0]}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          {item.vibe.split("&")[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5">{item.tagline}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium mt-1">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ── Floating Quick Search / Planner Tray ────────────── */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mb-10 sm:-mb-12">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200 text-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
          >
            {/* Destination input */}
            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Destination
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-700 shrink-0" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Where to? (Jaipur, Goa...)"
                  className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Travel Vibe */}
            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Holiday Vibe
              </label>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-700 shrink-0" />
                <select
                  value={selectedVibe}
                  onChange={(e) => setSelectedVibe(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="All">All Experiences</option>
                  <option value="Heritage">Palaces & Forts</option>
                  <option value="Beach">Beaches & Coastal</option>
                  <option value="Mountains">Himalayas & Trek</option>
                  <option value="Backwaters">Backwaters & Nature</option>
                </select>
              </div>
            </div>

            {/* Budget Range (in Rupees) */}
            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Budget Tier
              </label>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  ₹1,500 – ₹8,000+ / day
                </span>
              </div>
            </div>

            {/* Search CTA */}
            <div className="flex items-center">
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Trips</span>
              </Button>
            </div>
          </form>
        </div>

      </div>

      {/* ── MAIN DASHBOARD BODY (CLEAN LIGHT BACKGROUND) ─────────── */}
      <main className="flex-1 bg-slate-50 pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Quick Analytics & Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                <Luggage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Planned Trips</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "-" : totalTrips}</h3>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Stops</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "-" : totalStops}</h3>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Travel Days</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "-" : totalDays}</h3>
              </div>
            </div>
          </div>

          {/* ── Upcoming Itineraries Section ────────────────────── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Upcoming Itineraries</h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {trips.length} Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Manage and track your customized route plans</p>
              </div>

              {trips.length > 0 && (
                <Link
                  to="/trips"
                  className="text-xs font-semibold text-slate-900 hover:text-amber-600 hover:underline flex items-center gap-1"
                >
                  View all ({trips.length})
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse rounded-2xl bg-white border border-slate-200 h-72" />
                ))}
              </div>
            ) : trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => {
                  const duration = getDurationDays(trip.startDate, trip.endDate);
                  return (
                    <div
                      key={trip.id}
                      className="rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Trip Card Cover */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          <img
                            src={
                              trip.coverPhoto ||
                              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80"
                            }
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                          
                          <div className="absolute top-3 right-3">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                              {duration} {duration === 1 ? "Day" : "Days"}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20">
                              {trip.stopCount || 0} {trip.stopCount === 1 ? "Stop" : "Stops"}
                            </span>
                          </div>
                        </div>

                        {/* Trip Details */}
                        <div className="p-5 space-y-2.5">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {trip.name}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                            </span>
                          </div>

                          {trip.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {trip.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-5 pt-0 flex items-center gap-2 border-t border-slate-100 mt-2 pt-3">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs gap-1.5 cursor-pointer shadow-xs"
                          onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                          <span>View Itinerary</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3.5 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                          onClick={() => navigate(`/trips/${trip.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Passport State */
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-100">
                  <Plane className="w-7 h-7 -rotate-45" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-bold text-lg text-slate-900">Your Travel Passport is Empty</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Start crafting your multi-city Indian adventure in minutes. Pick your dream destinations, organize stops, and track budgets in ₹.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/trips/new")}
                  className="h-10 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Trip
                </Button>
              </div>
            )}
          </div>

          {/* ── Trending Indian Destinations Showcase ────────────── */}
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Popular Destinations Across India</h2>
                <p className="text-xs text-slate-500 mt-0.5">Handpicked traveler-favorite cities to spark your next adventure</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/cities")}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 gap-1 rounded-lg cursor-pointer"
              >
                <span>View All Cities</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {POPULAR_DESTINATIONS.map((dest) => (
                <div
                  key={dest.name}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() =>
                    navigate(
                      `/trips/new?name=${encodeURIComponent(dest.name + " Gateway")}&city=${encodeURIComponent(dest.name)}`
                    )
                  }
                >
                  <div className="h-32 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">
                      {dest.cost}
                    </span>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {dest.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{dest.tag}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">{dest.budgetPerDay}</p>
                  </div>

                  <div className="px-3 pb-3">
                    <div className="w-full py-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 text-center text-xs font-semibold transition-colors">
                      + Plan Trip
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
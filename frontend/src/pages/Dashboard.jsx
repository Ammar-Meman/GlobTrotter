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
  Sparkles,
  ChevronRight,
  Luggage,
  Plus,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Flame,
  Shield,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import useTripStore from "@/store/tripStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ── Hero Slides Data (Indian & Global Wonders) ──────────── */
const HERO_SLIDES = [
  {
    id: "jaipur",
    city: "Jaipur, Rajasthan",
    tagline: "The Royal Pink City",
    title: "Fuel Your Wanderlust • Your Next Escape Awaits!",
    description:
      "Crafting Exceptional Journeys: Your Personalized Multi-City Travel Planner. Unleash wanderlust across heritage palaces, majestic forts, and rich royal culture.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=85&w=2400&auto=format&fit=crop",
    vibe: "Palaces & Heritage",
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
      "Experience high-altitude serenity, vibrant Buddhist monasteries, and starlit Himalayan nights with seamless day-by-day itineraries.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop",
    vibe: "Adventure & Mountains",
    rating: "4.92",
  },
  {
    id: "varanasi",
    city: "Varanasi, Uttar Pradesh",
    tagline: "The World's Oldest Living City",
    title: "Immerse in Timeless Ghats & Ganga Aarti",
    description:
      "Witness mesmerizing evening rituals along the sacred Ganges, navigate ancient lanes, and immerse yourself in profound spiritual heritage.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=85&w=2400&auto=format&fit=crop",
    vibe: "Spiritual & Ancient",
    rating: "4.88",
  },
  {
    id: "goa",
    city: "North & South Goa",
    tagline: "Sun, Sand & Coastal Serenity",
    title: "Golden Coastlines & Vibrant Nights",
    description:
      "From serene palm-fringed southern coves to pulsating seaside cafes, plan your ideal beach escape with instant cost estimates.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=85&w=2400&auto=format&fit=crop",
    vibe: "Beaches & Coastal",
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
    budgetPerDay: "₹2,800/day",
    match: "99% Match",
    tag: "Palaces & Forts",
  },
  {
    name: "Kerala",
    state: "Alleppey",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,200/day",
    match: "97% Match",
    tag: "Backwaters & Tea",
  },
  {
    name: "Ladakh",
    state: "Leh",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹3,500/day",
    match: "96% Match",
    tag: "Mountains & Lakes",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=700&auto=format&fit=crop&q=80",
    cost: "₹",
    budgetPerDay: "₹1,400/day",
    match: "95% Match",
    tag: "Ghats & Spiritual",
  },
  {
    name: "Goa",
    state: "West Coast",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,400/day",
    match: "94% Match",
    tag: "Beaches & Cafes",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹3,100/day",
    match: "98% Match",
    tag: "Lakes & Luxury",
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* ── IMMERSIVE TOP HERO STAGE ──────────────────────────── */}
      <div className="relative w-full min-h-[580px] lg:min-h-[640px] flex flex-col justify-between overflow-hidden">
        
        {/* Dynamic Background Image Carousel (Cross-fading) */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-60 scale-100" : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
              transitionProperty: "opacity, transform",
              transitionDuration: "1000ms",
            }}
          />
        ))}

        {/* Ambient Overlay for Readability (No heavy wash, just rich depth) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />

        {/* Top Navbar Sitting Directly on the Hero Image */}
        <Navbar transparent={true} />

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Dynamic Greeting & Badge */}
              <motion.div
                key={`greeting-${currentSlide}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-xs font-bold text-sky-200 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
                  <span>{getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Daksh"}! 🇮🇳</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90">
                  <MapPin className="w-3 h-3 text-sky-300" />
                  <span>{currentHero.city}</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-title-${currentSlide}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4 max-w-2xl"
                >
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"
                    style={{ textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
                  >
                    {currentHero.title}
                  </h1>

                  <p
                    className="text-white/90 text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-xl"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
                  >
                    {currentHero.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons & Carousel Arrows */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  onClick={() => navigate("/trips/new")}
                  className="h-12 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Plan a New Journey
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/cities")}
                  className="h-12 px-6 rounded-2xl bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-md font-semibold text-sm gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-sky-300" />
                  Explore Destinations
                </Button>

                {/* Slider Controls */}
                <div className="flex items-center gap-2 sm:ml-4">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Vignette Cards (Featured Destination Stack) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-3">
              <div className="text-xs font-bold uppercase tracking-widest text-sky-300/90 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Featured Escapes
              </div>

              {HERO_SLIDES.slice(0, 3).map((item, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setCurrentSlide(idx)}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer transition-all duration-300 border ${
                      isActive
                        ? "bg-white/20 border-sky-400/80 shadow-lg shadow-sky-500/20 backdrop-blur-md ring-2 ring-sky-400/40"
                        : "bg-white/10 border-white/15 hover:bg-white/15 backdrop-blur-sm"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.city}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/30 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{item.city.split(",")[0]}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                          {item.vibe.split("&")[0]}
                        </span>
                      </div>
                      <p className="text-xs text-white/75 truncate mt-0.5">{item.tagline}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold mt-1">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ── Floating Quick Search / Planner Tray ────────────── */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mb-10 sm:-mb-12">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-slate-100 text-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
          >
            {/* Destination input */}
            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Destination
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Holiday Vibe
              </label>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-600 shrink-0" />
                <select
                  value={selectedVibe}
                  onChange={(e) => setSelectedVibe(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="All">All Experiences</option>
                  <option value="Heritage">Forts & Heritage</option>
                  <option value="Beach">Beaches & Coastal</option>
                  <option value="Mountains">Himalayas & Trek</option>
                  <option value="Backwaters">Backwaters & Nature</option>
                </select>
              </div>
            </div>

            {/* Budget Range (in Rupees) */}
            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Budget Tier
              </label>
              <div className="flex items-center gap-2">
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
                className="w-full h-12 rounded-2xl bg-slate-950 hover:bg-sky-600 text-white font-bold text-sm shadow-md gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Trips</span>
              </Button>
            </div>
          </form>
        </div>

      </div>

      {/* ── MAIN DASHBOARD BODY (LIGHT/CLEAN BACKGROUND) ─────────── */}
      <main className="flex-1 bg-slate-900 pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Quick Analytics & Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700/60 p-6 flex items-center gap-4 shadow-sm hover:border-sky-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
                <Luggage className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Planned Trips</p>
                <h3 className="text-3xl font-black text-white mt-0.5">{loading ? "-" : totalTrips}</h3>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/80 border border-slate-700/60 p-6 flex items-center gap-4 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Stops</p>
                <h3 className="text-3xl font-black text-white mt-0.5">{loading ? "-" : totalStops}</h3>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/80 border border-slate-700/60 p-6 flex items-center gap-4 shadow-sm hover:border-amber-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Travel Days</p>
                <h3 className="text-3xl font-black text-white mt-0.5">{loading ? "-" : totalDays}</h3>
              </div>
            </div>
          </div>

          {/* ── Upcoming Itineraries Section ────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Your Upcoming Itineraries</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {trips.length} Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Manage and track your customized route plans</p>
              </div>

              {trips.length > 0 && (
                <Link
                  to="/trips"
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"
                >
                  View all ({trips.length})
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse rounded-3xl bg-slate-800 border border-slate-700 h-80" />
                ))}
              </div>
            ) : trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => {
                  const duration = getDurationDays(trip.startDate, trip.endDate);
                  return (
                    <motion.div
                      key={trip.id}
                      whileHover={{ y: -4 }}
                      className="rounded-3xl overflow-hidden bg-slate-800/90 border border-slate-700/70 hover:border-sky-500/50 shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Trip Card Cover */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                          <img
                            src={
                              trip.coverPhoto ||
                              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80"
                            }
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                          
                          <div className="absolute top-3 right-3">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500 text-white shadow-md">
                              {duration} {duration === 1 ? "Day" : "Days"}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20">
                              {trip.stopCount || 0} {trip.stopCount === 1 ? "Stop" : "Stops"}
                            </span>
                          </div>
                        </div>

                        {/* Trip Details */}
                        <div className="p-6 space-y-3">
                          <h3 className="font-extrabold text-xl text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                            {trip.name}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>
                              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                            </span>
                          </div>

                          {trip.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {trip.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-6 pt-0 flex items-center gap-2 border-t border-slate-700/60 mt-2 pt-4">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
                          onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                          <span>View Itinerary</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 px-4 rounded-xl border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                          onClick={() => navigate(`/trips/${trip.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Empty Passport State */
              <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-slate-800/40 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-sky-500/15 border border-sky-400/30 text-sky-400 mx-auto flex items-center justify-center">
                  <Plane className="w-8 h-8 -rotate-45" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="font-extrabold text-xl text-white">Your Travel Passport is Empty</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Start crafting your multi-city Indian adventure in minutes. Pick your dream destinations, organize stops, and track budgets in ₹.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/trips/new")}
                  className="h-11 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm gap-2 shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Trip
                </Button>
              </div>
            )}
          </div>

          {/* ── Trending Indian Destinations Showcase ────────────── */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Popular Destinations Across India</h2>
                <p className="text-xs text-slate-400 mt-1">Handpicked traveler-favorite cities to spark your next adventure</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/cities")}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:bg-slate-800 gap-1 rounded-xl"
              >
                <span>View All Cities</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {POPULAR_DESTINATIONS.map((dest) => (
                <motion.div
                  key={dest.name}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-800/80 hover:border-sky-400/60 shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() =>
                    navigate(
                      `/trips/new?name=${encodeURIComponent(dest.name + " Gateway")}&city=${encodeURIComponent(dest.name)}`
                    )
                  }
                >
                  <div className="h-36 w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-xs">
                      {dest.cost}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                      {dest.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{dest.tag}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">{dest.budgetPerDay}</p>
                  </div>

                  <div className="px-3.5 pb-3">
                    <div className="w-full py-1.5 rounded-xl bg-slate-700/50 group-hover:bg-sky-500 group-hover:text-white text-slate-300 text-center text-xs font-bold transition-colors">
                      + Plan Trip
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
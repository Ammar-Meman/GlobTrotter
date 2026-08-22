import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Compass,
  Heart,
  Plus,
  Scale,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  Calendar,
  DollarSign,
  Utensils,
  Landmark,
  Layers,
  Thermometer,
  ArrowRight,
  TrendingUp,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Comprehensive Global City Knowledgebase
const GLOBAL_CITIES = [
  {
    id: "paris",
    cityName: "Paris",
    country: "France",
    region: "Europe",
    latitude: 48.8566,
    longitude: 2.3522,
    costIndex: 72.5,
    popularity: 98,
    dailyBudget: 140,
    bestSeason: "May – Sep (Spring/Summer)",
    climate: "Temperate, mild summers",
    vibes: ["Romantic", "Historic & Cultural", "Foodie & Culinary", "Art & Architecture"],
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
    description: "The City of Light captivates travelers with monumental architecture, world-leading art collections, romantic Seine river walks, and unparalleled haute cuisine.",
    landmarks: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
    cuisine: ["Croissants & Baguettes", "Duck Confit", "French Onion Soup", "Macarons"],
    neighborhoods: [
      { name: "Le Marais", vibe: "Chic boutiques, historic mansions, art galleries" },
      { name: "Montmartre", vibe: "Bohemian hill with artists, Sacré-Cœur basilica" },
      { name: "Latin Quarter", vibe: "Lively student quarter, bistros, bookshops" },
    ],
  },
  {
    id: "tokyo",
    cityName: "Tokyo",
    country: "Japan",
    region: "Asia",
    latitude: 35.6762,
    longitude: 139.6503,
    costIndex: 85.0,
    popularity: 99,
    dailyBudget: 160,
    bestSeason: "Mar – May & Sep – Nov (Cherry Blossom / Autumn)",
    climate: "Humid subtropical, pleasant springs",
    vibes: ["Futuristic & Modern", "Foodie & Culinary", "Historic & Cultural", "Nightlife"],
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    description: "A breathtaking contrast of ancient shrines nestled alongside neon skyscrapers, ultra-efficient transit, Michelin-starred ramen bars, and vibrant subcultures.",
    landmarks: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree", "Meiji Shrine"],
    cuisine: ["Tonkotsu Ramen", "Fresh Sushi & Sashimi", "Yakitori", "Wagyu Beef"],
    neighborhoods: [
      { name: "Shibuya", vibe: "Youth fashion, bustling crossings, neon skyline" },
      { name: "Shinjuku", vibe: "Skyscrapers, entertainment, Golden Gai nightlife" },
      { name: "Asakusa", vibe: "Traditional Edo atmosphere and Senso-ji temple" },
    ],
  },
  {
    id: "rome",
    cityName: "Rome",
    country: "Italy",
    region: "Europe",
    latitude: 41.9028,
    longitude: 12.4964,
    costIndex: 68.0,
    popularity: 94,
    dailyBudget: 120,
    bestSeason: "Apr – Jun & Sep – Oct",
    climate: "Mediterranean, warm & sunny",
    vibes: ["Ancient History", "Foodie & Culinary", "Romantic", "Architecture"],
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
    description: "An open-air living museum where nearly three millennia of globally influential art, architecture, and culture are on open display at every street corner.",
    landmarks: ["Colosseum", "Vatican City & St. Peter's", "Pantheon", "Trevi Fountain"],
    cuisine: ["Carbonara", "Cacio e Pepe", "Artisanal Gelato", "Roman-style Pizza"],
    neighborhoods: [
      { name: "Trastevere", vibe: "Cobblestone alleys, authentic trattorias, charming nightlife" },
      { name: "Centro Storico", vibe: "Piazza Navona, Pantheon, bustling squares" },
      { name: "Monti", vibe: "Vintage shops, trendy wine bars, bohemian spirit" },
    ],
  },
  {
    id: "kyoto",
    cityName: "Kyoto",
    country: "Japan",
    region: "Asia",
    latitude: 35.0116,
    longitude: 135.7681,
    costIndex: 75.0,
    popularity: 92,
    dailyBudget: 130,
    bestSeason: "Oct – Nov (Fall Foliage) & Mar – Apr",
    climate: "Four distinct seasons, gorgeous autumns",
    vibes: ["Historic & Cultural", "Temples & Nature", "Zen & Relaxation", "Romantic"],
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    description: "The cultural heart of Japan, home to thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden machiya houses.",
    landmarks: ["Fushimi Inari-taisha", "Kinkaku-ji (Golden Pavilion)", "Arashiyama Bamboo Grove", "Gion Geisha District"],
    cuisine: ["Kaiseki Dining", "Matcha Sweets", "Yudofu (Tofu Hot Pot)", "Shojin Ryori"],
    neighborhoods: [
      { name: "Gion", vibe: "Historic preservation district, tea houses, geishas" },
      { name: "Arashiyama", vibe: "Scenic bamboo groves, river cruises, mountain temples" },
      { name: "Higashiyama", vibe: "Preserved cobblestone slopes leading to Kiyomizu-dera" },
    ],
  },
  {
    id: "barcelona",
    cityName: "Barcelona",
    country: "Spain",
    region: "Europe",
    latitude: 41.3879,
    longitude: 2.1699,
    costIndex: 65.0,
    popularity: 93,
    dailyBudget: 110,
    bestSeason: "May – Jun & Sep – Oct",
    climate: "Mediterranean, beach weather",
    vibes: ["Art & Architecture", "Coastal & Beach", "Foodie & Culinary", "Nightlife"],
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop&q=80",
    description: "A vibrant seaside metropolis celebrated for Antoni Gaudí's fantastical modernist architecture, Mediterranean beaches, tapas bars, and spirited nightlife.",
    landmarks: ["Sagrada Família", "Park Güell", "Gothic Quarter (Barri Gòtic)", "Casa Batlló"],
    cuisine: ["Tapas & Pintxos", "Seafood Paella", "Jamon Iberico", "Churros con Chocolate"],
    neighborhoods: [
      { name: "El Born", vibe: "Trendy boutiques, medieval alleys, tapas bars" },
      { name: "Gràcia", vibe: "Village feel, lively plazas, independent artisan shops" },
      { name: "Barceloneta", vibe: "Seaside promenade, sandy beaches, seafood chiringuitos" },
    ],
  },
  {
    id: "bali",
    cityName: "Bali",
    country: "Indonesia",
    region: "Asia",
    latitude: -8.3405,
    longitude: 115.092,
    costIndex: 38.0,
    popularity: 96,
    dailyBudget: 55,
    bestSeason: "Apr – Oct (Dry Season)",
    climate: "Tropical, warm all year",
    vibes: ["Budget Friendly", "Coastal & Beach", "Nature & Adventure", "Zen & Relaxation"],
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
    description: "The Island of the Gods offers an enchanting blend of terraced rice fields, sacred sea temples, world-class surf breaks, and restorative wellness retreats.",
    landmarks: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Mount Batur", "Sacred Monkey Forest"],
    cuisine: ["Nasi Goreng", "Babi Guling", "Satay Lilit", "Fresh Coconut & Smoothie Bowls"],
    neighborhoods: [
      { name: "Ubud", vibe: "Cultural hub, lush jungles, art markets, yoga" },
      { name: "Canggu", vibe: "Surfing, trendy cafes, beach clubs, digital nomad scene" },
      { name: "Seminyak", vibe: "Upscale beachfront dining, sunset cocktails, luxury villas" },
    ],
  },
  {
    id: "amsterdam",
    cityName: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    latitude: 52.3676,
    longitude: 4.9041,
    costIndex: 78.0,
    popularity: 90,
    dailyBudget: 135,
    bestSeason: "Apr – Sep (Tulips & Long Summer Days)",
    climate: "Oceanic, moderate summers",
    vibes: ["Historic & Cultural", "Romantic", "Art & Architecture", "Nightlife"],
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&auto=format&fit=crop&q=80",
    description: "Famous for its concentric canal rings, world-renowned museums, cycling culture, narrow gabled houses, and progressive artistic heritage.",
    landmarks: ["Rijksmuseum", "Van Gogh Museum", "Anne Frank House", "Jordaan Canals"],
    cuisine: ["Stroopwafels", "Dutch Cheeses (Gouda)", "Bitterballen", "Herring"],
    neighborhoods: [
      { name: "Jordaan", vibe: "Scenic canal views, cozy cafes, art galleries" },
      { name: "De Pijp", vibe: "Albert Cuyp market, brunch spots, multicultural flair" },
      { name: "Museumplein", vibe: "World-class cultural institutions and spacious green lawns" },
    ],
  },
  {
    id: "new-york",
    cityName: "New York",
    country: "United States",
    region: "Americas",
    latitude: 40.7128,
    longitude: -74.006,
    costIndex: 90.0,
    popularity: 97,
    dailyBudget: 190,
    bestSeason: "Sep – Nov & Apr – Jun",
    climate: "Four seasons, vibrant autumns",
    vibes: ["Futuristic & Modern", "Foodie & Culinary", "Nightlife", "Art & Architecture"],
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80",
    description: "The world's cultural and financial heartbeat, brimming with iconic skyscrapers, Broadway theaters, Michelin dining, and diverse historic boroughs.",
    landmarks: ["Central Park", "Statue of Liberty", "Empire State Building", "Times Square"],
    cuisine: ["New York-style Pizza", "Bagels with Lox", "Pastrami on Rye", "Cheesecake"],
    neighborhoods: [
      { name: "SoHo & Greenwich Village", vibe: "Cast-iron architecture, jazz clubs, upscale boutiques" },
      { name: "Williamsburg", vibe: "Hipster rooftop bars, vintage markets, waterfront parks" },
      { name: "Midtown", vibe: "Broadway theaters, Rockefeller Center, skyscraper canyon" },
    ],
  },
  {
    id: "london",
    cityName: "London",
    country: "United Kingdom",
    region: "Europe",
    latitude: 51.5074,
    longitude: -0.1278,
    costIndex: 82.0,
    popularity: 95,
    dailyBudget: 155,
    bestSeason: "May – Sep",
    climate: "Mild temperate",
    vibes: ["Historic & Cultural", "Art & Architecture", "Foodie & Culinary", "Nightlife"],
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80",
    description: "An endlessly fascinating global capital pairing royal history and Victorian landmarks with cutting-edge fashion, theater, and culinary innovation.",
    landmarks: ["Big Ben & Parliament", "Tower Bridge", "British Museum", "Buckingham Palace"],
    cuisine: ["Sunday Roast", "Fish & Chips", "Afternoon Tea", "Chicken Tikka Masala"],
    neighborhoods: [
      { name: "Covent Garden & Soho", vibe: "West End theaters, bustling piazza, vibrant dining" },
      { name: "Notting Hill", vibe: "Pastel Victorian townhouses, Portobello antique market" },
      { name: "Shoreditch", vibe: "Street art, tech startups, indie coffee shops" },
    ],
  },
  {
    id: "reykjavik",
    cityName: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    latitude: 64.1466,
    longitude: -21.9426,
    costIndex: 88.0,
    popularity: 88,
    dailyBudget: 175,
    bestSeason: "Jun – Aug (Midnight Sun) & Sep – Mar (Northern Lights)",
    climate: "Subpolar oceanic, crisp & dramatic",
    vibes: ["Nature & Adventure", "Zen & Relaxation", "Historic & Cultural", "Romantic"],
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80",
    description: "Gateway to Iceland's geothermal wonders, volcanic glaciers, roaring waterfalls, and dancing aurora borealis displays.",
    landmarks: ["Hallgrímskirkja", "Harpa Concert Hall", "Blue Lagoon Geothermal Spa", "Golden Circle Route"],
    cuisine: ["Icelandic Lamb Stew", "Fresh Arctic Char", "Skyr with Berries", "Rúgbrauð Rye Bread"],
    neighborhoods: [
      { name: "Miðborg (Downtown)", vibe: "Colorful rooftops, cozy thermal cafes, design shops" },
      { name: "Grandi Harbor", vibe: "Converted fish warehouses, artisanal chocolate, maritime history" },
      { name: "Laugardalur", vibe: "Geothermal swimming pools, botanical gardens, family recreation" },
    ],
  },
  {
    id: "bangkok",
    cityName: "Bangkok",
    country: "Thailand",
    region: "Asia",
    latitude: 13.7563,
    longitude: 100.5018,
    costIndex: 42.0,
    popularity: 93,
    dailyBudget: 60,
    bestSeason: "Nov – Feb (Cool & Dry)",
    climate: "Tropical savanna, warm",
    vibes: ["Budget Friendly", "Foodie & Culinary", "Historic & Cultural", "Nightlife"],
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80",
    description: "A sensory feast featuring ornate gold-spired temples, vibrant floating markets, Michelin street food stalls, and rooftop cocktail lounges.",
    landmarks: ["Grand Palace & Wat Phra Kaew", "Wat Arun (Temple of Dawn)", "Chatuchak Weekend Market", "Chao Phraya River"],
    cuisine: ["Pad Thai", "Tom Yum Goong", "Mango Sticky Rice", "Som Tum (Papaya Salad)"],
    neighborhoods: [
      { name: "Rattanakosin", vibe: "Historic heart, royal palaces, sacred temples" },
      { name: "Sukhumvit", vibe: "Modern mega-malls, international dining, rooftop lounges" },
      { name: "Chinatown (Yaowarat)", vibe: "Famous night street food spectacle and gold shops" },
    ],
  },
  {
    id: "zurich",
    cityName: "Zurich",
    country: "Switzerland",
    region: "Europe",
    latitude: 47.3769,
    longitude: 8.5417,
    costIndex: 94.0,
    popularity: 87,
    dailyBudget: 210,
    bestSeason: "Jun – Aug (Lake Swimming) & Dec – Feb (Skiing)",
    climate: "Temperate alpine, pristine air",
    vibes: ["Nature & Adventure", "Zen & Relaxation", "Art & Architecture", "Romantic"],
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&auto=format&fit=crop&q=80",
    description: "A pristine lakeside paradise seamlessly blending Swiss banking precision with picturesque Old Town lanes, alpine panoramas, and luxury lifestyle.",
    landmarks: ["Lake Zurich Promenade", "Altstadt (Old Town)", "Uetliberg Mountain", "Bahnhofstrasse"],
    cuisine: ["Zürcher Geschnetzeltes", "Swiss Cheese Fondue", "Rösti", "Artisan Swiss Chocolates"],
    neighborhoods: [
      { name: "Niederdorf (Old Town)", vibe: "Car-free medieval streets, historic guild houses, fondue taverns" },
      { name: "Zurich West", vibe: "Industrial-chic converted viaducts, trendy design, craft beer" },
      { name: "Enge & Seefeld", vibe: "Lakeside parks, bathhouses, elegant residential promenades" },
    ],
  },
];

const REGIONS = ["All Regions", "Europe", "Asia", "Americas"];
const VIBES = [
  "All Vibes",
  "Romantic",
  "Historic & Cultural",
  "Foodie & Culinary",
  "Nature & Adventure",
  "Coastal & Beach",
  "Budget Friendly",
  "Futuristic & Modern",
];
const COST_FILTERS = [
  { label: "All Budgets", value: "all" },
  { label: "Budget ($)", value: "budget", max: 50 },
  { label: "Moderate ($$)", value: "moderate", min: 50, max: 75 },
  { label: "Upscale ($$$)", value: "upscale", min: 75, max: 85 },
  { label: "Luxury ($$$$)", value: "luxury", min: 85 },
];

export default function CitySearch() {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedVibe, setSelectedVibe] = useState("All Vibes");
  const [selectedCost, setSelectedCost] = useState("all");
  const [sortBy, setSortBy] = useState("popularity"); // 'popularity' | 'cost-asc' | 'cost-desc' | 'name'

  // Comparison State (Max 3 cities)
  const [comparisonList, setComparisonList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Detail Modal State
  const [activeCityDetail, setActiveCityDetail] = useState(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Load saved wishlist destinations
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await api.get("/users/me/saved-destinations");
        if (Array.isArray(data)) {
          const names = new Set(data.map((d) => d.cityName.toLowerCase()));
          setWishlist(names);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    };
    fetchWishlist();
  }, []);

  const toggleWishlist = async (e, cityName) => {
    e.stopPropagation();
    const cityKey = cityName.toLowerCase();
    const isSaved = wishlist.has(cityKey);

    // Optimistic update
    const updated = new Set(wishlist);
    if (isSaved) updated.delete(cityKey);
    else updated.add(cityKey);
    setWishlist(updated);

    try {
      if (isSaved) {
        // Need to delete
        const data = await api.get("/users/me/saved-destinations");
        const found = data.find((d) => d.cityName.toLowerCase() === cityKey);
        if (found) await api.delete(`/users/me/saved-destinations/${found.id}`);
      } else {
        await api.post("/users/me/saved-destinations", { cityName });
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const toggleCompare = (e, city) => {
    e.stopPropagation();
    if (comparisonList.some((c) => c.id === city.id)) {
      setComparisonList(comparisonList.filter((c) => c.id !== city.id));
    } else {
      if (comparisonList.length >= 3) {
        alert("You can compare up to 3 cities simultaneously.");
        return;
      }
      setComparisonList([...comparisonList, city]);
    }
  };

  // Filter & Sort Computation
  const filteredCities = useMemo(() => {
    return GLOBAL_CITIES.filter((city) => {
      // Region
      if (selectedRegion !== "All Regions" && city.region !== selectedRegion) {
        return false;
      }

      // Vibe
      if (selectedVibe !== "All Vibes" && !city.vibes.includes(selectedVibe)) {
        return false;
      }

      // Cost Filter
      if (selectedCost !== "all") {
        const conf = COST_FILTERS.find((c) => c.value === selectedCost);
        if (conf?.min && city.costIndex < conf.min) return false;
        if (conf?.max && city.costIndex > conf.max) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = city.cityName.toLowerCase().includes(q);
        const countryMatch = city.country.toLowerCase().includes(q);
        const vibeMatch = city.vibes.some((v) => v.toLowerCase().includes(q));
        const landmarkMatch = city.landmarks.some((l) => l.toLowerCase().includes(q));
        if (!nameMatch && !countryMatch && !vibeMatch && !landmarkMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "cost-asc") return a.costIndex - b.costIndex;
      if (sortBy === "cost-desc") return b.costIndex - a.costIndex;
      if (sortBy === "name") return a.cityName.localeCompare(b.cityName);
      return 0;
    });
  }, [selectedRegion, selectedVibe, selectedCost, searchQuery, sortBy]);

  const getCostTier = (costIndex) => {
    if (costIndex < 50) return { label: "$", name: "Budget-Friendly", color: "text-emerald-500" };
    if (costIndex < 75) return { label: "$$", name: "Moderate", color: "text-blue-500" };
    if (costIndex < 85) return { label: "$$$", name: "Upscale", color: "text-amber-500" };
    return { label: "$$$$", name: "Luxury Tier", color: "text-purple-500" };
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-24">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Discovery Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-r from-primary/15 via-primary/5 to-background p-6 sm:p-10 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>World Destination Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore & Compare Global Cities 🌍
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Discover dream destinations tailored to your travel style. Filter by regional climate, estimated daily budget, cultural landmarks, and compare cities side-by-side.
            </p>

            {/* Global Search Bar */}
            <div className="relative max-w-xl pt-2">
              <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by city, country, vibe (e.g. 'romantic', 'temples', 'beaches')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-9 h-12 bg-background/90 text-sm shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div className="space-y-4 bg-card/60 border border-border/40 p-5 rounded-2xl backdrop-blur-xs">
          {/* Row 1: Region Pills & Sort */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Region Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {REGIONS.map((region) => {
                const active = selectedRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                      active
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="popularity">Popularity (High to Low)</option>
                <option value="cost-asc">Daily Cost (Budget First)</option>
                <option value="cost-desc">Daily Cost (Luxury First)</option>
                <option value="name">City Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Vibe Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-border/40">
            {VIBES.map((vibe) => {
              const active = selectedVibe === vibe;
              return (
                <button
                  key={vibe}
                  onClick={() => setSelectedVibe(vibe)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    active
                      ? "bg-foreground text-background font-semibold"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>

          {/* Row 3: Cost Level Filter */}
          <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Cost Tier:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {COST_FILTERS.map((cost) => (
                <button
                  key={cost.value}
                  onClick={() => setSelectedCost(cost.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedCost === cost.value
                      ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {cost.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Available Destinations</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {filteredCities.length} {filteredCities.length === 1 ? "City" : "Cities"}
            </span>
          </div>

          {(searchQuery || selectedRegion !== "All Regions" || selectedVibe !== "All Vibes" || selectedCost !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("All Regions");
                setSelectedVibe("All Vibes");
                setSelectedCost("all");
              }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* City Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => {
              const isWishlisted = wishlist.has(city.cityName.toLowerCase());
              const isCompared = comparisonList.some((c) => c.id === city.id);
              const costTier = getCostTier(city.costIndex);

              return (
                <Card
                  key={city.id}
                  onClick={() => setActiveCityDetail(city)}
                  className="group overflow-hidden border-border/50 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Banner */}
                    <div className="relative h-52 w-full overflow-hidden bg-muted">
                      <img
                        src={city.image}
                        alt={city.cityName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20">
                          {city.popularity}% Traveler Match
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Wishlist Heart */}
                          <button
                            onClick={(e) => toggleWishlist(e, city.cityName)}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                              isWishlisted
                                ? "bg-rose-500 text-white border-rose-400 scale-110 shadow-xs"
                                : "bg-black/40 text-white border-white/20 hover:bg-black/60"
                            }`}
                            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Banner City Identity */}
                      <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-xl tracking-tight leading-none drop-shadow-xs">
                            {city.cityName}
                          </h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 ${costTier.color}`}>
                            {costTier.label} • ~${city.dailyBudget}/day
                          </span>
                        </div>
                        <p className="text-xs text-white/80 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span>{city.country} • {city.region}</span>
                        </p>
                      </div>
                    </div>

                    {/* Body Content */}
                    <CardContent className="p-5 space-y-3.5">
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {city.description}
                      </p>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {city.vibes.slice(0, 3).map((v) => (
                          <span
                            key={v}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                          >
                            {v}
                          </span>
                        ))}
                      </div>

                      {/* Landmarks Mini-list */}
                      <div className="pt-2 border-t border-border/40 text-xs space-y-1">
                        <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Landmark className="w-3 h-3 text-primary" />
                          Iconic Sights:
                        </span>
                        <p className="text-xs font-medium text-foreground/90 truncate">
                          {city.landmarks.join(" • ")}
                        </p>
                      </div>
                    </CardContent>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 mt-1 flex items-center gap-2 border-t border-border/40 pt-3">
                    <Button
                      variant={isCompared ? "secondary" : "outline"}
                      size="sm"
                      onClick={(e) => toggleCompare(e, city)}
                      className={`text-xs gap-1.5 shrink-0 ${isCompared ? "border-primary text-primary" : ""}`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCompared ? "Comparing" : "Compare"}</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trips/new?name=${encodeURIComponent("Explore " + city.cityName)}&city=${encodeURIComponent(city.cityName)}`);
                      }}
                      className="flex-1 text-xs gap-1"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty / No Match State */
          <Card className="border-dashed border-2 border-border/80 bg-card/40 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="font-bold text-lg">No destinations match your filters</h3>
              <p className="text-xs text-muted-foreground">
                Try widening your cost tier, switching continent tabs, or clearing your keyword search.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("All Regions");
                setSelectedVibe("All Vibes");
                setSelectedCost("all");
              }}
            >
              Reset All Filters
            </Button>
          </Card>
        )}
      </main>

      {/* Sticky Bottom Comparison Tray */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-card/95 backdrop-blur-md border border-primary/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {comparisonList.map((c) => (
                  <img
                    key={c.id}
                    src={c.image}
                    alt={c.cityName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-xs"
                    title={c.cityName}
                  />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-bold">{comparisonList.length} of 3 cities</span>
                <p className="text-[11px] text-muted-foreground">Ready for side-by-side breakdown</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComparisonList([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setShowCompareModal(true)}
                className="text-xs font-semibold gap-1.5 shadow-sm"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Now</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight">Side-by-Side City Comparison</h3>
                <p className="text-xs text-muted-foreground">Compare costs, seasons, culinary highlights, and sights</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCompareModal(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Comparison Grid Table */}
            <div className={`grid grid-cols-1 md:grid-cols-${comparisonList.length} gap-6`}>
              {comparisonList.map((city) => (
                <div key={city.id} className="space-y-4 border border-border/60 p-4 rounded-2xl bg-secondary/30">
                  {/* City Card Image */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden">
                    <img src={city.image} alt={city.cityName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <h4 className="font-bold text-lg">{city.cityName}</h4>
                      <p className="text-xs text-white/80">{city.country}</p>
                    </div>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Estimated Budget</span>
                      <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        ~${city.dailyBudget} / day (Index {city.costIndex}/100)
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Best Season</span>
                      <p className="font-medium text-foreground">{city.bestSeason}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Primary Vibes</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {city.vibes.map((v) => (
                          <span key={v} className="text-[10px] px-2 py-0.5 rounded bg-background border border-border">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Top Landmark</span>
                      <p className="font-medium text-foreground">{city.landmarks[0]}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Signature Dishes</span>
                      <p className="font-medium text-foreground">{city.cuisine.slice(0, 2).join(", ")}</p>
                    </div>
                  </div>

                  {/* Plan CTA */}
                  <Button
                    size="sm"
                    className="w-full text-xs gap-1 pt-2"
                    onClick={() => {
                      setShowCompareModal(false);
                      navigate(`/trips/new?name=${encodeURIComponent("Explore " + city.cityName)}&city=${encodeURIComponent(city.cityName)}`);
                    }}
                  >
                    <span>Plan {city.cityName} Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* City Detail Modal View */}
      {activeCityDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-muted">
              <img
                src={activeCityDetail.image}
                alt={activeCityDetail.cityName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <button
                onClick={() => setActiveCityDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black">{activeCityDetail.cityName}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                    {activeCityDetail.popularity}% Match
                  </span>
                </div>
                <p className="text-xs text-white/80">{activeCityDetail.country} • {activeCityDetail.region}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeCityDetail.description}
            </p>

            {/* Travel Logistics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Estimated Budget
                </span>
                <p className="font-bold text-sm text-foreground">~${activeCityDetail.dailyBudget} / day</p>
                <p className="text-[10px] text-muted-foreground">Cost Index: {activeCityDetail.costIndex}/100</p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Best Time to Visit
                </span>
                <p className="font-bold text-xs text-foreground">{activeCityDetail.bestSeason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Climate & Weather
                </span>
                <p className="font-medium text-xs text-foreground">{activeCityDetail.climate}</p>
              </div>
            </div>

            {/* Top Landmarks & Food */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                  <Landmark className="w-4 h-4 text-primary" />
                  Iconic Landmarks & Sights
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  {activeCityDetail.landmarks.map((lm) => (
                    <li key={lm} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{lm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  Culinary & Local Flavors
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  {activeCityDetail.cuisine.map((food) => (
                    <li key={food} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Neighborhoods Guide */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-500" />
                Distinct Neighborhoods Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {activeCityDetail.neighborhoods.map((nh) => (
                  <div key={nh.name} className="p-3 rounded-xl bg-secondary/40 border border-border/60 space-y-1">
                    <p className="font-bold text-foreground">{nh.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{nh.vibe}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <button
                onClick={(e) => toggleWishlist(e, activeCityDetail.cityName)}
                className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Heart className={`w-4 h-4 ${wishlist.has(activeCityDetail.cityName.toLowerCase()) ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{wishlist.has(activeCityDetail.cityName.toLowerCase()) ? "Saved in Wishlist" : "Save to Wishlist"}</span>
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveCityDetail(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate(`/trips/new?name=${encodeURIComponent("Explore " + activeCityDetail.cityName)}&city=${encodeURIComponent(activeCityDetail.cityName)}`);
                  }}
                  className="gap-1.5"
                >
                  <span>Plan Trip to {activeCityDetail.cityName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
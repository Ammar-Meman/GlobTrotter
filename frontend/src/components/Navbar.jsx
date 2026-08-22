import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  Map,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Luggage,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { Button } from "./ui/button";
import Logo from "./Logo";

export default function Navbar({ transparent = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Compass },
    { name: "My Trips", href: "/trips", icon: Luggage },
    { name: "Explore Cities", href: "/cities", icon: Map },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;
  const isLight = transparent && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isLight
          ? "bg-slate-950/20 backdrop-blur-xs border-b border-white/10 text-white"
          : "bg-background/90 backdrop-blur-md border-b border-border/40 text-foreground supports-[backdrop-filter]:bg-background/70 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo
            size="sm"
            theme={isLight ? "light" : "dark"}
            to="/dashboard"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isLight
                      ? active
                        ? "bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 shadow-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      : active
                      ? "bg-secondary text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/trips/new">
              <Button
                size="sm"
                className={`gap-1.5 rounded-full font-semibold shadow-sm px-4 ${
                  isLight
                    ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25"
                    : "bg-sky-600 hover:bg-sky-700 text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>New Trip</span>
              </Button>
            </Link>

            <div className={`h-4 w-px mx-1 ${isLight ? "bg-white/20" : "bg-border/60"}`} />

            {/* User Profile info & Logout */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/profile"
                className={`flex items-center gap-2 text-sm p-1 rounded-full transition-colors ${
                  isLight
                    ? "text-white/90 hover:text-white hover:bg-white/15"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/60"
                }`}
                title={user?.name || "User Profile"}
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user?.name || "Avatar"}
                    className="w-8 h-8 rounded-full object-cover border border-white/30"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                      isLight
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                    }`}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
                  </div>
                )}
                <span className="font-semibold text-xs max-w-[110px] truncate">
                  {user?.name ? user.name.split(" ")[0] : "Traveler"}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className={`h-8 w-8 rounded-full ${
                  isLight
                    ? "text-white/70 hover:text-red-300 hover:bg-white/10"
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                }`}
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/trips/new">
              <Button
                size="sm"
                className={`h-8 px-3 text-xs gap-1 rounded-full font-semibold ${
                  isLight ? "bg-sky-500 text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`h-9 w-9 rounded-full ${isLight ? "text-white hover:bg-white/10" : ""}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-slate-950/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1 text-white animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 text-white font-semibold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
              </div>
              <span className="text-xs font-medium text-white/80">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-red-400 flex items-center gap-1 hover:underline"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

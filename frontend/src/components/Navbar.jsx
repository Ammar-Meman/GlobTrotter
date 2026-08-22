import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Globe,
  Plus,
  Compass,
  Map,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Luggage,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useLanguageStore from "../store/languageStore";
import { Button } from "./ui/button";

import Logo from "./Logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const t = useLanguageStore((state) => state.t);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: t("dashboard"), href: "/dashboard", icon: Compass },
    { name: t("myTrips"), href: "/trips", icon: Luggage },
    { name: t("exploreCities"), href: "/cities", icon: Map },
    { name: t("profile"), href: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="sm" showTagline={true} to="/dashboard" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-secondary text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/trips/new">
              <Button size="sm" className="gap-1.5 shadow-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>{t("newTrip")}</span>
              </Button>
            </Link>

            <div className="h-4 w-px bg-border/60 mx-1" />

            {/* User Profile info & Logout */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground p-1 rounded-full hover:bg-secondary/60 transition-colors"
                title={user?.name || "User Profile"}
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user?.name || "Avatar"}
                    className="w-8 h-8 rounded-full object-cover border border-border/80"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs border border-primary/20">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="font-medium text-xs max-w-[100px] truncate">
                  {user?.name ? user.name.split(" ")[0] : "Traveler"}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/trips/new">
              <Button size="sm" className="h-8 px-2.5 text-xs gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-destructive flex items-center gap-1 hover:underline"
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

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Globe,
  Plane,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
  Users,
  Compass,
  DollarSign,
  Share2,
  MapPin,
  Sparkles,
  Check,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function AuthPage({ initialMode = "login" }) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Sync mode with route changes
  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
    setServerError("");
  }, [location.pathname]);

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Signup Form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup, isSubmitting: isSubmittingSignup },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onLoginSubmit = async (values) => {
    setServerError("");
    try {
      const data = await api.post("/auth/login", values);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err.message || "Invalid email or password. Please try again.");
    }
  };

  const onSignupSubmit = async (values) => {
    setServerError("");
    try {
      const data = await api.post("/auth/signup", values);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setServerError(err.message || "Failed to create account. Please try again.");
    }
  };

  const toggleMode = (signupState) => {
    setIsSignup(signupState);
    setServerError("");
    setShowPassword(false);
    navigate(signupState ? "/signup" : "/login", { replace: true });
  };

  const isSubmitting = isSignup ? isSubmittingSignup : isSubmittingLogin;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden bg-slate-950 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Scenic Backgrounds with Smooth Crossfade */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          !isSignup ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2000&auto=format&fit=crop&q=85')",
        }}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          isSignup ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=2000&auto=format&fit=crop&q=85')",
        }}
      />

      {/* Atmospheric Overlays for Readability & Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-slate-950/20 backdrop-filter" />

      {/* Main Responsive Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 p-2 sm:p-4 lg:p-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[640px]">
          
          {/* ============================================================ */}
          {/* INFORMATIONAL / WELCOME PANEL (Sliding left or right)       */}
          {/* ============================================================ */}
          <div
            className={`transition-all duration-700 ease-in-out lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-8 ${
              isSignup ? "lg:order-2 lg:translate-x-0" : "lg:order-1 lg:translate-x-0"
            }`}
          >
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                GlobeTrotter
              </span>
            </div>

            {/* Middle Inspiring Hero Content */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
                {!isSignup ? (
                  <>
                    Plan. Explore.{" "}
                    <span className="text-blue-400 drop-shadow-md">Experience.</span>
                  </>
                ) : (
                  <>
                    Dream. Design.{" "}
                    <span className="text-emerald-400 drop-shadow-md">Discover.</span>
                  </>
                )}
              </h1>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-md drop-shadow-sm font-medium">
                {!isSignup
                  ? "Your journey begins here. Plan personalized multi-city trips, discover amazing local destinations, and make memories that last a lifetime."
                  : "Join thousands of world travelers building structured itineraries, estimating daily budgets, and sharing adventures with an inspiring community."}
              </p>
            </div>

            {/* Bottom 3 Floating Feature Highlights */}
            <div className="space-y-3 pt-2">
              {!isSignup ? (
                <>
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform duration-300 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">Explore Destinations</h4>
                      <p className="text-xs text-white/80">Find the best curated cities and landmarks worldwide.</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform duration-300 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">Plan Your Trip</h4>
                      <p className="text-xs text-white/80">Build custom day-by-day itineraries that fit your style.</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform duration-300 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">Share & Collaborate</h4>
                      <p className="text-xs text-white/80">Share your plans, copy trips, and travel together.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Signup Feature 1 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform duration-300 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">Multi-City Route Builder</h4>
                      <p className="text-xs text-white/80">Organize stops, travel dates, and activity durations with ease.</p>
                    </div>
                  </div>

                  {/* Signup Feature 2 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform duration-300 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">Smart Budget Forecasts</h4>
                      <p className="text-xs text-white/80">Real-time daily cost rollups and category spending alerts.</p>
                    </div>
                  </div>

                  {/* Signup Feature 3 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform duration-300 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">1-Click Public Sharing</h4>
                      <p className="text-xs text-white/80">Generate public links and clone community journeys instantly.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* INTERACTIVE FORM CARD (Sliding right or left)               */}
          {/* ============================================================ */}
          <div
            className={`transition-all duration-700 ease-in-out lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-border/80 flex flex-col justify-between space-y-6 ${
              isSignup ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {/* Form Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {!isSignup ? "Welcome Back!" : "Create an Account"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {!isSignup
                  ? "Login to continue planning your next adventure."
                  : "Sign up in seconds to start building custom itineraries."}
              </p>
            </div>

            {/* Error Notification */}
            {serverError && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-xs text-destructive flex items-center gap-2">
                <span className="font-semibold">Error:</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Form Body */}
            {!isSignup ? (
              /* LOGIN FORM */
              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-xs font-semibold text-foreground/90">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...registerLogin("email")}
                      className={`pl-10 h-11 text-sm bg-secondary/30 rounded-xl ${
                        errorsLogin.email ? "border-destructive ring-1 ring-destructive" : ""
                      }`}
                    />
                  </div>
                  {errorsLogin.email && (
                    <p className="text-[11px] text-destructive font-medium">{errorsLogin.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-xs font-semibold text-foreground/90">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...registerLogin("password")}
                      className={`pl-10 pr-10 h-11 text-sm bg-secondary/30 rounded-xl ${
                        errorsLogin.password ? "border-destructive ring-1 ring-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errorsLogin.password && (
                    <p className="text-[11px] text-destructive font-medium">{errorsLogin.password.message}</p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-border cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>

                {/* Primary Login Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all mt-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-xs font-semibold text-foreground/90">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      {...registerSignup("name")}
                      className={`pl-10 h-11 text-sm bg-secondary/30 rounded-xl ${
                        errorsSignup.name ? "border-destructive ring-1 ring-destructive" : ""
                      }`}
                    />
                  </div>
                  {errorsSignup.name && (
                    <p className="text-[11px] text-destructive font-medium">{errorsSignup.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-semibold text-foreground/90">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...registerSignup("email")}
                      className={`pl-10 h-11 text-sm bg-secondary/30 rounded-xl ${
                        errorsSignup.email ? "border-destructive ring-1 ring-destructive" : ""
                      }`}
                    />
                  </div>
                  {errorsSignup.email && (
                    <p className="text-[11px] text-destructive font-medium">{errorsSignup.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-semibold text-foreground/90">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      {...registerSignup("password")}
                      className={`pl-10 pr-10 h-11 text-sm bg-secondary/30 rounded-xl ${
                        errorsSignup.password ? "border-destructive ring-1 ring-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errorsSignup.password && (
                    <p className="text-[11px] text-destructive font-medium">{errorsSignup.password.message}</p>
                  )}
                </div>

                {/* Primary Signup Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all mt-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            )}

            {/* Social Logins Divider */}
            <div className="space-y-4 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/80" />
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => alert("Google SSO is connected for live OAuth.")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border/80 hover:bg-secondary/60 text-xs font-semibold text-foreground transition-all shadow-2xs hover:shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => alert("Facebook login is connected for live OAuth.")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border/80 hover:bg-secondary/60 text-xs font-semibold text-foreground transition-all shadow-2xs hover:shadow-xs"
                >
                  <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => alert("Apple Sign-In is connected for live OAuth.")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border/80 hover:bg-secondary/60 text-xs font-semibold text-foreground transition-all shadow-2xs hover:shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current text-foreground" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-1 .04-2.22.67-2.92 1.48-.6.69-1.13 1.83-1 2.93 1.12.09 2.27-.57 2.93-1.37z" />
                  </svg>
                  <span className="hidden sm:inline">Apple</span>
                </button>
              </div>
            </div>

            {/* Bottom Mode Switch Link */}
            <div className="text-center pt-2">
              {!isSignup ? (
                <p className="text-xs text-muted-foreground font-medium">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode(true)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground font-medium">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode(false)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

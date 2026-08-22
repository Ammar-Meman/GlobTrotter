import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
  Users,
  Compass,
  MapPin,
  Globe as GlobeIcon,
  Sparkles,
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

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AuthPage({ initialMode = "login" }) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Sync mode with current URL
  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
    setServerError("");
  }, [location.pathname]);

  // Login Form Hook
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Signup Form Hook
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup, isSubmitting: isSubmittingSignup },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: true,
    },
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
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      };
      const data = await api.post("/auth/signup", payload);
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
    setShowConfirmPassword(false);
    navigate(signupState ? "/signup" : "/login", { replace: true });
  };

  const isSubmitting = isSignup ? isSubmittingSignup : isSubmittingLogin;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-slate-100 overflow-hidden font-sans select-none">
      {/* Background 1: Login Scenic Nature/Lake Overlook */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          !isSignup ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop')",
        }}
      />

      {/* Background 2: Signup European City/Sunset Overlook */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          isSignup ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=85&w=2400&auto=format&fit=crop')",
        }}
      />

      {/* Subtle crisp ambient overlay to preserve text readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-filter" />

      {/* Main Full-Width Content Canvas */}
      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-[720px] flex items-center justify-between">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* INFORMATIONAL HERO SECTION                                   */}
          {/* ============================================================ */}
          <div
            className={`transition-all duration-700 ease-in-out lg:col-span-6 p-4 sm:p-8 flex flex-col justify-between space-y-8 ${
              isSignup ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-blue-600 bg-white/90 shadow-sm">
                <svg
                  className="w-5 h-5 text-blue-600 -rotate-45"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs">
                GlobeTrotter
              </span>
            </div>

            {/* Headline & Description */}
            <div className="space-y-4 max-w-lg">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
                Plan. Explore. <br />
                <span className="text-blue-600">Experience.</span>
              </h1>

              <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed max-w-md">
                Your journey begins here. Plan personalized trips, discover amazing destinations and make memories that last a lifetime.
              </p>
            </div>

            {/* 3 White Feature Cards */}
            <div className="space-y-3.5 max-w-md pt-2">
              {!isSignup ? (
                <>
                  {/* Item 1 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/80 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <GlobeIcon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Explore Destinations</h4>
                      <p className="text-xs text-slate-500 font-medium">Find the best places around the world.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/80 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <Calendar className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Plan Your Trip</h4>
                      <p className="text-xs text-slate-500 font-medium">Build custom itineraries that fit your style.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/80 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <Users className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Share & Collaborate</h4>
                      <p className="text-xs text-slate-500 font-medium">Share your plans and travel together.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Signup Item 1 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/80 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Discover Cities</h4>
                      <p className="text-xs text-slate-500 font-medium">Explore top destinations and hidden gems.</p>
                    </div>
                  </div>

                  {/* Signup Item 2 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/80 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Plan It Your Way</h4>
                      <p className="text-xs text-slate-500 font-medium">Build the perfect itinerary that fits your style.</p>
                    </div>
                  </div>

                  {/* Signup Item 3 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/80 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Share & Inspire</h4>
                      <p className="text-xs text-slate-500 font-medium">Share your trips and inspire other travelers.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SOLID WHITE ROUNDED FORM CARD                                */}
          {/* ============================================================ */}
          <div
            className={`transition-all duration-700 ease-in-out lg:col-span-6 bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.18)] border border-slate-100 flex flex-col justify-between space-y-6 ${
              isSignup ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {!isSignup ? "Welcome Back!" : "Create Your Account"}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {!isSignup
                  ? "Login to continue planning your next adventure."
                  : "Join GlobeTrotter and start planning your next adventure."}
              </p>
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 font-medium">
                {serverError}
              </div>
            )}

            {/* FORM */}
            {!isSignup ? (
              /* ================= LOGIN ================= */
              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...registerLogin("email")}
                      className={`pl-10 h-12 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-slate-800 ${
                        errorsLogin.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errorsLogin.email && (
                    <p className="text-[11px] text-red-500 font-medium">{errorsLogin.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...registerLogin("password")}
                      className={`pl-10 pr-10 h-12 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-slate-800 ${
                        errorsLogin.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errorsLogin.password && (
                    <p className="text-[11px] text-red-500 font-medium">{errorsLogin.password.message}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer accent-blue-600"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-3"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Login"}
                </Button>
              </form>
            ) : (
              /* ================= SIGNUP ================= */
              <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-xs font-semibold text-slate-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      {...registerSignup("name")}
                      className={`pl-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-slate-800 ${
                        errorsSignup.name ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errorsSignup.name && (
                    <p className="text-[11px] text-red-500 font-medium">{errorsSignup.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-semibold text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...registerSignup("email")}
                      className={`pl-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-slate-800 ${
                        errorsSignup.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errorsSignup.email && (
                    <p className="text-[11px] text-red-500 font-medium">{errorsSignup.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-semibold text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      {...registerSignup("password")}
                      className={`pl-10 pr-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-slate-800 ${
                        errorsSignup.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errorsSignup.password && (
                    <p className="text-[11px] text-red-500 font-medium">{errorsSignup.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirm" className="text-xs font-semibold text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      {...registerSignup("confirmPassword")}
                      className={`pl-10 pr-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-slate-800 ${
                        errorsSignup.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errorsSignup.confirmPassword && (
                    <p className="text-[11px] text-red-500 font-medium">{errorsSignup.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms agreement */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    {...registerSignup("agreeTerms")}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer accent-blue-600"
                  />
                  <label htmlFor="agreeTerms" className="text-xs font-medium text-slate-600 cursor-pointer">
                    I agree to the{" "}
                    <a href="#terms" className="text-blue-600 font-semibold hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-blue-600 font-semibold hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errorsSignup.agreeTerms && (
                  <p className="text-[11px] text-red-500 font-medium">{errorsSignup.agreeTerms.message}</p>
                )}

                {/* Submit Signup */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Sign Up"}
                </Button>
              </form>
            )}

            {/* Social Authentication Section */}
            <div className="space-y-3.5 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => alert("Google SSO is enabled.")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  onClick={() => alert("Facebook login is enabled.")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => alert("Apple Sign-In is enabled.")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900 shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-1 .04-2.22.67-2.92 1.48-.6.69-1.13 1.83-1 2.93 1.12.09 2.27-.57 2.93-1.37z" />
                  </svg>
                  <span className="hidden sm:inline">Apple</span>
                </button>
              </div>
            </div>

            {/* Bottom Toggle Switch */}
            <div className="text-center pt-2">
              {!isSignup ? (
                <p className="text-xs text-slate-500 font-medium">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode(true)}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-medium">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode(false)}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                  >
                    Login
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

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
  Globe,
  Calendar,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-slate-100 overflow-hidden font-sans select-none">
      {/* Background 1: Login Scenic Blue Mountain Lake with Bright Sky */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          !isSignup ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop')",
        }}
      />

      {/* Background 2: Signup European Waterfront & Bright City Skyline */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          isSignup ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=85&w=2400&auto=format&fit=crop')",
        }}
      />

      {/* Directional Soft Light Ambient Wash for 100% Crystal-Clear Readability */}
      <div
        className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
          !isSignup
            ? "bg-gradient-to-r from-white/95 via-white/60 to-white/10 sm:from-white/90 sm:via-white/50 sm:to-transparent"
            : "bg-gradient-to-l from-white/95 via-white/60 to-white/10 sm:from-white/90 sm:via-white/50 sm:to-transparent"
        }`}
      />

      {/* Main Full-Width Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-[660px] flex items-center justify-between">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ============================================================ */}
          {/* INFORMATIONAL HERO SECTION                                   */}
          {/* ============================================================ */}
          <div
            className={`transition-all duration-700 ease-in-out lg:col-span-6 p-4 sm:p-8 flex flex-col justify-between space-y-8 ${
              isSignup ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {/* Logo */}
            <div>
              <Logo size="lg" to={null} />
            </div>

            {/* Headline & Description with Ample Spacing and Large Typography */}
            <div className="space-y-4 max-w-xl">
              <h1 className="text-5xl sm:text-6xl lg:text-[56px] font-extrabold text-slate-950 tracking-tight leading-[1.1]">
                Plan. Explore. <br />
                <span className="text-blue-600">Experience.</span>
              </h1>

              <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed max-w-lg">
                Your journey begins here. Plan personalized multi-city trips, discover amazing destinations and make memories that last a lifetime.
              </p>
            </div>

            {/* 3 Clean Feature Items with Increased Spacing & Crisp Contrast */}
            <div className="space-y-5 max-w-lg pt-2">
              {!isSignup ? (
                <>
                  {/* Item 1 */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-slate-950">Explore Destinations</h4>
                      <p className="text-sm text-slate-700 font-medium">Find the best places around the world.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-slate-950">Plan Your Trip</h4>
                      <p className="text-sm text-slate-700 font-medium">Build custom itineraries that fit your style.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-slate-950">Share & Collaborate</h4>
                      <p className="text-sm text-slate-700 font-medium">Share your plans and travel together.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Signup Item 1 */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-slate-950">Discover Cities</h4>
                      <p className="text-sm text-slate-700 font-medium">Explore top destinations and hidden gems.</p>
                    </div>
                  </div>

                  {/* Signup Item 2 */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-slate-950">Plan It Your Way</h4>
                      <p className="text-sm text-slate-700 font-medium">Build the perfect itinerary that fits your style.</p>
                    </div>
                  </div>

                  {/* Signup Item 3 */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-slate-950">Share & Inspire</h4>
                      <p className="text-sm text-slate-700 font-medium">Share your trips and inspire other travelers.</p>
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
            <div className="space-y-1.5">
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                {!isSignup ? "Welcome Back!" : "Create Your Account"}
              </h2>
              <p className="text-sm text-slate-500 font-normal">
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
              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-5">
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
                      className={`pl-10 h-12 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-slate-800 ${
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
                      className={`pl-10 pr-10 h-12 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-slate-800 ${
                        errorsLogin.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-4 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Login"}
                </Button>
              </form>
            ) : (
              /* ================= SIGNUP ================= */
              <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
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
                      className={`pl-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 rounded-xl text-slate-800 ${
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
                      className={`pl-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 rounded-xl text-slate-800 ${
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
                      className={`pl-10 pr-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 rounded-xl text-slate-800 ${
                        errorsSignup.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                      className={`pl-10 pr-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 rounded-xl text-slate-800 ${
                        errorsSignup.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-2 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Sign Up"}
                </Button>
              </form>
            )}

            {/* Bottom Toggle Switch */}
            <div className="text-center pt-3 border-t border-slate-100">
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

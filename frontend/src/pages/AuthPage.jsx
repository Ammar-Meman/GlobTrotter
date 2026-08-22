import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ── Schemas ──────────────────────────────────────────────── */
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
    agreeTerms: z.boolean().refine((v) => v, {
      message: "You must agree to the Terms of Service & Privacy Policy",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ── Feature items ────────────────────────────────────────── */
const loginFeatures = [
  { icon: Globe, title: "Explore Destinations", desc: "Find the best places around the world." },
  { icon: Calendar, title: "Plan Your Trip", desc: "Build custom itineraries that fit your style." },
  { icon: Users, title: "Share & Collaborate", desc: "Share your plans and travel together." },
];
const signupFeatures = [
  { icon: MapPin, title: "Discover Cities", desc: "Explore top destinations and hidden gems." },
  { icon: Calendar, title: "Plan It Your Way", desc: "Build the perfect itinerary that fits your style." },
  { icon: Users, title: "Share & Inspire", desc: "Share your trips and inspire other travelers." },
];

/* ── Component ────────────────────────────────────────────── */
export default function AuthPage({ initialMode = "login" }) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const loginAction = useAuthStore((s) => s.login);

  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
    setServerError("");
  }, [location.pathname]);

  /* forms */
  const {
    register: rLogin,
    handleSubmit: hsLogin,
    formState: { errors: eLogin, isSubmitting: subLogin },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const {
    register: rSignup,
    handleSubmit: hsSignup,
    formState: { errors: eSignup, isSubmitting: subSignup },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", agreeTerms: true },
  });

  const onLogin = async (v) => {
    setServerError("");
    try {
      const d = await api.post("/auth/login", v);
      loginAction(d.token, d.user);
      navigate("/dashboard");
    } catch (e) {
      setServerError(e.message || "Invalid email or password.");
    }
  };
  const onSignup = async (v) => {
    setServerError("");
    try {
      const d = await api.post("/auth/signup", { name: v.name.trim(), email: v.email.trim(), password: v.password });
      loginAction(d.token, d.user);
      navigate("/dashboard");
    } catch (e) {
      setServerError(e.message || "Failed to create account.");
    }
  };

  const toggle = (toSignup) => {
    setIsSignup(toSignup);
    setServerError("");
    setShowPw(false);
    setShowConfirmPw(false);
    navigate(toSignup ? "/signup" : "/login", { replace: true });
  };

  const isSub = isSignup ? subSignup : subLogin;
  const features = isSignup ? signupFeatures : loginFeatures;

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-slate-950 overflow-hidden font-sans select-none">

      {/* ── Background images (opacity‑50 = natural, not washed out) ── */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${!isSignup ? "opacity-55" : "opacity-0"}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop')" }}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isSignup ? "opacity-55" : "opacity-0"}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=85&w=2400&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/10 to-slate-950/15" />

      {/* ── Desktop Layout ────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto hidden lg:block" style={{ minHeight: 680 }}>

        {/* Info panel – fades on the side opposite to the card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignup ? "info-r" : "info-l"}
            className={`absolute inset-y-0 w-1/2 flex flex-col justify-center px-10 ${isSignup ? "right-0" : "left-0"}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            {/* Logo – stands out with accent ring + size */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="relative w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-blue-400/40"
                style={{ boxShadow: "0 0 20px rgba(59,130,246,0.2), inset 0 0 12px rgba(59,130,246,0.08)" }}
              >
                <svg className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] text-white/40" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                </svg>
                <svg className="w-7 h-7 text-blue-300 -rotate-45 relative z-10 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-4xl font-black tracking-tight text-white leading-none"
                  style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.15)" }}
                >
                  GlobeTrotter
                </span>
                <span className="text-xs font-semibold text-blue-300/80 tracking-widest uppercase mt-1">Your Journey Starts Here</span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl lg:text-[58px] font-extrabold text-white tracking-tight leading-[1.1] mb-4"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              Plan. Explore. <br />
              <span className="text-blue-400">Experience.</span>
            </h1>

            <p
              className="text-white/90 text-lg font-medium leading-relaxed max-w-lg mb-8"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
            >
              Your journey begins here. Plan personalized multi-city trips, discover amazing destinations and make memories that last a lifetime.
            </p>

            {/* Feature rows */}
            <div className="space-y-4 max-w-lg">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>{f.title}</h4>
                      <p className="text-sm text-white/75 font-medium">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Form card – slides left↔right with spring */}
        <motion.div
          className="absolute inset-y-0 w-1/2 flex items-center px-6"
          animate={{ left: isSignup ? "0%" : "50%" }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <div className="w-full bg-white rounded-[32px] p-10 sm:p-12 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col space-y-6">
            <FormContent
              isSignup={isSignup} isSub={isSub} serverError={serverError}
              rLogin={rLogin} hsLogin={hsLogin} eLogin={eLogin} onLogin={onLogin}
              rSignup={rSignup} hsSignup={hsSignup} eSignup={eSignup} onSignup={onSignup}
              showPw={showPw} setShowPw={setShowPw} showConfirmPw={showConfirmPw} setShowConfirmPw={setShowConfirmPw}
              rememberMe={rememberMe} setRememberMe={setRememberMe} toggle={toggle}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Mobile Layout (stacked) ───────────────────────────── */}
      <div className="relative z-10 w-full max-w-md mx-auto lg:hidden space-y-6">
        {/* Mobile info */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="relative w-11 h-11 flex items-center justify-center rounded-xl border-2 border-blue-400/40"
            style={{ boxShadow: "0 0 16px rgba(59,130,246,0.2)" }}
          >
            <svg className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] text-white/40" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            <svg className="w-5 h-5 text-blue-300 -rotate-45 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white leading-none" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              GlobeTrotter
            </span>
            <span className="text-[10px] font-semibold text-blue-300/80 tracking-widest uppercase mt-0.5">Your Journey Starts Here</span>
          </div>
        </div>

        {/* Mobile form card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col space-y-6">
          <FormContent
            isSignup={isSignup} isSub={isSub} serverError={serverError}
            rLogin={rLogin} hsLogin={hsLogin} eLogin={eLogin} onLogin={onLogin}
            rSignup={rSignup} hsSignup={hsSignup} eSignup={eSignup} onSignup={onSignup}
            showPw={showPw} setShowPw={setShowPw} showConfirmPw={showConfirmPw} setShowConfirmPw={setShowConfirmPw}
            rememberMe={rememberMe} setRememberMe={setRememberMe} toggle={toggle}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Extracted form content (shared between desktop & mobile) ── */
function FormContent({
  isSignup, isSub, serverError,
  rLogin, hsLogin, eLogin, onLogin,
  rSignup, hsSignup, eSignup, onSignup,
  showPw, setShowPw, showConfirmPw, setShowConfirmPw,
  rememberMe, setRememberMe, toggle,
}) {
  return (
    <>
      <div className="space-y-1.5">
        <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          {!isSignup ? "Welcome Back!" : "Create Your Account"}
        </h2>
        <p className="text-sm text-slate-500">
          {!isSignup ? "Login to continue planning your next adventure." : "Join GlobeTrotter and start planning your next adventure."}
        </p>
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 font-medium">{serverError}</div>
      )}

      {!isSignup ? (
        /* ── Login ── */
        <form onSubmit={hsLogin(onLogin)} className="space-y-5">
          <Field id="email" label="Email" icon={Mail} type="email" placeholder="Enter your email" autoComplete="email"
            register={rLogin("email")} error={eLogin.email} />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
              <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input id="password" type={showPw ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password"
                {...rLogin("password")}
                className={`pl-10 pr-10 h-12 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-slate-800 ${eLogin.password ? "border-red-500" : ""}`} />
              <PwToggle show={showPw} set={setShowPw} />
            </div>
            {eLogin.password && <p className="text-[11px] text-red-500 font-medium">{eLogin.password.message}</p>}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer accent-blue-600" />
            <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">Remember me</label>
          </div>

          <SubmitBtn loading={isSub} label="Login" />
        </form>
      ) : (
        /* ── Signup ── */
        <form onSubmit={hsSignup(onSignup)} className="space-y-4">
          <Field id="signup-name" label="Full Name" icon={User} type="text" placeholder="Enter your full name" autoComplete="name"
            register={rSignup("name")} error={eSignup.name} h="h-11" />

          <Field id="signup-email" label="Email" icon={Mail} type="email" placeholder="Enter your email" autoComplete="email"
            register={rSignup("email")} error={eSignup.email} h="h-11" />

          <div className="space-y-1.5">
            <Label htmlFor="signup-password" className="text-xs font-semibold text-slate-700">Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input id="signup-password" type={showPw ? "text" : "password"} placeholder="Create a password" autoComplete="new-password"
                {...rSignup("password")}
                className={`pl-10 pr-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-slate-800 ${eSignup.password ? "border-red-500" : ""}`} />
              <PwToggle show={showPw} set={setShowPw} />
            </div>
            {eSignup.password && <p className="text-[11px] text-red-500 font-medium">{eSignup.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-confirm" className="text-xs font-semibold text-slate-700">Confirm Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input id="signup-confirm" type={showConfirmPw ? "text" : "password"} placeholder="Confirm your password" autoComplete="new-password"
                {...rSignup("confirmPassword")}
                className={`pl-10 pr-10 h-11 text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-slate-800 ${eSignup.confirmPassword ? "border-red-500" : ""}`} />
              <PwToggle show={showConfirmPw} set={setShowConfirmPw} />
            </div>
            {eSignup.confirmPassword && <p className="text-[11px] text-red-500 font-medium">{eSignup.confirmPassword.message}</p>}
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input id="agreeTerms" type="checkbox" {...rSignup("agreeTerms")}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 cursor-pointer accent-blue-600" />
            <label htmlFor="agreeTerms" className="text-xs font-medium text-slate-600 cursor-pointer">
              I agree to the <a href="#terms" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and <a href="#privacy" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
            </label>
          </div>
          {eSignup.agreeTerms && <p className="text-[11px] text-red-500 font-medium">{eSignup.agreeTerms.message}</p>}

          <SubmitBtn loading={isSub} label="Sign Up" />
        </form>
      )}

      <div className="text-center pt-3 border-t border-slate-100">
        {!isSignup ? (
          <p className="text-xs text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => toggle(true)} className="font-bold text-blue-600 hover:underline cursor-pointer ml-1">Sign up</button>
          </p>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{" "}
            <button type="button" onClick={() => toggle(false)} className="font-bold text-blue-600 hover:underline cursor-pointer ml-1">Login</button>
          </p>
        )}
      </div>
    </>
  );
}

/* ── Tiny helpers ──────────────────────────────────────────── */
function Field({ id, label, icon: Icon, register, error, h = "h-12", ...props }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-slate-700">{label}</Label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <Input id={id} {...props} {...register}
          className={`pl-10 ${h} text-sm bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-slate-800 ${error ? "border-red-500" : ""}`} />
      </div>
      {error && <p className="text-[11px] text-red-500 font-medium">{error.message}</p>}
    </div>
  );
}

function PwToggle({ show, set }) {
  return (
    <button type="button" onClick={() => set(!show)} tabIndex={-1}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <Button type="submit" disabled={loading}
      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-2 cursor-pointer">
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : label}
    </Button>
  );
}

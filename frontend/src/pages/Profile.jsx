import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Languages,
  Camera,
  Upload,
  Loader2,
  Check,
  Save,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Shield,
  Compass,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  language: z.string().min(1, "Please select a language"),
  photoUrl: z.string().optional().or(z.literal("")),
});

const LANGUAGES = [
  { code: "en", name: "English (US)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "de", name: "Deutsch (German)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ja", name: "日本語 (Japanese)" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();

  const [avatarPreview, setAvatarPreview] = useState(user?.photoUrl || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Saved Destinations State
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  // Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      language: user?.language || "en",
      photoUrl: user?.photoUrl || "",
    },
  });

  // Sync initial user state
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        language: user.language || "en",
        photoUrl: user.photoUrl || "",
      });
      setAvatarPreview(user.photoUrl || "");
    }
  }, [user, reset]);

  // Fetch saved destinations
  useEffect(() => {
    const loadSavedDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const data = await api.get("/users/me/saved-destinations");
        setSavedDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load saved destinations:", err);
      } finally {
        setLoadingDestinations(false);
      }
    };

    loadSavedDestinations();
  }, []);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setServerError("");
    try {
      const res = await api.upload(file);
      if (res?.url) {
        setAvatarPreview(res.url);
        setValue("photoUrl", res.url, { shouldDirty: true });
      }
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setServerError("Failed to upload image. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = async (values) => {
    setServerError("");
    setSaveSuccess(false);
    try {
      const payload = {
        name: values.name.trim(),
        language: values.language,
        photoUrl: values.photoUrl || avatarPreview || null,
      };

      const updated = await api.put("/users/me", payload);
      updateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setServerError(err.message || "Failed to update profile settings.");
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    setAddingCity(true);
    try {
      const created = await api.post("/users/me/saved-destinations", {
        cityName: newCityName.trim(),
      });
      setSavedDestinations((prev) => [...prev, created]);
      setNewCityName("");
    } catch (err) {
      console.error("Failed to add destination:", err);
    } finally {
      setAddingCity(false);
    }
  };

  const handleRemoveDestination = async (id) => {
    try {
      await api.delete(`/users/me/saved-destinations/${id}`);
      setSavedDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to remove destination:", err);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.delete("/users/me");
      logout();
      navigate("/signup");
    } catch (err) {
      console.error("Account deletion failed:", err);
      setServerError("Failed to delete account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Strip */}
        <div className="border-b border-border/40 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Account & Profile</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal profile, preferred language, travel bucket list, and security preferences.
          </p>
        </div>

        {serverError && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        {saveSuccess && (
          <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile information successfully updated!</span>
          </div>
        )}

        {/* Profile Card & Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Quick Info Summary */}
          <Card className="border-border/50 h-fit">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              {/* Avatar with Upload Badge */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/30 bg-muted shadow-sm flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={user?.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary font-bold text-3xl flex items-center justify-center">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>

                <label
                  htmlFor="avatar-file"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                  title="Upload profile photo"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
                <input
                  id="avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg">{user?.name || "Travel Enthusiast"}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {user?.isAdmin ? "Administrator" : "Globetrotter"}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                    Member
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2 border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your name, contact details, and display preferences.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email (Read Only or Informational) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Registered Account</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled
                    className="bg-muted/40 cursor-not-allowed opacity-80"
                  />
                </div>

                {/* Language Preference */}
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-primary" />
                    Preferred Language
                  </Label>
                  <select
                    id="language"
                    {...register("language")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Photo URL (Direct input option) */}
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">Avatar Photo URL</Label>
                  <Input
                    id="photoUrl"
                    placeholder="https://images.unsplash.com/..."
                    {...register("photoUrl")}
                    onChange={(e) => setAvatarPreview(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Direct image link, or use the camera icon on the avatar card to upload.
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end pt-3 border-t border-border/40">
                  <Button type="submit" disabled={isSubmitting} className="gap-2 px-6">
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? "Saving Changes..." : "Save Changes"}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Saved Wishlist Destinations */}
        <Card className="border-border/50 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Saved Wishlist Destinations
            </CardTitle>
            <CardDescription>
              Keep a bucket list of dream cities you plan to visit. Easily convert any saved city into a new journey.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Add Destination Input Form */}
            <form onSubmit={handleAddDestination} className="flex gap-2 max-w-md">
              <Input
                placeholder="e.g. Kyoto, Reykjavik, Zurich, Sydney..."
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                disabled={addingCity}
              />
              <Button type="submit" size="sm" disabled={addingCity || !newCityName.trim()} className="gap-1.5 shrink-0">
                {addingCity ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add City</span>
              </Button>
            </form>

            {/* Destination Badges / List */}
            {loadingDestinations ? (
              <div className="flex gap-2 animate-pulse py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-8 w-24 bg-muted/60 rounded-full" />
                ))}
              </div>
            ) : savedDestinations.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border/80 text-xs font-medium group hover:border-primary/40 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{dest.cityName}</span>

                    {/* Shortcut to plan trip */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/trips/new?name=${encodeURIComponent("Explore " + dest.cityName)}&city=${encodeURIComponent(
                            dest.cityName
                          )}`
                        )
                      }
                      className="text-[10px] text-primary hover:underline font-semibold ml-1"
                      title="Plan a trip to this city"
                    >
                      Plan →
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(dest.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                      title="Remove from saved wishlist"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border/80 rounded-xl bg-card/40 space-y-1.5">
                <Compass className="w-6 h-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-medium">No saved wishlist destinations yet.</p>
                <p className="text-[11px] text-muted-foreground">
                  Type a city name above to keep track of your dream travel stops.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs">
              Permanently delete your account and all associated itineraries, stops, activities, and wishlist items.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground max-w-lg">
              Once deleted, your travel data cannot be recovered. Please export any important itineraries before proceeding.
            </p>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="shrink-0"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border/80 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Delete Account</h3>
                <p className="text-xs text-muted-foreground">Permanent action</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete your GlobeTrotter account? All your trips, custom itineraries, and saved destinations will be immediately removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeletingAccount}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="gap-1.5"
              >
                {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeletingAccount ? "Deleting..." : "Permanently Delete"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
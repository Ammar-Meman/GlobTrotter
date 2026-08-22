import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Compass,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Loader2,
  ArrowLeft,
  Sparkles,
  Check,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useTripStore from "@/store/tripStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PRESET_COVERS = [
  {
    name: "European Alps",
    url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Tokyo Nightline",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Rome Colosseum",
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Tropical Bali",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Kyoto Fall Temples",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Barcelona Coast",
    url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&auto=format&fit=crop&q=80",
  },
];

const createTripSchema = z
  .object({
    name: z.string().min(2, "Trip name must be at least 2 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().optional(),
    budgetLimit: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === "" || val === undefined ? null : Number(val))),
    coverPhoto: z.string().url("Please select or enter a valid image URL").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    }
  );

export default function CreateTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createTrip = useTripStore((state) => state.createTrip);

  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0].url);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [serverError, setServerError] = useState("");

  const initialName = searchParams.get("name") || "";
  const initialCity = searchParams.get("city") || "";

  // Compute default start/end dates (tomorrow to +7 days)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 8 * 86400000).toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: initialName || (initialCity ? `Explore ${initialCity}` : ""),
      startDate: tomorrow,
      endDate: nextWeek,
      description: initialCity ? `Unforgettable exploration in and around ${initialCity}.` : "",
      budgetLimit: "",
      coverPhoto: PRESET_COVERS[0].url,
    },
  });

  const currentCover = watch("coverPhoto");

  const handlePresetSelect = (url) => {
    setSelectedCover(url);
    setValue("coverPhoto", url);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setServerError("");
    try {
      const res = await api.upload(file);
      if (res?.url) {
        setSelectedCover(res.url);
        setValue("coverPhoto", res.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setServerError("Failed to upload cover photo. Please try a preset or URL.");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const payload = {
        name: values.name.trim(),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        description: values.description ? values.description.trim() : "",
        coverPhoto: values.coverPhoto || selectedCover,
        budgetLimit: values.budgetLimit || null,
      };

      const newTrip = await createTrip(payload);
      if (newTrip?.id) {
        navigate(`/trips/${newTrip.id}/edit`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setServerError(err.message || "Failed to create trip. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create New Trip</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Set up the foundations of your journey and start building your custom itinerary
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of Planning</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {serverError && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {/* Primary Trip Details Card */}
          <Card className="border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                Trip Fundamentals
              </CardTitle>
              <CardDescription>Give your journey an inspiring name and set your travel window.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Trip Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Summer European Grand Tour, Japanese Cherry Blossom Trek"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className={errors.startDate ? "border-destructive" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className={errors.endDate ? "border-destructive" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-destructive">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Trip Vision / Notes (Optional)</Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="What is the goal of this journey? Notes on travelers, travel style, or special occasions..."
                  {...register("description")}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Budget Limit */}
              <div className="space-y-2">
                <Label htmlFor="budgetLimit" className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Estimated Budget Target (USD)
                </Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  placeholder="e.g. 2500"
                  min="0"
                  step="50"
                  {...register("budgetLimit")}
                />
                <p className="text-[11px] text-muted-foreground">
                  Used in the Budget Tracker to highlight daily spending and thresholds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cover Photo Customization Card */}
          <Card className="border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Cover Visual
              </CardTitle>
              <CardDescription>Choose a scenic destination wallpaper or upload your own custom photo.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Selected Photo Preview */}
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-border/60 bg-muted">
                <img
                  src={selectedCover}
                  alt="Selected cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                    Active Cover Preview
                  </span>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Select a Curated Wallpaper
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {PRESET_COVERS.map((preset) => {
                    const isSelected = selectedCover === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handlePresetSelect(preset.url)}
                        className={`group relative rounded-xl overflow-hidden h-20 border-2 transition-all text-left ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Custom File */}
              <div className="pt-2 border-t border-border/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <Label htmlFor="custom-upload" className="text-sm font-medium">
                      Upload Custom Cover Photo
                    </Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, or WebP up to 5MB</p>
                  </div>

                  <div className="relative">
                    <input
                      id="custom-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <label htmlFor="custom-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingImage}
                        className="cursor-pointer gap-1.5"
                        asChild
                      >
                        <span>
                          {uploadingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          {uploadingImage ? "Uploading..." : "Browse Image"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadingImage} className="gap-2 px-6">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? "Creating Trip..." : "Create Trip & Add Stops →"}</span>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
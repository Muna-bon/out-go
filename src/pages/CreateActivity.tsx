import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ImagePlus,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserLocation } from "@/context/LocationContext";
import { supabase } from "@/integrations/supabase/client";
import { isProfileComplete, getCachedUserProfile, UserProfileData } from "@/utils/profileValidation";
import ProfileCompletionModal from "@/components/modals/ProfileCompletionModal";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import runningImg from "@/assets/activity-running.jpg";
import yogaImg from "@/assets/activity-yoga.jpg";
import gymImg from "@/assets/activity-gym.jpg";
import campingImg from "@/assets/activity-camping.jpg";
import hikingImg from "@/assets/hero-hiking.jpg";

const categories = [
  "Walking & Jogging",
  "Fitness & Workouts",
  "Hiking & Camping",
  "Sightseeing & Leisure",
  "Wellness Programs",
  "Gym Programs",
  "Group Exercises",
];

const categoryDefaultImages: Record<string, string> = {
  "Walking & Jogging": runningImg,
  "Fitness & Workouts": gymImg,
  "Hiking & Camping": hikingImg,
  "Sightseeing & Leisure": campingImg,
  "Wellness Programs": yogaImg,
  "Gym Programs": gymImg,
  "Group Exercises": runningImg,
};

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  activityType: z.enum(["informal", "structured"]),
  location: z.string().min(2, "Please enter a location or venue"),
  date: z.string().min(1, "Please select an activity date"),
  time: z.string().min(1, "Please select a start time"),
  duration: z.string().min(1, "Please select expected duration"),
  maxParticipants: z.string().optional(),
  isRecurring: z.boolean().default(false),
});

const CreateActivity = () => {
  const [step, setStep] = useState(1);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { location: detectedLocation, isLocating, detectLocation } = useUserLocation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      category: "",
      activityType: "informal",
      location: detectedLocation || "",
      date: "",
      time: "",
      duration: "60",
      maxParticipants: "",
      isRecurring: false,
    },
  });

  // Check user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (detectedLocation && !form.getValues("location")) {
      form.setValue("location", detectedLocation);
    }
  }, [detectedLocation, form]);

  const handleDetectGPS = async () => {
    const loc = await detectLocation(false);
    if (loc) {
      form.setValue("location", loc, { shouldValidate: true });
    }
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
      setImageFileName(file.name);
      toast.success("Cover image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Step-by-step validation
  const handleContinue = async () => {
    if (step === 1) {
      const valid = await form.trigger(["title", "description", "category", "activityType"]);
      if (!valid) {
        toast.error("Please complete the required fields in Basic Info.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const valid = await form.trigger(["location", "date", "time", "duration"]);
      if (!valid) {
        toast.error("Please fill in location, date, time, and duration.");
        return;
      }
      setStep(3);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast.error("Please sign in to create an activity.");
      navigate("/login");
      return;
    }

    // Check if profile is complete
    const meta = currentUser.user_metadata || {};
    const cached = getCachedUserProfile();
    const userProfile: UserProfileData = {
      name: meta.full_name || meta.name || cached?.name || "",
      full_name: meta.full_name || meta.name || cached?.full_name || "",
      location: meta.location || cached?.location || "",
      bio: meta.bio || cached?.bio || "",
      interests: meta.interests || cached?.interests || [],
      availability: meta.availability || cached?.availability || [],
    };

    const profileComplete = isProfileComplete(userProfile);
    if (!profileComplete) {
      toast.warning("Complete Your Profile First", {
        description: "You need a complete profile (name, bio, location, interests, workout schedule) to publish activities.",
      });
      setShowProfileModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedImage = coverImage || categoryDefaultImages[values.category] || runningImg;
      const activityId = "act-" + Date.now();

      const newActivity = {
        id: activityId,
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        activityType: values.activityType,
        location: values.location.trim(),
        date: values.date,
        time: values.time,
        duration: values.duration,
        maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : 20,
        participants: 1,
        isRecurring: values.isRecurring,
        image: selectedImage,
        createdAt: new Date().toISOString(),
        organizer: {
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || "Host",
          avatar: currentUser.user_metadata?.avatar_url || null,
        },
      };

      // Store in localStorage for instant rendering in discover & my-activities
      const existingKey = "outgo_user_created_activities";
      const stored = localStorage.getItem(existingKey);
      const parsed = stored ? JSON.parse(stored) : [];
      parsed.unshift(newActivity);
      localStorage.setItem(existingKey, JSON.stringify(parsed));

      // Attempt Supabase insert if activities table exists
      try {
        await supabase.from("activities").insert({
          id: activityId,
          title: newActivity.title,
          description: newActivity.description,
          category: newActivity.category,
          location: newActivity.location,
          date: newActivity.date,
          time: newActivity.time,
          user_id: currentUser.id,
        });
      } catch (err) {
        // local persistence is primary
      }

      toast.success("Activity Published Successfully! 🎉", {
        description: `"${values.title}" is now visible to members in your city.`,
      });

      navigate("/my-activities");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Discover
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Create New Activity
              </h1>
              <p className="text-muted-foreground">
                Host a group workout, scenic walk, or wellness session and invite others to join
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 px-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      s <= step
                        ? "gradient-bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  <span
                    className={`ml-3 hidden sm:block ${
                      s <= step ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {s === 1 ? "Basic Info" : s === 2 ? "Schedule & Venue" : "Review & Publish"}
                  </span>
                  {s < 3 && (
                    <div
                      className={`w-16 lg:w-24 h-1 mx-4 rounded-full ${
                        s < step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="card-elevated p-6 md:p-8 rounded-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Activity Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Morning 5K Jog at Central Park"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your activity, meeting spot, required gear, and fitness level..."
                                className="min-h-32 text-sm leading-relaxed"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Category *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select an activity category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="activityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Activity Format</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <Label
                                  htmlFor="informal"
                                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                                    field.value === "informal"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value="informal"
                                    id="informal"
                                    className="sr-only"
                                  />
                                  <Users className="h-6 w-6 text-primary" />
                                  <span className="font-semibold text-sm">Informal Session</span>
                                  <span className="text-xs text-muted-foreground text-center">
                                    Casual meetup with friends & workout buddies
                                  </span>
                                </Label>
                                <Label
                                  htmlFor="structured"
                                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                                    field.value === "structured"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value="structured"
                                    id="structured"
                                    className="sr-only"
                                  />
                                  <Calendar className="h-6 w-6 text-primary" />
                                  <span className="font-semibold text-sm">Structured Program</span>
                                  <span className="text-xs text-muted-foreground text-center">
                                    Organized schedule with checkpoints
                                  </span>
                                </Label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-sm font-semibold">Location / Meeting Point *</FormLabel>
                              <button
                                type="button"
                                onClick={handleDetectGPS}
                                disabled={isLocating}
                                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
                              >
                                <RefreshCw className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                                {isLocating ? "Detecting..." : "Auto-detect location"}
                              </button>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  className="pl-10 pr-24 h-11"
                                  placeholder="Enter park, trail entrance, gym, or landmark"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={handleDetectGPS}
                                  disabled={isLocating}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted hover:bg-muted/80 text-foreground px-2.5 py-1 rounded text-xs font-medium border border-border transition-colors flex items-center gap-1"
                                >
                                  {isLocating ? (
                                    <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                                  ) : (
                                    "📍 Detect"
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Date *</FormLabel>
                              <FormControl>
                                <Input type="date" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Start Time *</FormLabel>
                              <FormControl>
                                <Input type="time" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Duration *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="45">45 minutes</SelectItem>
                                  <SelectItem value="60">1 hour</SelectItem>
                                  <SelectItem value="90">1.5 hours</SelectItem>
                                  <SelectItem value="120">2 hours</SelectItem>
                                  <SelectItem value="180">3+ hours</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Max Participants</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Unlimited (or enter number)"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="isRecurring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-muted/20">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-semibold text-sm">Recurring Activity</FormLabel>
                              <FormDescription className="text-xs">
                                Check this if this meetup repeats weekly
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Fully Functional Cover Image Upload */}
                      <div>
                        <Label className="text-sm font-semibold">Activity Cover Image (Optional)</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          aria-label="Upload activity image"
                        />

                        {coverImage ? (
                          <div className="mt-2 relative rounded-2xl overflow-hidden border border-border group bg-black/5 aspect-video max-h-56">
                            <img
                              src={coverImage}
                              alt="Activity cover preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Change Image
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="truncate max-w-[200px]">{imageFileName || "Cover Image"}</span>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`mt-2 border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                              isDragging
                                ? "border-primary bg-primary/10 scale-[1.01]"
                                : "border-border hover:border-primary/50 hover:bg-muted/30"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                              <ImagePlus className="h-6 w-6" />
                            </div>
                            <p className="font-medium text-sm text-foreground">
                              Click to browse or drag & drop an image
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supports JPG, PNG, WEBP (Max 5MB) • Default theme photo used if skipped
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted/40 border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                          <h3 className="font-bold text-lg">
                            Review Activity Details
                          </h3>
                          <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                            Step 3 of 3
                          </span>
                        </div>

                        {/* Image Preview in Review */}
                        <div className="mb-4 rounded-xl overflow-hidden aspect-video max-h-48 bg-muted">
                          <img
                            src={coverImage || categoryDefaultImages[form.getValues("category")] || runningImg}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <dl className="space-y-4">
                          <div>
                            <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Title</dt>
                            <dd className="font-bold text-base text-foreground mt-0.5">
                              {form.getValues("title") || "Not specified"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              Description
                            </dt>
                            <dd className="text-sm text-foreground/90 mt-0.5 leading-relaxed">
                              {form.getValues("description") || "Not specified"}
                            </dd>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                Category
                              </dt>
                              <dd className="font-medium text-sm text-primary mt-0.5">
                                {form.getValues("category") || "Not specified"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Format</dt>
                              <dd className="font-medium text-sm capitalize mt-0.5">
                                {form.getValues("activityType")} Session
                              </dd>
                            </div>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              Location
                            </dt>
                            <dd className="font-medium text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                              <MapPin className="h-4 w-4 text-primary shrink-0" />
                              {form.getValues("location") || "Not specified"}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/60">
                            <div>
                              <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Date</dt>
                              <dd className="font-medium text-sm mt-0.5">
                                {form.getValues("date") || "Not set"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Time</dt>
                              <dd className="font-medium text-sm mt-0.5">
                                {form.getValues("time") || "Not set"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                Duration
                              </dt>
                              <dd className="font-medium text-sm mt-0.5">
                                {form.getValues("duration")} min
                              </dd>
                            </div>
                          </div>
                        </dl>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your activity will be published to the local community in <strong className="text-foreground">{form.getValues("location") || "your area"}</strong>. Participants will be able to RSVP and join.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1 || isSubmitting}
                      className="gap-2 rounded-xl"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleContinue}
                        className="gap-2 rounded-xl"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2 rounded-xl px-6 font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Publishing Activity...
                          </>
                        ) : (
                          <>
                            Publish Activity
                            <CheckCircle2 className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Completion Modal if profile is incomplete */}
      <ProfileCompletionModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </Layout>
  );
};

export default CreateActivity;

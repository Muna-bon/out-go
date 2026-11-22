import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Heart,
  Clock,
  CheckCircle2,
  X,
  RefreshCw,
  Compass,
  ShieldCheck,
  Flame,
  ArrowRight,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUserLocation } from "@/context/LocationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/outgo-logo.png";

interface ProfileCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdated?: (updatedData: any) => void;
  initialData?: {
    name?: string;
    location?: string;
    bio?: string;
    interests?: string[];
    availability?: string[];
  };
}

const AVAILABLE_INTERESTS = [
  "Running",
  "Walking & Jogging",
  "Yoga & Pilates",
  "Hiking",
  "Gym & Fitness",
  "Cycling",
  "Wellness",
  "Camping",
  "Swimming",
  "Tennis",
];

const AVAILABLE_AVAILABILITY = [
  "Weekday Mornings (6 AM - 9 AM)",
  "Weekday Evenings (5 PM - 8 PM)",
  "Weekend Mornings",
  "Weekend Afternoons",
  "Flexible / Any Time",
];

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  open,
  onOpenChange,
  onProfileUpdated,
  initialData,
}) => {
  const { location: detectedLocation, isLocating, detectLocation } = useUserLocation();

  const [name, setName] = useState(initialData?.name || "");
  const [location, setLocation] = useState(initialData?.location || detectedLocation || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [interests, setInterests] = useState<string[]>(
    initialData?.interests && initialData.interests.length > 0
      ? initialData.interests
      : ["Running", "Walking & Jogging"]
  );
  const [availability, setAvailability] = useState<string[]>(
    initialData?.availability && initialData.availability.length > 0
      ? initialData.availability
      : ["Weekend Mornings"]
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync initialData or detectedLocation if state is blank
  useEffect(() => {
    if (initialData?.name && !name) setName(initialData.name);
    if (initialData?.bio && !bio) setBio(initialData.bio);
    if (!location && (initialData?.location || detectedLocation)) {
      setLocation(initialData?.location || detectedLocation);
    }
  }, [initialData, detectedLocation]);

  const handleDetectGPS = async () => {
    const loc = await detectLocation(false);
    if (loc) {
      setLocation(loc);
    }
  };

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleAvailability = (item: string) => {
    setAvailability((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter or auto-detect your location.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update Supabase Auth metadata
      const { data: authData, error: authErr } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          name: name.trim(),
          location: location.trim(),
          bio: bio.trim(),
          interests,
          availability,
        },
      });

      if (authErr) {
        console.warn("Auth metadata update warning:", authErr.message);
      }

      // 2. Upsert to public.profiles table if authenticated
      const user = authData?.user;
      if (user) {
        try {
          await supabase.from("profiles").upsert({
            id: user.id,
            name: name.trim(),
            email: user.email,
            location: location.trim(),
            bio: bio.trim(),
            interests,
            preferred_time: availability.join(", "),
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Profiles table upsert warning:", dbErr);
        }
      }

      const updatedData = {
        name: name.trim(),
        location: location.trim(),
        bio: bio.trim(),
        interests,
        availability,
      };

      if (onProfileUpdated) {
        onProfileUpdated(updatedData);
      }

      toast.success("Profile completed successfully!", {
        description: "You're all set to discover activities and match with nearby partners.",
      });

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDismiss = () => {
    toast.info("Profile setup postponed", {
      description: "You can update your profile anytime to start matching with workout partners.",
      duration: 5000,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-border shadow-2xl rounded-2xl">
        {/* Animated Header Banner with Logo & Orbiting Badges */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 sm:p-8 text-center border-b border-border">
          {/* Subtle animated background radial glow */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-56 h-56 rounded-full bg-primary/20 blur-3xl pointer-events-none"
            />
          </div>

          {/* Close button in top right */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
            title="Close for now"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Animated OutGo Logo Badge */}
          <div className="relative inline-block mb-4">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white shadow-xl p-3 flex items-center justify-center border-2 border-primary/20 ring-4 ring-primary/10">
                <img
                  src={logo}
                  alt="OutGo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Orbiting Activity Badges */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 pointer-events-none"
              >
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <span>🏃</span>
                  <span>Move</span>
                </div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <span>🧘</span>
                  <span>Connect</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Unlock the Full OutGo Experience!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Welcome to the community! Take a quick minute to complete your profile so we can pair you with compatible activity partners and show events in your area.
          </DialogDescription>

          {/* 3 Key Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5 text-left">
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border/80 flex items-start gap-2.5">
              <Compass className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Local Activities</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Tailored to your neighborhood
                </p>
              </div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border/80 flex items-start gap-2.5">
              <Flame className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Matched Buddies</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Shared fitness pace & time
                </p>
              </div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border/80 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Verified Trust</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  3x more activity invites
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="modal-name" className="text-xs font-semibold">
                Your Full Name <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="modal-name"
                  placeholder="e.g. Alex Morgan"
                  className="pl-9 h-11 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-location" className="text-xs font-semibold">
                  Current City / Location <span className="text-primary">*</span>
                </Label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                  {isLocating ? "Detecting..." : "Auto-Detect GPS"}
                </button>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="modal-location"
                  placeholder="City, State / Country"
                  className="pl-9 pr-24 h-11 text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted hover:bg-muted/80 text-foreground px-2 py-1 rounded text-[11px] font-medium border border-border transition-colors"
                >
                  {isLocating ? "Locating..." : "📍 Detect"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="modal-bio" className="text-xs font-semibold">
              Short Bio & Fitness Aspirations
            </Label>
            <Textarea
              id="modal-bio"
              placeholder="e.g., Avid morning runner training for a 10K, love hiking scenic trails and casual weekend walks with coffee!"
              className="resize-none h-20 text-sm"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Activity Interests Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary" />
                Your Favorite Activities
              </Label>
              <span className="text-[11px] text-muted-foreground">Select all that apply</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_INTERESTS.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                When Are You Most Active?
              </Label>
              <span className="text-[11px] text-muted-foreground">Preferred schedules</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_AVAILABILITY.map((time) => {
                const active = availability.includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleAvailability(time)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanatory footer notice */}
          <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-xl border border-border">
            ℹ️ <span className="font-semibold text-foreground">Note:</span> You can close this modal and browse at any time, but completing your details now ensures you receive relevant activity recommendations, local match alerts, and verified status.
          </p>

          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDismiss}
              className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
            >
              Explore First, Complete Later
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto gap-2 px-6 shadow-md"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save & Unlock OutGo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionModal;

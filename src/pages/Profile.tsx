import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Calendar,
  Settings,
  Bell,
  LogOut,
  Edit2,
  Camera,
  Heart,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  RefreshCw,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ActivityCard from "@/components/cards/ActivityCard";
import ProfileCompletionModal from "@/components/modals/ProfileCompletionModal";
import { useUserLocation } from "@/context/LocationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";

const AVAILABLE_INTERESTS = [
  "Yoga",
  "Running",
  "Hiking",
  "Walking & Jogging",
  "Cycling",
  "Swimming",
  "Tennis",
  "Gym & Fitness",
  "Wellness",
  "Camping",
  "Rock Climbing",
  "Pilates",
];

const AVAILABLE_AVAILABILITY = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekend Mornings",
  "Weekend Afternoons",
  "Weekend Evenings",
];

const defaultUpcomingActivities = [
  {
    id: "1",
    title: "Sunrise Yoga in Central Park",
    category: "Wellness",
    image: yogaImage,
    location: "Central Park, New York",
    date: "Jan 25, 2026",
    time: "6:30 AM",
    participants: 18,
    maxParticipants: 25,
    organizer: "Sarah M.",
  },
  {
    id: "2",
    title: "Morning Run Club - Coastal Trail",
    category: "Walking & Jogging",
    image: runningImage,
    location: "Santa Monica Beach, LA",
    date: "Jan 26, 2026",
    time: "7:00 AM",
    participants: 12,
    maxParticipants: 20,
    organizer: "Mike R.",
  },
];

const Profile = () => {
  const { location: detectedLocation, isLocating, detectLocation } = useUserLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const shouldPromptUpdate = searchParams.get("prompt_update") === "true";
  const [showBanner, setShowBanner] = useState(shouldPromptUpdate);

  // Profile Data State
  const [profile, setProfile] = useState({
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    location: "New York, NY",
    joinDate: "October 2026",
    bio: "Yoga enthusiast | Morning runner | Adventure seeker looking for workout buddies.",
    avatar: null as string | null,
    interests: ["Yoga", "Running", "Hiking", "Wellness", "Camping"],
    availability: ["Weekday Mornings", "Weekend Afternoons"],
    stats: {
      activitiesJoined: 24,
      activitiesCreated: 8,
      connections: 156,
    },
  });

  // Modal edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check auth user and load profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const meta = user.user_metadata || {};
          let loadedName = meta.name || meta.full_name || user.email?.split("@")[0] || "OutGo Member";
          let loadedLocation = meta.location || "Location not set";
          let loadedBio = meta.bio || "Wellness enthusiast & active explorer.";
          let loadedInterests = Array.isArray(meta.interests) && meta.interests.length > 0
            ? meta.interests
            : ["Running", "Hiking", "Yoga"];
          let loadedAvailability = Array.isArray(meta.availability) && meta.availability.length > 0
            ? meta.availability
            : ["Weekend Mornings"];

          // Attempt to query the public.profiles database table
          try {
            const { data: dbProfile, error: dbError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();

            if (dbProfile && !dbError) {
              if (dbProfile.name) loadedName = dbProfile.name;
              if (dbProfile.location) loadedLocation = dbProfile.location;
              if (dbProfile.bio) loadedBio = dbProfile.bio;
              if (Array.isArray(dbProfile.interests) && dbProfile.interests.length > 0) {
                loadedInterests = dbProfile.interests;
              }
              if (dbProfile.preferred_time) {
                loadedAvailability = dbProfile.preferred_time.split(",").map((s: string) => s.trim());
              }
            }
          } catch (e) {
            console.warn("Could not query profiles table directly:", e);
          }

          setProfile((prev) => ({
            ...prev,
            name: loadedName,
            email: user.email || prev.email,
            location: loadedLocation,
            bio: loadedBio,
            interests: loadedInterests,
            availability: loadedAvailability,
            joinDate: user.created_at
              ? new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : prev.joinDate,
          }));
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, []);

  // Automatically open edit dialog if prompt_update parameter is present
  useEffect(() => {
    if (shouldPromptUpdate) {
      setIsEditModalOpen(true);
      setShowBanner(true);
    }
  }, [shouldPromptUpdate]);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully.");
      navigate("/login");
    } catch (err) {
      navigate("/login");
    }
  };

  return (
    <Layout>
      {/* Welcome & Update Notification Banner */}
      {showBanner && (
        <section className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-b border-primary/20 py-3.5 px-4">
          <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                  Complete your profile to unlock full OutGo features!
                  <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  Adding your location, bio, and favorite activities ensures you receive accurate partner matches, nearby activity alerts, and verified trust.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleOpenEditModal}
                className="gap-2 shadow-sm font-medium"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Complete Profile Now
              </Button>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background/80 transition-colors"
                title="Dismiss reminder banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Profile Header */}
      <section className="bg-muted/30 py-12">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8"
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar || undefined} />
                <AvatarFallback className="text-4xl gradient-bg-primary text-primary-foreground font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleOpenEditModal}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                title="Update photo & profile"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3 max-w-xl text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      {profile.location}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const detected = await detectLocation(false);
                        if (detected) {
                          setProfile((prev) => ({ ...prev, location: detected }));
                          try {
                            await supabase.auth.updateUser({
                              data: { location: detected },
                            });
                          } catch (e) {}
                        }
                      }}
                      disabled={isLocating}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-medium bg-primary/5 hover:bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 transition-colors"
                      title="Auto-detect current location via GPS"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                      {isLocating ? "Locating..." : "Auto-detect"}
                    </button>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      Joined {profile.joinDate}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleOpenEditModal}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {profile.stats.activitiesJoined}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    Joined
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {profile.stats.activitiesCreated}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {profile.stats.connections}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    Connections
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container-app">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Interests */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-elevated p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Interests
                  </h3>
                  <button
                    onClick={handleOpenEditModal}
                    className="text-xs text-primary hover:underline"
                  >
                    Update
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Availability
                  </h3>
                  <button
                    onClick={handleOpenEditModal}
                    className="text-xs text-primary hover:underline"
                  >
                    Update
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.availability.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {time}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-4 space-y-1"
              >
                <Link
                  to="/settings"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    Settings
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    Notifications
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="created">My Activities</TabsTrigger>
                  <TabsTrigger value="past">Past Activities</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="grid gap-6">
                    {defaultUpcomingActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ActivityCard {...activity} />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="created">
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No activities created yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first activity and invite others to join!
                    </p>
                    <Link to="/create">
                      <Button>Create Activity</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="past">
                  <div className="text-center py-12 text-muted-foreground">
                    No past activities to show.
                  </div>
                </TabsContent>

                <TabsContent value="saved">
                  <div className="text-center py-12 text-muted-foreground">
                    No saved activities yet.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Profile Completion Modal */}
      <ProfileCompletionModal
        open={isEditModalOpen}
        onOpenChange={(val) => {
          setIsEditModalOpen(val);
          if (!val && shouldPromptUpdate) {
            setSearchParams({});
          }
        }}
        onProfileUpdated={(updated) => {
          setProfile((prev) => ({
            ...prev,
            ...updated,
          }));
          setShowBanner(false);
        }}
        initialData={{
          name: profile.name,
          location: profile.location !== "Location not set" ? profile.location : detectedLocation || "",
          bio: profile.bio,
          interests: profile.interests,
          availability: profile.availability,
        }}
      />
    </Layout>
  );
};

export default Profile;

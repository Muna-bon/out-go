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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityCard from "@/components/cards/ActivityCard";
import ProfileCompletionModal from "@/components/modals/ProfileCompletionModal";
import SettingsModal from "@/components/modals/SettingsModal";
import { useUserLocation } from "@/context/LocationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { location: detectedLocation, isLocating, detectLocation } = useUserLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const shouldPromptUpdate = searchParams.get("prompt_update") === "true";
  const [showBanner, setShowBanner] = useState(shouldPromptUpdate);

  // Clean real profile state (no hardcoded mock user)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    joinDate: "",
    bio: "",
    avatar: null as string | null,
    interests: [] as string[],
    availability: [] as string[],
    stats: {
      activitiesJoined: 0,
      activitiesCreated: 0,
      connections: 0,
    },
  });

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"account" | "notifications" | "security">("account");

  // Check auth user and load profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // If not authenticated, redirect to login
          navigate("/login");
          return;
        }

        const meta = user.user_metadata || {};
        let loadedName = meta.full_name || meta.name || user.email?.split("@")[0] || "User";
        let loadedLocation = meta.location || (detectedLocation && detectedLocation !== "Detecting location..." ? detectedLocation : "");
        let loadedBio = meta.bio || "";
        let loadedInterests: string[] = Array.isArray(meta.interests) ? meta.interests : [];
        let loadedAvailability: string[] = Array.isArray(meta.availability) ? meta.availability : [];

        // Attempt to query the public.profiles database table if available
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
          // profiles table query is optional fallback
        }

        setProfile({
          name: loadedName,
          email: user.email || "",
          location: loadedLocation,
          bio: loadedBio,
          interests: loadedInterests,
          availability: loadedAvailability,
          avatar: meta.avatar_url || null,
          joinDate: user.created_at
            ? new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "Member",
          stats: {
            activitiesJoined: 0,
            activitiesCreated: 0,
            connections: 0,
          },
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [detectedLocation, navigate]);

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
      navigate("/");
    } catch (err) {
      navigate("/");
    }
  };

  const handleDetectGPS = async () => {
    const detected = await detectLocation(false);
    if (detected) {
      setProfile((prev) => ({ ...prev, location: detected }));
      try {
        await supabase.auth.updateUser({
          data: { location: detected },
        });
        toast.success(`Location set to ${detected}`);
      } catch (e) {}
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
                  Adding your location, bio, and favorite activities ensures you receive accurate partner matches and local workout alerts.
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
      <section className="bg-muted/30 py-12 border-b border-border/50">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar || undefined} />
                <AvatarFallback className="text-3xl sm:text-4xl gradient-bg-primary text-primary-foreground font-bold">
                  {(profile.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleOpenEditModal}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                title="Update profile details"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      {profile.name || (isLoadingUser ? "Loading..." : "OutGo Member")}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Member
                    </span>
                  </div>

                  {profile.email && (
                    <p className="text-xs text-muted-foreground mb-2">{profile.email}</p>
                  )}

                  <p className="text-muted-foreground mb-3 max-w-xl text-sm leading-relaxed">
                    {profile.bio || (
                      <span className="italic text-muted-foreground/70">
                        No bio added yet. Click 'Edit Profile' to tell potential activity partners about your fitness routine!
                      </span>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      {profile.location || "Location not set"}
                    </span>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isLocating}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-medium bg-primary/5 hover:bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 transition-colors"
                      title="Auto-detect current location"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                      {isLocating ? "Locating..." : "Auto-detect"}
                    </button>
                    {profile.joinDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        Joined {profile.joinDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Action Buttons: Edit, Settings, Log Out */}
                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl"
                    onClick={handleOpenEditModal}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl"
                    onClick={() => {
                      setSettingsTab("account");
                      setIsSettingsOpen(true);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
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
                    Partners
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
                className="card-elevated p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Activity Interests
                  </h3>
                  <button
                    onClick={handleOpenEditModal}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    {profile.interests.length > 0 ? "Edit" : "+ Add"}
                  </button>
                </div>
                {profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-muted/30 rounded-xl p-3 border border-dashed border-border/70">
                    <p className="text-xs text-muted-foreground mb-2">No activity interests selected yet.</p>
                    <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="text-xs h-8">
                      + Select Sports & Activities
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Workout Schedule
                  </h3>
                  <button
                    onClick={handleOpenEditModal}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    {profile.availability.length > 0 ? "Edit" : "+ Add"}
                  </button>
                </div>
                {profile.availability.length > 0 ? (
                  <div className="space-y-2">
                    {profile.availability.map((time) => (
                      <div
                        key={time}
                        className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-2 rounded-xl"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        {time}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-muted/30 rounded-xl p-3 border border-dashed border-border/70">
                    <p className="text-xs text-muted-foreground mb-2">No workout schedule set yet.</p>
                    <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="text-xs h-8">
                      + Add Availability
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-4 space-y-1 rounded-2xl"
              >
                <button
                  onClick={() => {
                    setSettingsTab("account");
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    Account Settings
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => {
                    setSettingsTab("notifications");
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    Notification Preferences
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Main Content Tabs */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-muted/60 p-1 rounded-xl">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="created">My Activities</TabsTrigger>
                  <TabsTrigger value="past">Past Activities</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl p-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="font-semibold text-lg mb-1">No upcoming activities yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Explore running groups, outdoor yoga sessions, and weekend fitness meetups happening near you.
                    </p>
                    <Link to="/discover">
                      <Button className="rounded-xl">Discover Activities</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="created">
                  <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl p-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No activities created yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                      Create your first activity, choose a meeting location, and invite others to join!
                    </p>
                    <Link to="/create">
                      <Button className="rounded-xl">Create Activity</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="past">
                  <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
                    No past activities to show.
                  </div>
                </TabsContent>

                <TabsContent value="saved">
                  <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
                    No saved activities yet. Click the bookmark icon on any activity in Discover to save it here.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Completion / Edit Modal */}
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
          location: profile.location || detectedLocation || "",
          bio: profile.bio,
          interests: profile.interests,
          availability: profile.availability,
        }}
      />

      {/* Account & Notifications Settings Modal */}
      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultTab={settingsTab}
      />
    </Layout>
  );
};

export default Profile;

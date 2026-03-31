import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActivityCard from "@/components/cards/ActivityCard";

import { useAuth } from "@/contexts/AuthContext";
import { getMyJoinedEvents, getMyCreatedEvents } from "@/lib/api";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const j = await getMyJoinedEvents();
        const c = await getMyCreatedEvents();
        setJoinedEvents(j);
        setCreatedEvents(c);
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return <Layout><div className="container-app py-12 text-center">Please login to view profile.</div></Layout>;

  // Provide fallbacks for user data 
  const profileData = {
    name: user.name || "User",
    location: user.location || "No location set",
    bio: user.bio || "Add a bio in settings to tell others about yourself.",
    interests: user.interests || [],
    joinDate: "Recently",
    stats: {
      activitiesJoined: joinedEvents.length,
      activitiesCreated: createdEvents.length,
      connections: user.completed_pairings || 0,
    }
  };

  return (
    <Layout>
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
                {user?.avatar_url && <AvatarImage src={user.avatar_url} />}
                <AvatarFallback className="text-4xl gradient-bg-primary text-primary-foreground">
                  {(profileData.name || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profileData.name}</h1>
                  <p className="text-muted-foreground mb-2">{profileData.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profileData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {profileData.joinDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/settings")}>
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
                  <div className="text-2xl font-bold">{profileData.stats.activitiesJoined}</div>
                  <div className="text-sm text-muted-foreground">Joined</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileData.stats.activitiesCreated}</div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileData.stats.connections}</div>
                  <div className="text-sm text-muted-foreground">Connections</div>
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
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests?.length > 0 ? profileData.interests.map((interest: string) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  )) : <span className="text-sm text-muted-foreground">No interests added yet.</span>}
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-6"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Availability
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    {user?.preferred_time || "Morning"} at {user?.pace || "Moderate"} pace
                  </div>
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
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
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
                    {joinedEvents.length > 0 ? joinedEvents.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ActivityCard {...activity} />
                      </motion.div>
                    )) : (
                      <div className="text-center py-12 text-muted-foreground card-elevated">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        You haven't joined any activities yet.
                        <div className="mt-4">
                          <Link to="/discover">
                            <Button variant="outline">Explore Activities</Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="created">
                  <div className="grid gap-6 mb-8">
                    {createdEvents.map((activity, index) => (
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

                  {createdEvents.length === 0 && (
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
                  )}
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
    </Layout>
  );
};

export default Profile;

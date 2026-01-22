import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";

const userProfile = {
  name: "Sarah Mitchell",
  email: "sarah@example.com",
  location: "New York, NY",
  joinDate: "January 2025",
  bio: "Yoga enthusiast | Morning runner | Adventure seeker",
  avatar: null,
  stats: {
    activitiesJoined: 24,
    activitiesCreated: 8,
    connections: 156,
  },
  interests: ["Yoga", "Running", "Hiking", "Wellness", "Camping"],
  availability: ["Weekday Mornings", "Weekend Afternoons"],
};

const upcomingActivities = [
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
  const [activeTab, setActiveTab] = useState("upcoming");

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
                <AvatarImage src={userProfile.avatar || undefined} />
                <AvatarFallback className="text-4xl gradient-bg-primary text-primary-foreground">
                  {userProfile.name.charAt(0)}
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
                  <h1 className="text-3xl font-bold mb-1">{userProfile.name}</h1>
                  <p className="text-muted-foreground mb-2">{userProfile.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {userProfile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {userProfile.joinDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
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
                  <div className="text-2xl font-bold">{userProfile.stats.activitiesJoined}</div>
                  <div className="text-sm text-muted-foreground">Joined</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.stats.activitiesCreated}</div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.stats.connections}</div>
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
                  {userProfile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
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
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Availability
                </h3>
                <div className="space-y-2">
                  {userProfile.availability.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-secondary" />
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
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
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
                    {upcomingActivities.map((activity, index) => (
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
    </Layout>
  );
};

export default Profile;

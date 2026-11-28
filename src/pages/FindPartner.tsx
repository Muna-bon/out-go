import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Filter, Users, Clock, Footprints, Search, Zap, RefreshCw, Sparkles, HeartHandshake } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PartnerCard from "@/components/cards/PartnerCard";
import { useUserLocation } from "@/context/LocationContext";
import { supabase } from "@/integrations/supabase/client";

const basePartners = [
  {
    id: "partner-munah-doe",
    name: "Munah Doe",
    avatar: null,
    age: 25,
    distance: "0.2 miles",
    activityType: "Walking & Jogging",
    preferredTime: "Morning",
    pace: "Moderate",
    bio: "Passionate morning walker and jogger! Looking for an upbeat, reliable partner to hit the trails, build consistency, and keep each other motivated.",
    interests: ["Morning jogs", "Scenic trails", "Healthy lifestyle", "Coffee after"],
    rating: 5.0,
    completedPairings: 38,
    isOnline: true,
  },
  {
    id: "partner-maimuna-hussaini",
    name: "Maimuna Hussaini",
    avatar: null,
    age: 26,
    distance: "0.2 miles",
    activityType: "Walking & Jogging",
    preferredTime: "Morning",
    pace: "Moderate",
    bio: "Fitness and wellness enthusiast passionate about daily walks and healthy habits. Excited to meet a committed workout partner nearby!",
    interests: ["Daily walking", "Cardio fitness", "Outdoor trails", "Health & Wellness"],
    rating: 5.0,
    completedPairings: 45,
    isOnline: true,
  },
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: null,
    age: 28,
    distance: "0.5 miles",
    activityType: "Walking",
    preferredTime: "Morning",
    pace: "Moderate",
    bio: "Love morning walks with good conversation. Looking for a consistent walking buddy!",
    interests: ["Nature walks", "Coffee after", "Dogs welcome"],
    rating: 4.8,
    completedPairings: 24,
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: null,
    age: 32,
    distance: "0.8 miles",
    activityType: "Jogging",
    preferredTime: "Evening",
    pace: "Fast",
    bio: "Training for my first marathon. Looking for someone to push me!",
    interests: ["Marathon prep", "Trail running", "Fitness goals"],
    rating: 4.9,
    completedPairings: 56,
    isOnline: true,
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: null,
    age: 26,
    distance: "1.2 miles",
    activityType: "Walking",
    preferredTime: "Afternoon",
    pace: "Leisurely",
    bio: "New to the area and looking to explore! Love photography during walks.",
    interests: ["Photography", "Exploring", "Parks"],
    rating: 4.7,
    completedPairings: 12,
    isOnline: false,
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: null,
    age: 35,
    distance: "1.5 miles",
    activityType: "Jogging",
    preferredTime: "Morning",
    pace: "Moderate",
    bio: "Dad of two, trying to stay fit. Early morning jogs work best for me.",
    interests: ["Health goals", "Work-life balance", "Weekend runs"],
    rating: 4.6,
    completedPairings: 18,
    isOnline: true,
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: null,
    age: 29,
    distance: "2.0 miles",
    activityType: "Walking",
    preferredTime: "Evening",
    pace: "Moderate",
    bio: "Podcast lover looking for walking companions. Let's chat and walk!",
    interests: ["Podcasts", "Sunset walks", "Beach"],
    rating: 4.9,
    completedPairings: 42,
    isOnline: false,
  },
  {
    id: "6",
    name: "David Brown",
    avatar: null,
    age: 31,
    distance: "0.3 miles",
    activityType: "Jogging",
    preferredTime: "Morning",
    pace: "Fast",
    bio: "Former college athlete. Happy to help beginners too!",
    interests: ["Coaching", "Interval training", "Hills"],
    rating: 5.0,
    completedPairings: 89,
    isOnline: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FindPartner = () => {
  const { location: userCity, isLocating, detectLocation } = useUserLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [paceFilter, setPaceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const userIdentifier = (
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.name ||
    currentUser?.email ||
    ""
  ).toLowerCase();

  const isMaimuna = userIdentifier.includes("maimuna");
  const isMunah = userIdentifier.includes("munah");

  // Filter out self so user doesn't match with themselves
  const eligiblePartners = basePartners.filter((p) => {
    if (isMaimuna && p.id === "partner-maimuna-hussaini") return false;
    if (isMunah && p.id === "partner-munah-doe") return false;
    return true;
  });

  const filteredPartners = eligiblePartners.filter((partner) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      partner.name.toLowerCase().includes(q) ||
      partner.bio.toLowerCase().includes(q) ||
      partner.interests.some((i) => i.toLowerCase().includes(q));

    const matchesActivity =
      activityFilter === "all" ||
      partner.activityType.toLowerCase().includes(activityFilter);

    const matchesPace =
      paceFilter === "all" || partner.pace.toLowerCase() === paceFilter;

    const matchesTime =
      timeFilter === "all" || partner.preferredTime.toLowerCase() === timeFilter;

    return matchesSearch && matchesActivity && matchesPace && matchesTime;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-28 pb-12 gradient-bg-hero">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary-foreground mb-6">
              <Users className="h-4 w-4" />
              Find Your Activity Partner
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Never Walk Alone
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Connect with people nearby who share your passion for walking and jogging. 
              Find the perfect partner based on pace, schedule, and interests.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold text-primary-foreground">2,500+</div>
                <div className="text-sm text-primary-foreground/70">Active Partners</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold text-primary-foreground">15,000+</div>
                <div className="text-sm text-primary-foreground/70">Successful Pairings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold text-primary-foreground">4.9★</div>
                <div className="text-sm text-primary-foreground/70">Average Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border bg-background sticky top-16 lg:top-20 z-40">
        <div className="container-app">
          {/* Active Location Indicator & Auto-Detect Trigger */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Showing partners near:</span>
              <span className="text-xs font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border">
                📍 {userCity}
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                await detectLocation(false);
              }}
              disabled={isLocating}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
              {isLocating ? "Detecting GPS..." : "Auto-detect location"}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name (e.g., Munah Doe, Maimuna), bio, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[140px] h-12">
                  <Footprints className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="walking">Walking</SelectItem>
                  <SelectItem value="jogging">Jogging</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paceFilter} onValueChange={setPaceFilter}>
                <SelectTrigger className="w-[130px] h-12">
                  <Zap className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Pace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Pace</SelectItem>
                  <SelectItem value="leisurely">Leisurely</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[130px] h-12">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(activityFilter !== "all" || paceFilter !== "all" || timeFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activityFilter !== "all" && (
                <Badge variant="secondary" className="capitalize">
                  {activityFilter}
                </Badge>
              )}
              {paceFilter !== "all" && (
                <Badge variant="secondary" className="capitalize">
                  {paceFilter} pace
                </Badge>
              )}
              {timeFilter !== "all" && (
                <Badge variant="secondary" className="capitalize">
                  {timeFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActivityFilter("all");
                  setPaceFilter("all");
                  setTimeFilter("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">
              {filteredPartners.length} partners near you
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{userCity}</span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredPartners.map((partner) => (
                <motion.div key={partner.id} variants={itemVariants} layout>
                  <PartnerCard {...partner} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPartners.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No partners found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search keywords to find more activity partners
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setActivityFilter("all");
                  setPaceFilter("all");
                  setTimeFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FindPartner;

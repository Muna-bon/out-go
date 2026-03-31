import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Grid, List, SlidersHorizontal } from "lucide-react";
import { Footprints, Dumbbell, Mountain, Tent, Heart, Building2, Camera } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import ActivityCard from "@/components/cards/ActivityCard";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

const categories = [
  { name: "All", icon: Grid },
  { name: "Walking", icon: Footprints },
  { name: "Fitness", icon: Dumbbell },
  { name: "Hiking", icon: Mountain },
  { name: "Camping", icon: Tent },
  { name: "Wellness", icon: Heart },
  { name: "Gym", icon: Building2 },
  { name: "Sightseeing", icon: Camera },
];

const activities = [
  { id: "1", title: "Sunrise Yoga in Central Park", category: "Wellness", image: yogaImage, location: "Central Park, New York", date: "Jan 25, 2026", time: "6:30 AM", participants: 18, maxParticipants: 25, organizer: "Sarah M." },
  { id: "2", title: "Morning Run Club - Coastal Trail", category: "Walking & Jogging", image: runningImage, location: "Santa Monica Beach, LA", date: "Jan 26, 2026", time: "7:00 AM", participants: 12, maxParticipants: 20, organizer: "Mike R." },
  { id: "3", title: "Weekend Camping Adventure", category: "Camping", image: campingImage, location: "Yosemite National Park", date: "Jan 31, 2026", time: "2:00 PM", participants: 8, maxParticipants: 12, organizer: "Adventure Co." },
  { id: "4", title: "HIIT Group Training Session", category: "Fitness", image: gymImage, location: "FitLife Gym, Downtown", date: "Jan 24, 2026", time: "5:30 PM", participants: 15, maxParticipants: 20, organizer: "Coach Alex" },
  { id: "5", title: "Sunset Beach Walk", category: "Walking & Jogging", image: runningImage, location: "Venice Beach, CA", date: "Jan 27, 2026", time: "5:00 PM", participants: 8, organizer: "Beach Walkers Club" },
  { id: "6", title: "Mountain Hiking Expedition", category: "Hiking", image: campingImage, location: "Rocky Mountain Trail", date: "Feb 2, 2026", time: "8:00 AM", participants: 6, maxParticipants: 15, organizer: "Trail Blazers" },
  { id: "7", title: "Morning Meditation & Stretch", category: "Wellness", image: yogaImage, location: "Zen Garden Studio", date: "Jan 28, 2026", time: "7:00 AM", participants: 10, maxParticipants: 20, organizer: "Mindful Living" },
  { id: "8", title: "CrossFit Beginners Class", category: "Gym", image: gymImage, location: "PowerBox Gym", date: "Jan 29, 2026", time: "6:00 PM", participants: 12, maxParticipants: 16, organizer: "Coach James" },
];

const Discover = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlCategory = searchParams.get("category") || "";

  const [activeCategory, setActiveCategory] = useState(urlCategory ? categories.find(c => c.name.toLowerCase() === urlCategory.toLowerCase())?.name || "All" : "All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [localLocation, setLocalLocation] = useState(urlLocation);

  const filteredActivities = useMemo(() => {
    let result = activities;

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((a) =>
        a.category.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Search query filter
    const q = localQuery || urlQuery;
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter((a) =>
        a.title.toLowerCase().includes(lower) ||
        a.category.toLowerCase().includes(lower) ||
        a.organizer.toLowerCase().includes(lower)
      );
    }

    // Location filter
    const loc = localLocation || urlLocation;
    if (loc) {
      const lower = loc.toLowerCase();
      result = result.filter((a) => a.location.toLowerCase().includes(lower));
    }

    // Sorting
    if (sortBy === "date") {
      result = [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "popularity") {
      result = [...result].sort((a, b) => b.participants - a.participants);
    }

    return result;
  }, [activeCategory, localQuery, urlQuery, localLocation, urlLocation, sortBy]);

  const handleInPageSearch = (query: string, location: string) => {
    setLocalQuery(query);
    setLocalLocation(location);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-muted/30">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Activities</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find wellness and outdoor activities happening near you
            </p>
          </motion.div>

          <SearchBar onSearch={(q, loc) => handleInPageSearch(q, loc)} />
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur-md z-30">
        <div className="container-app">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={activeCategory === cat.name ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.name)}
                  className="flex-shrink-0 gap-2"
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{localLocation || urlLocation || "All locations"}</span>
              </div>
              <div className="flex items-center border border-border rounded-lg">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-r-none" onClick={() => setViewMode("grid")}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-l-none" onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredActivities.length}</span> activities
            </p>
            <select
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="date">Sort by: Date</option>
              <option value="popularity">Sort by: Popularity</option>
            </select>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
          >
            {filteredActivities.map((activity, index) => (
              <motion.div key={activity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <ActivityCard {...activity} />
              </motion.div>
            ))}
          </motion.div>

          {filteredActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No activities found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any activities matching your filters. Try broadening your search or explore a different category.
              </p>
              <Button variant="outline" className="gap-2" onClick={() => { setActiveCategory("All"); setLocalQuery(""); setLocalLocation(""); }}>
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Discover;

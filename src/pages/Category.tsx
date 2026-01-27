import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, MapPin, Grid, List, SlidersHorizontal, ChevronRight } from "lucide-react";
import { Footprints, Dumbbell, Mountain, Tent, Heart, Building2, Camera } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/ui/search-bar";
import ActivityCard from "@/components/cards/ActivityCard";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

const categoryData: Record<string, { 
  name: string; 
  icon: typeof Footprints; 
  color: string; 
  description: string;
  subcategories: string[];
}> = {
  "walking-jogging": {
    name: "Walking & Jogging",
    icon: Footprints,
    color: "hsl(217, 91%, 53%)",
    description: "Join walking groups, running clubs, and jogging sessions in your area. Perfect for all fitness levels.",
    subcategories: ["Morning Walks", "Trail Running", "Beach Jogs", "Night Runs", "Marathon Training"],
  },
  "fitness-workouts": {
    name: "Fitness & Workouts",
    icon: Dumbbell,
    color: "hsl(199, 89%, 60%)",
    description: "High-energy workout sessions, HIIT classes, and strength training groups.",
    subcategories: ["HIIT", "CrossFit", "Bootcamp", "Strength Training", "Cardio Classes"],
  },
  "hiking": {
    name: "Hiking",
    icon: Mountain,
    color: "hsl(145, 60%, 40%)",
    description: "Explore trails, mountains, and scenic routes with fellow hiking enthusiasts.",
    subcategories: ["Day Hikes", "Multi-day Treks", "Mountain Climbing", "Nature Walks", "Photography Hikes"],
  },
  "camping": {
    name: "Camping",
    icon: Tent,
    color: "hsl(30, 70%, 45%)",
    description: "Outdoor camping adventures, from weekend getaways to extended wilderness trips.",
    subcategories: ["Car Camping", "Backpacking", "Glamping", "Winter Camping", "Beach Camping"],
  },
  "wellness-programs": {
    name: "Wellness Programs",
    icon: Heart,
    color: "hsl(280, 60%, 55%)",
    description: "Yoga, meditation, mindfulness, and holistic wellness activities.",
    subcategories: ["Yoga", "Meditation", "Pilates", "Sound Healing", "Breathwork"],
  },
  "gym-programs": {
    name: "Gym Programs",
    icon: Building2,
    color: "hsl(217, 91%, 53%)",
    description: "Structured gym programs and classes at partner fitness centers.",
    subcategories: ["Group Classes", "Personal Training", "Spin Classes", "Boxing", "Swimming"],
  },
  "sightseeing": {
    name: "Sightseeing",
    icon: Camera,
    color: "hsl(199, 89%, 60%)",
    description: "Explore local attractions, city tours, and cultural experiences.",
    subcategories: ["City Tours", "Museum Visits", "Food Tours", "Architecture Walks", "Photo Walks"],
  },
};

const allActivities = [
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
  {
    id: "3",
    title: "Weekend Camping Adventure",
    category: "Camping",
    image: campingImage,
    location: "Yosemite National Park",
    date: "Jan 31, 2026",
    time: "2:00 PM",
    participants: 8,
    maxParticipants: 12,
    organizer: "Adventure Co.",
  },
  {
    id: "4",
    title: "HIIT Group Training Session",
    category: "Fitness",
    image: gymImage,
    location: "FitLife Gym, Downtown",
    date: "Jan 24, 2026",
    time: "5:30 PM",
    participants: 15,
    maxParticipants: 20,
    organizer: "Coach Alex",
  },
  {
    id: "5",
    title: "Sunset Beach Walk",
    category: "Walking & Jogging",
    image: runningImage,
    location: "Venice Beach, CA",
    date: "Jan 27, 2026",
    time: "5:00 PM",
    participants: 8,
    organizer: "Beach Walkers Club",
  },
  {
    id: "6",
    title: "Mountain Hiking Expedition",
    category: "Hiking",
    image: campingImage,
    location: "Rocky Mountain Trail",
    date: "Feb 2, 2026",
    time: "8:00 AM",
    participants: 6,
    maxParticipants: 15,
    organizer: "Trail Blazers",
  },
  {
    id: "7",
    title: "Morning Meditation & Stretch",
    category: "Wellness",
    image: yogaImage,
    location: "Zen Garden Studio",
    date: "Jan 28, 2026",
    time: "7:00 AM",
    participants: 10,
    maxParticipants: 20,
    organizer: "Mindful Living",
  },
  {
    id: "8",
    title: "CrossFit Beginners Class",
    category: "Gym",
    image: gymImage,
    location: "PowerBox Gym",
    date: "Jan 29, 2026",
    time: "6:00 PM",
    participants: 12,
    maxParticipants: 16,
    organizer: "Coach James",
  },
  {
    id: "9",
    title: "Trail Running - Advanced",
    category: "Walking & Jogging",
    image: runningImage,
    location: "Mountain View Trail",
    date: "Jan 30, 2026",
    time: "6:00 AM",
    participants: 5,
    maxParticipants: 10,
    organizer: "Run Wild Club",
  },
  {
    id: "10",
    title: "Photography City Walk",
    category: "Sightseeing",
    image: yogaImage,
    location: "Downtown Historic District",
    date: "Feb 1, 2026",
    time: "10:00 AM",
    participants: 14,
    maxParticipants: 20,
    organizer: "Photo Enthusiasts",
  },
];

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const category = slug ? categoryData[slug] : null;

  const filteredActivities = useMemo(() => {
    if (!category) return [];
    
    return allActivities.filter((activity) => {
      const activityCategory = activity.category.toLowerCase();
      const categoryName = category.name.toLowerCase();
      return activityCategory.includes(categoryName.split(" ")[0]) ||
             categoryName.includes(activityCategory.split(" ")[0]);
    });
  }, [category]);

  if (!category) {
    return (
      <Layout>
        <div className="container-app py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = category.icon;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 gradient-bg-hero">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
            
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
                  {category.name}
                </h1>
                <p className="text-primary-foreground/80 text-lg max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-6 border-b border-border bg-background">
        <div className="container-app">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedSubcategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedSubcategory(null)}
            >
              All
            </Button>
            {category.subcategories.map((sub) => (
              <Button
                key={sub}
                variant={selectedSubcategory === sub ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedSubcategory(sub)}
                className="flex-shrink-0"
              >
                {sub}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-6 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur-md z-30">
        <div className="container-app">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <SearchBar />
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredActivities.length}</span> activities in {category.name}
            </p>
            <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option>Sort by: Relevance</option>
              <option>Sort by: Date</option>
              <option>Sort by: Distance</option>
              <option>Sort by: Popularity</option>
            </select>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/activity/${activity.id}`}>
                  <ActivityCard {...activity} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No activities found in this category yet.
              </p>
              <Link to="/create">
                <Button className="mt-4">Create the First Activity</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Category;

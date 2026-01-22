import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Calendar as CalendarIcon, Grid, List, SlidersHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/cards/EventCard";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

const events = [
  {
    id: "1",
    title: "City Marathon Training Program",
    description: "Join our 12-week marathon training program designed for all skill levels. Expert coaches and group support included.",
    category: "Fitness & Workouts",
    image: runningImage,
    location: "Downtown Sports Complex",
    date: "Feb 1, 2026",
    time: "6:00 AM",
    capacity: 100,
    registered: 78,
    price: 49,
    organizer: "City Runners Club",
    featured: true,
  },
  {
    id: "2",
    title: "Weekend Wellness Retreat",
    description: "A full weekend of yoga, meditation, and healthy living workshops in a beautiful mountain setting.",
    category: "Wellness Programs",
    image: yogaImage,
    location: "Mountain View Resort",
    date: "Feb 15-16, 2026",
    time: "10:00 AM",
    capacity: 50,
    registered: 42,
    price: 199,
    organizer: "Zen Living Co.",
    featured: true,
  },
  {
    id: "3",
    title: "Beginner's Camping Workshop",
    description: "Learn essential camping skills including tent setup, fire building, and outdoor cooking.",
    category: "Hiking & Camping",
    image: campingImage,
    location: "State Park Campgrounds",
    date: "Feb 8, 2026",
    time: "9:00 AM",
    capacity: 30,
    registered: 18,
    price: 0,
    organizer: "Outdoor Adventures",
  },
  {
    id: "4",
    title: "CrossFit Open Competition",
    description: "Test your fitness at our annual CrossFit competition. Prizes for top performers!",
    category: "Gym Programs",
    image: gymImage,
    location: "PowerBox Fitness Center",
    date: "Feb 22, 2026",
    time: "8:00 AM",
    capacity: 80,
    registered: 65,
    price: 35,
    organizer: "PowerBox Gym",
  },
  {
    id: "5",
    title: "Sunrise Hike & Photography",
    description: "Capture stunning sunrise photos while enjoying a moderate hike with fellow photographers.",
    category: "Hiking & Camping",
    image: campingImage,
    location: "Eagle Peak Trail",
    date: "Feb 5, 2026",
    time: "5:30 AM",
    capacity: 20,
    registered: 12,
    price: 15,
    organizer: "Photo Hikers Club",
  },
  {
    id: "6",
    title: "Pilates Fundamentals Workshop",
    description: "Master the basics of Pilates with our certified instructors. Equipment provided.",
    category: "Wellness Programs",
    image: yogaImage,
    location: "Balance Studio",
    date: "Feb 12, 2026",
    time: "10:00 AM",
    capacity: 25,
    registered: 20,
    price: 25,
    organizer: "Balance Studio",
  },
];

const Events = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const featuredEvents = events.filter((e) => e.featured);
  const upcomingEvents = events.filter((e) => !e.featured);

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-muted/30">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Events & Programs
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover organized events and structured programs by gyms and organizations
              </p>
            </div>
            <Link to="/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Event
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-10">
        <div className="container-app">
          <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events */}
      <section className="py-10 bg-muted/30">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg bg-background">
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

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="free">Free Events</TabsTrigger>
              <TabsTrigger value="this-week">This Week</TabsTrigger>
              <TabsTrigger value="this-month">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard {...event} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="free" className="mt-6">
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {upcomingEvents.filter((e) => e.price === 0).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard {...event} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="this-week" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                No events scheduled for this week.
              </div>
            </TabsContent>

            <TabsContent value="this-month" className="mt-6">
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard {...event} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Events;

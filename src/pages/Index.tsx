import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, MapPin, Calendar, Sparkles, Play, ChevronRight } from "lucide-react";
import { Footprints, Dumbbell, Mountain, Tent, Heart, Building2, Camera } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import CategoryCard from "@/components/cards/CategoryCard";
import ActivityCard from "@/components/cards/ActivityCard";
import heroImage from "@/assets/hero-hiking.jpg";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

const categories = [
  { name: "Walking & Jogging", icon: Footprints, count: 248, color: "hsl(217, 91%, 53%)" },
  { name: "Fitness & Workouts", icon: Dumbbell, count: 186, color: "hsl(199, 89%, 60%)" },
  { name: "Hiking", icon: Mountain, count: 124, color: "hsl(145, 60%, 40%)" },
  { name: "Camping", icon: Tent, count: 89, color: "hsl(30, 70%, 45%)" },
  { name: "Wellness Programs", icon: Heart, count: 156, color: "hsl(280, 60%, 55%)" },
  { name: "Gym Programs", icon: Building2, count: 212, color: "hsl(217, 91%, 53%)" },
  { name: "Sightseeing", icon: Camera, count: 97, color: "hsl(199, 89%, 60%)" },
];

const featuredActivities = [
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
];

const stats = [
  { label: "Active Users", value: "50K+" },
  { label: "Activities Completed", value: "125K+" },
  { label: "Partner Gyms", value: "500+" },
  { label: "Cities", value: "120+" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="People hiking together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>

        <div className="container-app relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Your wellness journey starts here
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Connect. Move.{" "}
              <span className="gradient-text">Live Better.</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Discover and join wellness activities near you. From morning jogs to weekend hikes, 
              find your tribe and embrace an active lifestyle together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/discover">
                <Button variant="hero" size="xl" className="gap-2">
                  Explore Activities
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl" className="gap-2">
                <Play className="h-5 w-5" />
                Watch How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container-app">
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find activities that match your interests and fitness goals
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4"
          >
            {categories.map((category) => (
              <motion.div key={category.name} variants={itemVariants}>
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 bg-muted/30">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Activities Near You
              </h2>
              <p className="text-muted-foreground text-lg">
                Join popular activities happening in your area
              </p>
            </div>
            <Link to="/discover">
              <Button variant="outline" className="gap-2 group">
                View All
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredActivities.map((activity) => (
              <motion.div key={activity.id} variants={itemVariants}>
                <ActivityCard {...activity} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How OutGo Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: MapPin,
                title: "Discover Activities",
                description: "Browse activities near you based on your location, interests, and schedule.",
              },
              {
                step: "02",
                icon: Users,
                title: "Connect with Others",
                description: "Join activities created by others or invite people to your own events.",
              },
              {
                step: "03",
                icon: Calendar,
                title: "Get Active Together",
                description: "Show up, enjoy the activity, and build lasting connections.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="gradient-bg-primary w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <item.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <span className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 text-6xl font-bold text-muted/50">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg-hero rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyaDJ2MmgtMnYtMmgtNHYyaC0ydi0yaDR2LTJoLTJ2LTJoMnYyaDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Get Moving?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of people who are already connecting, moving, and living healthier lives with OutGo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="xl" className="bg-background text-primary hover:bg-background/90 gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/vendors">
                  <Button variant="heroOutline" size="xl">
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

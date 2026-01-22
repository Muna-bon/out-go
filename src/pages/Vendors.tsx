import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, Grid, List, Building2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorCard from "@/components/cards/VendorCard";
import gymImage from "@/assets/activity-gym.jpg";
import yogaImage from "@/assets/activity-yoga.jpg";

const vendors = [
  {
    id: "1",
    name: "FitLife Gym",
    type: "Fitness Center",
    image: gymImage,
    location: "123 Main St, Downtown",
    rating: 4.8,
    reviewCount: 256,
    hours: "5:00 AM - 11:00 PM",
    verified: true,
    services: ["Weight Training", "Cardio", "Group Classes", "Personal Training", "Sauna"],
  },
  {
    id: "2",
    name: "Zen Yoga Studio",
    type: "Yoga & Wellness",
    image: yogaImage,
    location: "456 Peace Ave, Midtown",
    rating: 4.9,
    reviewCount: 189,
    hours: "6:00 AM - 9:00 PM",
    verified: true,
    services: ["Hot Yoga", "Meditation", "Pilates", "Wellness Workshops"],
  },
  {
    id: "3",
    name: "PowerBox CrossFit",
    type: "CrossFit Box",
    image: gymImage,
    location: "789 Strength Blvd",
    rating: 4.7,
    reviewCount: 142,
    hours: "5:30 AM - 10:00 PM",
    verified: true,
    services: ["CrossFit", "Olympic Lifting", "HIIT", "Nutrition Coaching"],
  },
  {
    id: "4",
    name: "Balance Pilates",
    type: "Pilates Studio",
    image: yogaImage,
    location: "321 Core Street",
    rating: 4.6,
    reviewCount: 98,
    hours: "7:00 AM - 8:00 PM",
    verified: false,
    services: ["Mat Pilates", "Reformer", "Private Sessions"],
  },
  {
    id: "5",
    name: "Athletic Performance Center",
    type: "Sports Training",
    image: gymImage,
    location: "555 Champion Way",
    rating: 4.9,
    reviewCount: 312,
    hours: "6:00 AM - 10:00 PM",
    verified: true,
    services: ["Sports Training", "Physical Therapy", "Recovery", "Nutrition"],
  },
  {
    id: "6",
    name: "Mindful Movement",
    type: "Wellness Center",
    image: yogaImage,
    location: "777 Serenity Lane",
    rating: 4.8,
    reviewCount: 176,
    hours: "6:30 AM - 9:30 PM",
    verified: true,
    services: ["Yoga", "Tai Chi", "Massage", "Acupuncture", "Meditation"],
  },
];

const Vendors = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-muted/30">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Gyms & Fitness Partners
              </h1>
              <p className="text-muted-foreground text-lg">
                Find verified gyms, studios, and wellness centers near you
              </p>
            </div>
            <Link to="/vendor-signup">
              <Button size="lg" variant="secondary" className="gap-2">
                <Building2 className="h-5 w-5" />
                Become a Partner
              </Button>
            </Link>
          </motion.div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search gyms, studios, or services..."
                className="pl-10 h-12 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative sm:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10 h-12 bg-background"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <Tabs defaultValue="all" className="flex-1">
              <TabsList>
                <TabsTrigger value="all">All Partners</TabsTrigger>
                <TabsTrigger value="gyms">Gyms</TabsTrigger>
                <TabsTrigger value="studios">Studios</TabsTrigger>
                <TabsTrigger value="wellness">Wellness</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-3">
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
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Showing <span className="font-semibold text-foreground">{filteredVendors.length}</span> partners near you
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <VendorCard {...vendor} />
              </motion.div>
            ))}
          </motion.div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No partners found matching your search.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Own a Gym or Wellness Business?
          </h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-2xl mx-auto">
            Partner with OutGo to reach thousands of fitness enthusiasts. List your programs, manage registrations, and grow your community.
          </p>
          <Link to="/vendor-signup">
            <Button size="lg" className="bg-background text-secondary hover:bg-background/90">
              Apply to Become a Partner
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Vendors;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, Grid, List, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorCard from "@/components/cards/VendorCard";
import { getVendors } from "@/lib/api";
import { toast } from "sonner";

const Vendors = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getVendors();
                setVendors(data || []);
            } catch {
                // DB table might not exist yet, that's ok
                setVendors([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredVendors = vendors.filter((v) => {
        const matchesSearch =
            v.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.business_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.city?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "all" ||
            (typeFilter === "gyms" && v.business_type?.toLowerCase().includes("gym")) ||
            (typeFilter === "gyms" && v.business_type?.toLowerCase().includes("fitness")) ||
            (typeFilter === "gyms" && v.business_type?.toLowerCase().includes("crossfit")) ||
            (typeFilter === "studios" && (v.business_type?.toLowerCase().includes("studio") || v.business_type?.toLowerCase().includes("pilates") || v.business_type?.toLowerCase().includes("dance"))) ||
            (typeFilter === "wellness" && (v.business_type?.toLowerCase().includes("wellness") || v.business_type?.toLowerCase().includes("spa")));

        return matchesSearch && matchesType;
    });

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
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="container-app">
                    <div className="flex items-center justify-between mb-6">
                        <Tabs value={typeFilter} onValueChange={setTypeFilter} className="flex-1">
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
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground">
                            Loading vendors...
                        </div>
                    ) : (
                        <>
                            <p className="text-muted-foreground mb-6">
                                Showing <span className="font-semibold text-foreground">{filteredVendors.length}</span> partners
                            </p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`grid gap-6 ${viewMode === "grid"
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
                                        <VendorCard
                                            id={vendor.id}
                                            name={vendor.business_name}
                                            type={vendor.business_type}
                                            location={`${vendor.address}, ${vendor.city}`}
                                            hours={vendor.operating_hours}
                                            verified={vendor.status === "active"}
                                            services={vendor.services || []}
                                            rating={4.8}
                                            reviewCount={0}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {filteredVendors.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-20"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Building2 className="h-10 w-10 text-primary/40" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {vendors.length === 0 ? "No partners yet" : "No matches found"}
                                    </h3>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                        {vendors.length === 0
                                            ? "Be the first to register your gym or wellness studio! Partners get premium visibility to thousands of active users."
                                            : "Try adjusting your filters or search term to find what you're looking for."
                                        }
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        {searchQuery && (
                                            <Button variant="outline" onClick={() => setSearchQuery("")}>
                                                Clear Search
                                            </Button>
                                        )}
                                        <Link to="/vendor-signup">
                                            <Button className="gap-2">Become a Partner</Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </>
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
                        Partner with OwtGo to reach thousands of fitness enthusiasts. List your programs, manage registrations, and grow your community.
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

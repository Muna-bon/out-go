import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, UserPlus, MessageCircle, Navigation } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const partnersData: Record<string, any> = {
    "1": { name: "Sarah Johnson", age: 28, distance: "0.5 miles", activityType: "Walking", preferredTime: "Morning", pace: "Moderate", bio: "Love morning walks with good conversation. Looking for a consistent walking buddy! Let's explore the city together and hit our daily step count.", interests: ["Nature walks", "Coffee after", "Dogs welcome"], rating: 4.8, completedPairings: 24, isOnline: true },
    "2": { name: "Mike Chen", age: 32, distance: "0.8 miles", activityType: "Jogging", preferredTime: "Evening", pace: "Fast", bio: "Training for my first marathon. Looking for someone to push me! Let's tackle long miles.", interests: ["Marathon prep", "Trail running", "Fitness goals"], rating: 4.9, completedPairings: 56, isOnline: true },
    "3": { name: "Emily Davis", age: 26, distance: "1.2 miles", activityType: "Walking", preferredTime: "Afternoon", pace: "Leisurely", bio: "New to the area and looking to explore! Love photography during walks.", interests: ["Photography", "Exploring", "Parks"], rating: 4.7, completedPairings: 12, isOnline: false },
    "4": { name: "James Wilson", age: 35, distance: "1.5 miles", activityType: "Jogging", preferredTime: "Morning", pace: "Moderate", bio: "Dad of two, trying to stay fit. Early morning jogs work best for me.", interests: ["Health goals", "Work-life balance", "Weekend runs"], rating: 4.6, completedPairings: 18, isOnline: true },
    "5": { name: "Lisa Park", age: 29, distance: "2.0 miles", activityType: "Walking", preferredTime: "Evening", pace: "Moderate", bio: "Podcast lover looking for walking companions. Let's chat and walk!", interests: ["Podcasts", "Sunset walks", "Beach"], rating: 4.9, completedPairings: 42, isOnline: false },
    "6": { name: "David Brown", age: 31, distance: "0.3 miles", activityType: "Jogging", preferredTime: "Morning", pace: "Fast", bio: "Former college athlete. Happy to help beginners too!", interests: ["Coaching", "Interval training", "Hills"], rating: 5.0, completedPairings: 89, isOnline: true },
};

const PartnerDetail = () => {
    const { id } = useParams<{ id: string }>();
    const partner = id ? partnersData[id] : null;

    if (!partner) {
        return (
            <Layout>
                <div className="container-app py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Partner not found</h1>
                    <Link to="/find-partner">
                        <Button>Find another partner</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="bg-muted/30 pt-24 pb-12 border-b border-border">
                <div className="container-app">
                    <Link to="/find-partner" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to partners
                    </Link>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center text-primary-foreground text-5xl font-bold shadow-lg shadow-primary/20">
                            {partner.name.charAt(0)}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                                        {partner.name}
                                        {partner.isOnline && (
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                        )}
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
                                        <span className="font-medium text-foreground">{partner.age} years old</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        <div className="flex items-center gap-1.5">
                                            <Navigation className="h-4 w-4 text-primary" />
                                            <span>{partner.distance}</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        <div className="flex items-center gap-1.5">
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            <span className="font-medium text-foreground">{partner.rating}</span>
                                            <span>({partner.completedPairings} pairings)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-3">
                                    <Button size="lg" className="w-full gap-2">
                                        <UserPlus className="h-5 w-5" /> Request
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full gap-2">
                                        <MessageCircle className="h-5 w-5" /> Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container-app">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-elevated p-8">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="bg-primary/10 p-2 rounded-xl text-primary">👋</span> About me
                                </h2>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {partner.bio}
                                </p>
                            </div>

                            <div className="card-elevated p-8">
                                <h2 className="text-2xl font-semibold mb-6">Preferences</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border">
                                        <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Activity</span>
                                        <p className="font-medium text-lg">{partner.activityType}</p>
                                    </div>
                                    <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border">
                                        <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Pace</span>
                                        <p className="font-medium text-lg">{partner.pace}</p>
                                    </div>
                                    <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border">
                                        <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Time</span>
                                        <p className="font-medium text-lg">{partner.preferredTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="card-elevated p-6 sticky top-24 space-y-6 bg-secondary text-secondary-foreground">
                                <h3 className="font-semibold text-xl mb-4">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {partner.interests.map((interest: string) => (
                                        <Badge key={interest} variant="secondary" className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 text-secondary-foreground border-none">
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default PartnerDetail;

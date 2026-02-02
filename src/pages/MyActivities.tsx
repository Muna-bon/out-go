import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

interface Activity {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  organizer: string;
}

const initialActivities: Activity[] = [
  {
    id: "1",
    title: "Sunrise Yoga in Central Park",
    category: "Wellness",
    image: yogaImage,
    location: "Central Park, New York",
    date: "Jan 25, 2026",
    time: "6:30 AM",
    status: "upcoming",
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
    status: "upcoming",
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
    status: "upcoming",
    organizer: "Adventure Co.",
  },
  {
    id: "4",
    title: "HIIT Group Training Session",
    category: "Fitness",
    image: gymImage,
    location: "FitLife Gym, Downtown",
    date: "Jan 15, 2026",
    time: "5:30 PM",
    status: "completed",
    organizer: "Coach Alex",
  },
  {
    id: "5",
    title: "Beach Volleyball Tournament",
    category: "Sports",
    image: runningImage,
    location: "Venice Beach, LA",
    date: "Jan 10, 2026",
    time: "10:00 AM",
    status: "completed",
    organizer: "Beach Sports Club",
  },
];

const initialEvents = [
  {
    id: "e1",
    title: "Annual Fitness Expo 2026",
    category: "Event",
    image: gymImage,
    location: "Convention Center, Downtown",
    date: "Feb 15, 2026",
    time: "9:00 AM",
    status: "upcoming" as const,
    organizer: "OutGo Events",
  },
  {
    id: "e2",
    title: "5K Charity Run",
    category: "Event",
    image: runningImage,
    location: "Riverside Park",
    date: "Feb 20, 2026",
    time: "7:00 AM",
    status: "upcoming" as const,
    organizer: "City Sports Foundation",
  },
];

const MyActivities = () => {
  const [activities, setActivities] = useState(initialActivities);
  const [events, setEvents] = useState(initialEvents);
  const [selectedItem, setSelectedItem] = useState<Activity | null>(null);
  const [showOptOutDialog, setShowOptOutDialog] = useState(false);
  const [itemType, setItemType] = useState<"activity" | "event">("activity");

  const handleOptOut = () => {
    if (selectedItem) {
      if (itemType === "activity") {
        setActivities(activities.filter((a) => a.id !== selectedItem.id));
      } else {
        setEvents(events.filter((e) => e.id !== selectedItem.id));
      }
      toast.success(`Successfully opted out of "${selectedItem.title}"`);
      setShowOptOutDialog(false);
      setSelectedItem(null);
    }
  };

  const openOptOutDialog = (item: Activity, type: "activity" | "event") => {
    setSelectedItem(item);
    setItemType(type);
    setShowOptOutDialog(true);
  };

  const upcomingActivities = activities.filter((a) => a.status === "upcoming");
  const completedActivities = activities.filter((a) => a.status === "completed");
  const upcomingEvents = events.filter((e) => e.status === "upcoming");

  const ActivityCard = ({
    item,
    type,
  }: {
    item: Activity;
    type: "activity" | "event";
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-card transition-shadow"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full sm:w-32 h-32 rounded-xl object-cover"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {item.category}
            </span>
            <h3 className="font-semibold mt-2">{item.title}</h3>
          </div>
          {item.status === "upcoming" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => openOptOutDialog(item, type)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {item.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {item.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {item.location}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            By {item.organizer}
          </span>
          <Link to={`/${type === "activity" ? "activity" : "events"}/${item.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-16">
      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      <Link to="/discover">
        <Button>Discover Activities</Button>
      </Link>
    </div>
  );

  return (
    <Layout>
      <section className="py-12 bg-muted/30 min-h-screen">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">My Activities & Events</h1>
            <p className="text-muted-foreground">
              Manage all your registered activities and events
            </p>
          </motion.div>

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Upcoming ({upcomingActivities.length + upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="h-4 w-4" />
                Events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed ({completedActivities.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingActivities.length > 0 ? (
                upcomingActivities.map((activity) => (
                  <ActivityCard key={activity.id} item={activity} type="activity" />
                ))
              ) : (
                <EmptyState message="No upcoming activities. Start exploring!" />
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <ActivityCard key={event.id} item={event} type="event" />
                ))
              ) : (
                <EmptyState message="No upcoming events registered." />
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedActivities.length > 0 ? (
                completedActivities.map((activity) => (
                  <ActivityCard key={activity.id} item={activity} type="activity" />
                ))
              ) : (
                <EmptyState message="No completed activities yet." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Opt Out Dialog */}
      <Dialog open={showOptOutDialog} onOpenChange={setShowOptOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opt Out of {itemType === "activity" ? "Activity" : "Event"}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to opt out of "{selectedItem?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowOptOutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleOptOut}>
              Yes, Opt Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MyActivities;

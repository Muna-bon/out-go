import { useEffect, useState } from "react";
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
import { getMyJoinedEvents, leaveEvent } from "@/lib/api";
import { getEventPlaceholderImage } from "@/lib/eventImages";

interface Activity {
  id: string;
  title: string;
  category: string;
  image_url: string;
  location: string;
  date: string;
  time: string;
  status: "upcoming" | "past";
  organizer: string;
  created_by?: { name: string };
}

const MyActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Activity | null>(null);
  const [showOptOutDialog, setShowOptOutDialog] = useState(false);

  useEffect(() => {
    const fetchJoined = async () => {
      try {
        const data = await getMyJoinedEvents();
        setActivities(data as any[]);
      } catch (error: any) {
        toast.error(error.message || "Failed to load your activities");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJoined();
  }, []);

  const handleOptOut = async () => {
    if (selectedItem) {
      try {
        await leaveEvent(selectedItem.id);
        setActivities(activities.filter((a) => a.id !== selectedItem.id));
        toast.success(`Successfully opted out of "${selectedItem.title}"`);
      } catch (error: any) {
        toast.error(error.message || "Failed to opt out");
      } finally {
        setShowOptOutDialog(false);
        setSelectedItem(null);
      }
    }
  };

  const openOptOutDialog = (item: Activity) => {
    setSelectedItem(item);
    setShowOptOutDialog(true);
  };

  const upcomingActivities = activities.filter((a) => a.status === "upcoming");
  const completedActivities = activities.filter((a) => a.status === "past");

  const ActivityCard = ({
    item,
  }: {
    item: Activity;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-card transition-shadow"
    >
      <img
        src={item.image_url || getEventPlaceholderImage(item.category)}
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
              onClick={() => openOptOutDialog(item)}
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
            By {item.created_by?.name || item.organizer || "Unknown"}
          </span>
          <Link to={`/events/${item.id}`}>
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
                Upcoming ({upcomingActivities.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed ({completedActivities.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingActivities.length > 0 ? (
                upcomingActivities.map((activity) => (
                  <ActivityCard key={activity.id} item={activity} />
                ))
              ) : (
                <EmptyState message="No upcoming activities. Start exploring!" />
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedActivities.length > 0 ? (
                completedActivities.map((activity) => (
                  <ActivityCard key={activity.id} item={activity} />
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
            <DialogTitle>Opt Out of Activity?</DialogTitle>
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

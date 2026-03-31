import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Grid, List, SlidersHorizontal, Plus, Search, Star, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/cards/EventCard";
import { getEvents } from "@/lib/api";
import { toast } from "sonner";

const Events = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const isEventPast = (event: any) => {
    const endDate = event.end_date ? new Date(event.end_date) : new Date(event.date);
    return endDate < now;
  };

  const isRecentPast = (event: any) => {
    const endDate = event.end_date ? new Date(event.end_date) : new Date(event.date);
    return endDate < now && endDate >= thirtyDaysAgo;
  };

  const featuredEvents = events.filter((e) => (e.is_featured || e.featured) && !isEventPast(e));
  const upcomingEvents = events.filter((e) => !isEventPast(e));
  const pastEvents = events.filter((e) => isRecentPast(e));
  const freeEvents = upcomingEvents.filter((e) => !e.price || e.price === 0);
  const paidEvents = upcomingEvents.filter((e) => e.price && e.price > 0);

  const EmptyState = ({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Icon className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
      {action}
    </motion.div>
  );

  const EventGrid = ({ items, emptyIcon, emptyTitle, emptyDescription }: { items: any[], emptyIcon: any, emptyTitle: string, emptyDescription: string }) => {
    if (items.length === 0) {
      return (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Link to="/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create an Event
              </Button>
            </Link>
          }
        />
      );
    }

    return (
      <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {items.map((event, index) => (
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
    );
  };

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
                Discover organized events and structured programs near you
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
      {featuredEvents.length > 0 && (
        <section className="py-10">
          <div className="container-app">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold">Featured Events</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3" /> Featured
                  </div>
                  <EventCard {...event} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-10 bg-muted/30">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Events</h2>
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
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="free">Free ({freeEvents.length})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({paidEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <EventGrid
                items={upcomingEvents}
                emptyIcon={Sparkles}
                emptyTitle="No upcoming events yet"
                emptyDescription="Be the first to create an exciting activity for the OwtGo community! Your event could be the one that brings people together."
              />
            </TabsContent>

            <TabsContent value="free" className="mt-6">
              <EventGrid
                items={freeEvents}
                emptyIcon={CalendarIcon}
                emptyTitle="No free events right now"
                emptyDescription="Free events are a great way to build community. Create one and watch the sign-ups roll in!"
              />
            </TabsContent>

            <TabsContent value="paid" className="mt-6">
              <EventGrid
                items={paidEvents}
                emptyIcon={CalendarIcon}
                emptyTitle="No paid events available"
                emptyDescription="Premium fitness events and workshops will appear here."
              />
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastEvents.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Showing events that ended in the last 30 days</p>
                  <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {pastEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="opacity-75"
                      >
                        <EventCard {...event} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No past events"
                  description="Completed events from the last 30 days will appear here."
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Events;

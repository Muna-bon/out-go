import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Star, Repeat, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { getMyCreatedEvents, updateEvent, deleteEvent as deleteEventApi } from "@/lib/api";
import { getEventPlaceholderImage } from "@/lib/eventImages";

type CreatedEvent = {
    id: string;
    title: string;
    description: string;
    category: string;
    image_url: string;
    location: string;
    date: string;
    end_date?: string;
    time: string;
    capacity: number;
    registered: number;
    price: number;
    organizer: string;
    featured: boolean;
    is_recurring?: boolean;
    is_featured?: boolean;
    status: "upcoming" | "past";
};

const EventCard = ({ event, setDeleteEventId, setEditingEvent }: { event: CreatedEvent, setDeleteEventId: (id: string) => void, setEditingEvent: (event: CreatedEvent) => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-card transition-shadow"
    >
        <img
            src={event.image_url || getEventPlaceholderImage(event.category)}
            alt={event.title}
            className="w-full sm:w-40 h-32 rounded-xl object-cover"
        />
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {event.category}
                        </span>
                        {event.is_featured && (
                            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="h-3 w-3" /> Featured
                            </span>
                        )}
                        {event.is_recurring && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                <Repeat className="h-3 w-3" /> Recurring
                            </span>
                        )}
                        <h3 className="font-semibold mt-2 text-lg">{event.title}</h3>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold text-primary">{event.registered || 0}</span> / {event.capacity === 0 ? "∞" : event.capacity} registered
                    </span>
                    {event.price > 0 && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            ₦{event.price}
                        </span>
                    )}
                    {event.end_date && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-lg">
                            Ends: {event.end_date}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditingEvent(event)}>
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => setDeleteEventId(event.id)}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </div>
        </div>
    </motion.div>
);

const MyCreatedEvents = () => {
    const [events, setEvents] = useState<CreatedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
    const [editingEvent, setEditingEvent] = useState<CreatedEvent | null>(null);

    const loadEvents = async () => {
        try {
            const data = await getMyCreatedEvents();
            setEvents(data as any[]);
        } catch (error: any) {
            toast.error(error.message || "Failed to load events");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            try {
                await updateEvent(editingEvent.id, {
                    title: editingEvent.title,
                    category: editingEvent.category,
                    date: editingEvent.date,
                    time: editingEvent.time,
                    location: editingEvent.location,
                });
                setEvents(events.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
                toast.success("Event successfully updated.");
                setEditingEvent(null);
            } catch (error: any) {
                toast.error(error.message || "Failed to update event");
            }
        }
    };

    const handleDelete = async () => {
        if (deleteEventId) {
            try {
                await deleteEventApi(deleteEventId);
                setEvents(events.filter((e) => e.id !== deleteEventId));
                toast.success("Event successfully deleted.");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete event");
            } finally {
                setDeleteEventId(null);
            }
        }
    };

    const upcomingEvents = events.filter((e) => e.status === "upcoming");
    const pastEvents = events.filter((e) => e.status === "past");

    return (
        <Layout>
            <section className="py-12 bg-muted/30 min-h-screen">
                <div className="container-app">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold mb-2">My Created Events</h1>
                            <p className="text-muted-foreground">
                                Manage all the events and activities you have created
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 md:mt-0"
                        >
                            <Link to="/create">
                                <Button className="gap-2">
                                    <Calendar className="h-4 w-4" /> Create New Event
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                    >
                        <div className="card-elevated p-6 bg-primary/5 border-primary/20">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Participants Booked</h3>
                            <p className="text-3xl font-bold text-primary">
                                {events.reduce((acc, curr) => acc + (curr.registered || 0), 0)}
                            </p>
                        </div>
                        <div className="card-elevated p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Events</h3>
                            <p className="text-3xl font-bold">{upcomingEvents.length}</p>
                        </div>
                        <div className="card-elevated p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Events Created</h3>
                            <p className="text-3xl font-bold">{events.length}</p>
                        </div>
                    </motion.div>

                    <Tabs defaultValue="upcoming" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="upcoming">
                                Upcoming ({upcomingEvents.length})
                            </TabsTrigger>
                            <TabsTrigger value="past">
                                Past Events ({pastEvents.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-4">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} setDeleteEventId={setDeleteEventId} setEditingEvent={setEditingEvent} />
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground mb-4">You haven't created any upcoming events.</p>
                                    <Link to="/create">
                                        <Button>Create One Now</Button>
                                    </Link>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-4">
                            {pastEvents.length > 0 ? (
                                pastEvents.map((event) => (
                                    <EventCard key={event.id} event={event} setDeleteEventId={setDeleteEventId} setEditingEvent={setEditingEvent} />
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No past events found.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteEventId} onOpenChange={(open) => !open && setDeleteEventId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Event?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this event? This action will cancel the event for all registered participants and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setDeleteEventId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                    </DialogHeader>
                    {editingEvent && (
                        <form onSubmit={handleEditSave} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={editingEvent.category} onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input id="time" value={editingEvent.time} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={editingEvent.location} onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })} required />
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setEditingEvent(null)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default MyCreatedEvents;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Eye, Trash2, MapPin, Users, Clock, DollarSign } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const PLATFORM_FEE_PERCENT = 2;

const AdminEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [dbError, setDbError] = useState<string | null>(null);

    const loadEvents = async () => {
        try {
            // Try RPC first (bypasses RLS)
            const { data: rpcData, error: rpcError } = await supabase.rpc("admin_get_all_events");
            
            if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
                setEvents(rpcData);
                setDbError(null);
                return;
            }
            
            // Fallback: direct query
            const { data, error } = await supabase
                .from("events")
                .select("*, created_by(*)")
                .order("created_at", { ascending: false });
            
            if (error) {
                console.error("Admin Events query error:", error);
                setDbError(`Database error: ${error.message}. Run the admin SQL functions in Supabase SQL Editor.`);
            } else if (!data || data.length === 0) {
                setDbError("No events returned. This may be an RLS issue. Run the admin SQL functions in Supabase SQL Editor.");
            } else {
                setEvents(data);
                setDbError(null);
            }
        } catch (err: any) {
            console.error("Admin Events load error:", err);
            setDbError(`Unexpected error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadEvents(); }, []);

    const handleDelete = async () => {
        if (!selectedEvent) return;
        try {
            const { error } = await supabase.from("events").delete().eq("id", selectedEvent.id);
            if (error) throw error;
            toast.success("Event deleted");
            setShowDeleteDialog(false);
            loadEvents();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        }
    };

    const filtered = events.filter((e) =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paidEvents = events.filter((e) => e.price && e.price > 0);
    const totalRevenue = paidEvents.reduce((sum, e) => sum + ((e.price || 0) * (e.registered || 0) * PLATFORM_FEE_PERCENT / 100), 0);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Events</h1>
                        <p className="text-muted-foreground mt-1">Monitor and manage all platform events ({events.length} total)</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg font-medium">
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            Est. Revenue: ${totalRevenue.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search events..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                {dbError && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
                        <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">⚠️ Data Access Issue</p>
                        <p className="text-amber-700 dark:text-amber-300">{dbError}</p>
                        <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">Go to the <strong>Users</strong> page to see the full SQL to run.</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading events...</div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((event, i) => {
                            const fee = event.price && event.price > 0 ? (event.price * (event.registered || 0) * PLATFORM_FEE_PERCENT / 100) : 0;
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                >
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate">{event.title}</h3>
                                                        <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                                                        {event.price > 0 && (
                                                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
                                                                ${event.price} • Fee: ${fee.toFixed(2)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                                                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{event.date}</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{event.time}</span>
                                                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{event.registered || 0}/{event.capacity || "∞"}</span>
                                                        <span className="text-xs">by {event.created_by?.name || event.organizer || "Unknown"}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Button size="sm" variant="ghost" onClick={() => { setSelectedEvent(event); setShowDetailDialog(true); }}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setSelectedEvent(event); setShowDeleteDialog(true); }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-4" />
                                <p>No events found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>{selectedEvent?.title}</DialogTitle></DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-muted-foreground">Category</p><p className="font-medium">{selectedEvent.category}</p></div>
                                <div><p className="text-muted-foreground">Price</p><p className="font-medium">{selectedEvent.price > 0 ? `$${selectedEvent.price}` : "Free"}</p></div>
                                <div><p className="text-muted-foreground">Date & Time</p><p className="font-medium">{selectedEvent.date} at {selectedEvent.time}</p></div>
                                <div><p className="text-muted-foreground">Capacity</p><p className="font-medium">{selectedEvent.registered || 0} / {selectedEvent.capacity || "Unlimited"}</p></div>
                                <div className="col-span-2"><p className="text-muted-foreground">Location</p><p className="font-medium">{selectedEvent.location}</p></div>
                                <div className="col-span-2"><p className="text-muted-foreground">Organizer</p><p className="font-medium">{selectedEvent.created_by?.name || selectedEvent.organizer || "Unknown"}</p></div>
                            </div>
                            <div><p className="text-muted-foreground mb-1">Description</p><p>{selectedEvent.description}</p></div>
                            {selectedEvent.price > 0 && (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        Platform Fee (2%): ${(selectedEvent.price * (selectedEvent.registered || 0) * 0.02).toFixed(2)} from {selectedEvent.registered || 0} registrations
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Delete Event?</DialogTitle>
                        <DialogDescription>This will permanently remove "{selectedEvent?.title}" from the platform.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminEvents;

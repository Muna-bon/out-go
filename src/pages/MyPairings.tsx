import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, UserPlus, Check, X, MessageCircle, Calendar, MapPin, Star, Clock, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PairingRequest {
  id: string;
  name: string;
  age: number;
  distance: string;
  activityType: string;
  pace: string;
  preferredTime: string;
  message: string;
  sentAt: string;
  rating: number;
}

interface ActivePairing {
  id: string;
  name: string;
  activityType: string;
  pace: string;
  preferredTime: string;
  nextSession: string;
  location: string;
  rating: number;
  sessionsCompleted: number;
}

const incomingRequests: PairingRequest[] = [
  {
    id: "1",
    name: "Alex Thompson",
    age: 29,
    distance: "0.4 miles",
    activityType: "Walking",
    pace: "Moderate",
    preferredTime: "Morning",
    message: "Hey! I saw that you enjoy morning walks. I'm new to the neighborhood and looking for a walking buddy. Would love to explore the parks together!",
    sentAt: "2 hours ago",
    rating: 4.7,
  },
  {
    id: "2",
    name: "Rachel Kim",
    age: 27,
    distance: "1.1 miles",
    activityType: "Jogging",
    pace: "Fast",
    preferredTime: "Evening",
    message: "Training for a half marathon and need an accountability partner. Your pace seems perfect for my training goals!",
    sentAt: "5 hours ago",
    rating: 4.9,
  },
];

const sentRequests: PairingRequest[] = [
  {
    id: "3",
    name: "Sarah Johnson",
    age: 28,
    distance: "0.5 miles",
    activityType: "Walking",
    pace: "Moderate",
    preferredTime: "Morning",
    message: "Would love to be your walking buddy!",
    sentAt: "1 day ago",
    rating: 4.8,
  },
];

const activePairings: ActivePairing[] = [
  {
    id: "4",
    name: "Mike Chen",
    activityType: "Jogging",
    pace: "Fast",
    preferredTime: "Evening",
    nextSession: "Tomorrow, 6:00 PM",
    location: "Central Park",
    rating: 4.9,
    sessionsCompleted: 12,
  },
  {
    id: "5",
    name: "Emily Davis",
    activityType: "Walking",
    pace: "Leisurely",
    preferredTime: "Afternoon",
    nextSession: "Saturday, 3:00 PM",
    location: "Riverside Trail",
    rating: 4.7,
    sessionsCompleted: 5,
  },
];

const MyPairings = () => {
  const [requests, setRequests] = useState(incomingRequests);
  const [sent, setSent] = useState(sentRequests);
  const [pairings, setPairings] = useState(activePairings);
  const [selectedRequest, setSelectedRequest] = useState<PairingRequest | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedPairing, setSelectedPairing] = useState<ActivePairing | null>(null);

  const handleAccept = (request: PairingRequest) => {
    setRequests(requests.filter((r) => r.id !== request.id));
    setPairings([
      ...pairings,
      {
        id: request.id,
        name: request.name,
        activityType: request.activityType,
        pace: request.pace,
        preferredTime: request.preferredTime,
        nextSession: "Schedule your first session",
        location: "Not set",
        rating: request.rating,
        sessionsCompleted: 0,
      },
    ]);
    setSelectedRequest(null);
    toast.success(`You're now paired with ${request.name}!`, {
      description: "Schedule your first session together.",
    });
  };

  const handleDecline = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    setSelectedRequest(null);
    toast.info("Request declined");
  };

  const handleCancelRequest = (requestId: string) => {
    setSent(sent.filter((r) => r.id !== requestId));
    toast.info("Request cancelled");
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-8 border-b border-border">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Pairings</h1>
              <p className="text-muted-foreground">
                Manage your activity partners and pairing requests
              </p>
            </div>
            <Link to="/find-partner">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Find New Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container-app">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="active" className="gap-2">
                <Users className="h-4 w-4" />
                Active ({pairings.length})
              </TabsTrigger>
              <TabsTrigger value="incoming" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Incoming ({requests.length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Clock className="h-4 w-4" />
                Sent ({sent.length})
              </TabsTrigger>
            </TabsList>

            {/* Active Pairings */}
            <TabsContent value="active">
              {pairings.length === 0 ? (
                <EmptyState
                  title="No active pairings yet"
                  description="Find an activity partner to start walking or jogging together!"
                  action={
                    <Link to="/find-partner">
                      <Button>Find Partners</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {pairings.map((pairing) => (
                    <motion.div
                      key={pairing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-elevated p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold">
                          {pairing.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{pairing.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span>{pairing.rating}</span>
                            <span>•</span>
                            <span>{pairing.sessionsCompleted} sessions</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{pairing.activityType}</Badge>
                        <Badge variant="outline">{pairing.pace}</Badge>
                        <Badge variant="outline">{pairing.preferredTime}</Badge>
                      </div>

                      <div className="bg-muted rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium">Next Session</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {pairing.nextSession}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{pairing.location}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedPairing(pairing);
                          setShowScheduleDialog(true);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Incoming Requests */}
            <TabsContent value="incoming">
              {requests.length === 0 ? (
                <EmptyState
                  title="No pending requests"
                  description="When someone sends you a pairing request, it will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-elevated p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
                            {request.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{request.name}</h3>
                              <span className="text-sm text-muted-foreground">
                                {request.age} • {request.distance}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline" className="text-xs">
                                {request.activityType}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {request.pace}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {request.preferredTime}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              "{request.message}"
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {request.sentAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <Button
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => handleAccept(request)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => handleDecline(request.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Sent Requests */}
            <TabsContent value="sent">
              {sent.length === 0 ? (
                <EmptyState
                  title="No pending requests"
                  description="Your sent pairing requests will appear here."
                  action={
                    <Link to="/find-partner">
                      <Button>Find Partners</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {sent.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-elevated p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                            {request.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.activityType} • {request.pace} • Sent {request.sentAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">Pending</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Session</DialogTitle>
            <DialogDescription>
              Pick a time and location for your next {selectedPairing?.activityType.toLowerCase()} session with {selectedPairing?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p>Calendar integration coming soon!</p>
            <p className="text-sm">For now, use the chat to coordinate with your partner.</p>
          </div>
          <Button onClick={() => setShowScheduleDialog(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="text-center py-16">
    <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6">{description}</p>
    {action}
  </div>
);

export default MyPairings;

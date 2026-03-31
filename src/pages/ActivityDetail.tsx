import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, Clock, Users, Share2, Heart,
  MessageCircle, CheckCircle, Star, ChevronRight, Send, X
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getEventById, joinEvent } from "@/lib/api";
import { getEventPlaceholderImage } from "@/lib/eventImages";

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean; time: string }[]>([]);
  const { isAuthenticated } = useAuth();

  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadEvent = async () => {
      try {
        const data = await getEventById(id);
        setActivity(data);
      } catch (error) {
        toast.error("Could not load activity details");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!id) return;
    setIsJoining(true);
    try {
      await joinEvent(id);
      setShowJoinDialog(false);
      navigate(`/activity/${id}/confirmed`);
    } catch (error: any) {
      toast.error(error.message || "Failed to join event");
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const now = new Date();
    setMessages(prev => [...prev, { text: message, fromMe: true, time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage("");
    // Simulate host reply
    setTimeout(() => {
      const replyTime = new Date();
      setMessages(prev => [...prev, {
        text: "Thanks for reaching out! I'd be happy to help. Feel free to ask any questions about the activity.",
        fromMe: false,
        time: replyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-app py-20 text-center text-muted-foreground">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!activity) {
    return (
      <Layout>
        <div className="container-app py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
          <Link to="/discover"><Button>Browse Activities</Button></Link>
        </div>
      </Layout>
    );
  }

  const spotsLeft = activity.capacity === 0 ? "Unlimited" : (activity.capacity - activity.registered);
  // Default fallbacks since schema doesn't have these specific fields
  const getHostName = () => activity.created_by?.name || activity.organizer || "Unknown Host";
  const included = ["Participate in the event", "Meet new people", "Discover the activity"];
  const requirements = ["Show up on time", "Bring a positive attitude"];
  const attendees: any[] = [];

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={activity.image_url || getEventPlaceholderImage(activity.category)} alt={activity.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Link to="/discover" className="flex items-center gap-2 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full hover:bg-background transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className={`rounded-full bg-background/80 backdrop-blur-sm ${isLiked ? "text-red-500" : ""}`} onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-6 left-4 right-4">
          <div className="container-app">
            <Badge className="mb-3 bg-primary/90 text-primary-foreground">{activity.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{activity.title}</h1>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="h-4 w-4" /><span>{activity.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container-app">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, label: "Date", value: activity.date },
                  { icon: Clock, label: "Time", value: activity.time },
                  { icon: Users, label: "Spots Left", value: `${spotsLeft}` },
                  { icon: Clock, label: "Duration", value: activity.duration || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="card-elevated p-4 text-center">
                    <item.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-4">About This Activity</h2>
                <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {included.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /><span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-4">What to Bring</h2>
                <ul className="space-y-2">
                  {requirements.map((req) => (
                    <li key={req} className="flex items-center gap-3 text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" /><span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-4">Who's Going ({activity.registered})</h2>
                <div className="flex flex-wrap gap-3">
                  {attendees.map((attendee) => (
                    <div key={attendee.name} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={attendee.avatar} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{attendee.name}</span>
                    </div>
                  ))}
                  {activity.registered > attendees.length && (
                    <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                      <span className="text-sm text-muted-foreground">+{activity.registered - attendees.length} more</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-elevated p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Hosted by</h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {getHostName().charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{getHostName()}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>5.0</span><span>•</span>
                        <span>Experienced</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 gap-2" onClick={() => {
                    if (isAuthenticated) {
                      setShowMessageDialog(true);
                    } else {
                      setShowAuthPrompt(true);
                    }
                  }}>
                    <MessageCircle className="h-4 w-4" /> Message Host
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Location</h3>
                  <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm">{activity.location}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Spots available</span>
                    <span className="font-semibold text-primary">{spotsLeft} left</span>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => {
                    if (isAuthenticated) {
                      setShowJoinDialog(true);
                    } else {
                      setShowAuthPrompt(true);
                    }
                  }} disabled={spotsLeft === 0}>
                    {spotsLeft === "Unlimited" || spotsLeft > 0 ? "Join This Activity" : "Activity Full"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Free to join • No payment required</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Activity</DialogTitle>
            <DialogDescription>You're about to join "{activity.title}" on {activity.date} at {activity.time}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Location</span><span>{activity.location}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span>{activity.duration || "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Host</span><span>{getHostName()}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>Cancel</Button>
            <Button onClick={handleJoin} disabled={isJoining}>{isJoining ? "Joining..." : "Confirm & Join"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Prompt Dialog */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>Oops! You need to have an account to take this action. Please log in or sign up to continue.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
              setShowAuthPrompt(false);
              navigate("/login");
            }}>
              Log In
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => {
              setShowAuthPrompt(false);
              navigate("/signup");
            }}>
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Host Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm">
                  {getHostName().charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{getHostName()}</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowMessageDialog(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-muted/20">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-12">
                <MessageCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p>Send a message to {getHostName()}</p>
                <p className="text-xs mt-1">Ask about the activity, meeting point, or anything else</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.fromMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.fromMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[44px] max-h-24 resize-none"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ActivityDetail;

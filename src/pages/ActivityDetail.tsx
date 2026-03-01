import { useState } from "react";
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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

const activitiesData: Record<string, {
  id: string; title: string; category: string; image: string; location: string; address: string;
  date: string; time: string; duration: string; participants: number; maxParticipants: number;
  organizer: { name: string; avatar?: string; rating: number; activitiesHosted: number };
  description: string; requirements: string[]; included: string[];
  attendees: { name: string; avatar?: string }[];
}> = {
  "1": {
    id: "1", title: "Sunrise Yoga in Central Park", category: "Wellness", image: yogaImage,
    location: "Central Park, New York", address: "Central Park West, New York, NY 10024",
    date: "January 25, 2026", time: "6:30 AM", duration: "1.5 hours", participants: 18, maxParticipants: 25,
    organizer: { name: "Sarah Mitchell", rating: 4.9, activitiesHosted: 127 },
    description: "Start your day with an invigorating sunrise yoga session in the heart of Central Park. This all-levels class combines traditional Hatha yoga with breathwork and meditation, set against the beautiful backdrop of the park at dawn.",
    requirements: ["Yoga mat (rentals available)", "Comfortable clothing", "Water bottle", "Arrive 10 minutes early"],
    included: ["Guided yoga session", "Meditation practice", "Light refreshments", "Photo opportunities"],
    attendees: [{ name: "Emma W." }, { name: "James T." }, { name: "Lisa K." }, { name: "David M." }, { name: "Rachel P." }],
  },
  "2": {
    id: "2", title: "Morning Run Club - Coastal Trail", category: "Walking & Jogging", image: runningImage,
    location: "Santa Monica Beach, LA", address: "Santa Monica State Beach, CA 90401",
    date: "January 26, 2026", time: "7:00 AM", duration: "1 hour", participants: 12, maxParticipants: 20,
    organizer: { name: "Mike Rodriguez", rating: 4.8, activitiesHosted: 89 },
    description: "Join our friendly running club for a refreshing morning run along the beautiful Santa Monica coastline. We cater to all paces with group splits for beginners, intermediate, and advanced runners.",
    requirements: ["Running shoes", "Athletic wear", "Water bottle", "Sunscreen"],
    included: ["Pace groups", "Route guidance", "Post-run stretching", "Hydration station"],
    attendees: [{ name: "Chris B." }, { name: "Amanda L." }, { name: "Kevin S." }, { name: "Nina R." }],
  },
  "3": {
    id: "3", title: "Weekend Camping Adventure", category: "Camping", image: campingImage,
    location: "Yosemite National Park", address: "Yosemite Valley, CA 95389",
    date: "January 31, 2026", time: "2:00 PM", duration: "2 days", participants: 8, maxParticipants: 12,
    organizer: { name: "Adventure Co.", rating: 4.9, activitiesHosted: 234 },
    description: "Experience the magic of Yosemite on this unforgettable weekend camping adventure. From setting up camp to stargazing by the fire, this trip offers the perfect escape from city life.",
    requirements: ["Sleeping bag", "Warm layers", "Hiking boots", "Flashlight", "Personal items"],
    included: ["Campsite reservation", "Cooking equipment", "Guided hikes", "Campfire activities", "Breakfast & dinner"],
    attendees: [{ name: "Tom H." }, { name: "Julia M." }, { name: "Brian K." }],
  },
  "4": {
    id: "4", title: "HIIT Group Training Session", category: "Fitness", image: gymImage,
    location: "FitLife Gym, Downtown", address: "450 Main Street, Downtown, NY 10001",
    date: "January 24, 2026", time: "5:30 PM", duration: "45 minutes", participants: 15, maxParticipants: 20,
    organizer: { name: "Coach Alex", rating: 4.7, activitiesHosted: 312 },
    description: "Get ready to sweat with this high-intensity interval training session! Our certified trainer will guide you through a series of challenging exercises designed to boost your metabolism and build strength.",
    requirements: ["Indoor athletic shoes", "Workout clothes", "Towel", "Water bottle"],
    included: ["Professional coaching", "Equipment provided", "Cool-down stretching", "Locker room access"],
    attendees: [{ name: "Alex P." }, { name: "Maria G." }, { name: "Steve L." }, { name: "Karen W." }, { name: "John D." }],
  },
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean; time: string }[]>([]);

  const activity = id ? activitiesData[id] : null;

  const handleJoin = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      setShowJoinDialog(false);
      navigate(`/activity/${id}/confirmed`);
    }, 1500);
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

  const spotsLeft = activity.maxParticipants - activity.participants;

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
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
                  { icon: Users, label: "Spots Left", value: `${spotsLeft} of ${activity.maxParticipants}` },
                  { icon: Clock, label: "Duration", value: activity.duration },
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
                  {activity.included.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /><span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-4">What to Bring</h2>
                <ul className="space-y-2">
                  {activity.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-3 text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" /><span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-4">Who's Going ({activity.participants})</h2>
                <div className="flex flex-wrap gap-3">
                  {activity.attendees.map((attendee) => (
                    <div key={attendee.name} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={attendee.avatar} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{attendee.name}</span>
                    </div>
                  ))}
                  {activity.participants > activity.attendees.length && (
                    <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                      <span className="text-sm text-muted-foreground">+{activity.participants - activity.attendees.length} more</span>
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
                      <AvatarImage src={activity.organizer.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {activity.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{activity.organizer.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{activity.organizer.rating}</span><span>•</span>
                        <span>{activity.organizer.activitiesHosted} hosted</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 gap-2" onClick={() => setShowMessageDialog(true)}>
                    <MessageCircle className="h-4 w-4" /> Message Host
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Location</h3>
                  <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm">{activity.address}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Spots available</span>
                    <span className="font-semibold text-primary">{spotsLeft} left</span>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => setShowJoinDialog(true)} disabled={spotsLeft === 0}>
                    {spotsLeft > 0 ? "Join This Activity" : "Activity Full"}
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
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span>{activity.duration}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Host</span><span>{activity.organizer.name}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>Cancel</Button>
            <Button onClick={handleJoin} disabled={isJoining}>{isJoining ? "Joining..." : "Confirm & Join"}</Button>
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
                  {activity.organizer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{activity.organizer.name}</p>
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
                <p>Send a message to {activity.organizer.name}</p>
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

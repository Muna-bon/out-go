import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, Calendar, Clock, MapPin, Users, 
  Share2, CalendarPlus, MessageCircle, ArrowRight, Home 
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import yogaImage from "@/assets/activity-yoga.jpg";
import runningImage from "@/assets/activity-running.jpg";
import campingImage from "@/assets/activity-camping.jpg";
import gymImage from "@/assets/activity-gym.jpg";

const activitiesData: Record<string, {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  organizer: string;
}> = {
  "1": {
    id: "1",
    title: "Sunrise Yoga in Central Park",
    category: "Wellness",
    image: yogaImage,
    location: "Central Park, New York",
    address: "Central Park West, New York, NY 10024",
    date: "January 25, 2026",
    time: "6:30 AM",
    duration: "1.5 hours",
    organizer: "Sarah Mitchell",
  },
  "2": {
    id: "2",
    title: "Morning Run Club - Coastal Trail",
    category: "Walking & Jogging",
    image: runningImage,
    location: "Santa Monica Beach, LA",
    address: "Santa Monica State Beach, CA 90401",
    date: "January 26, 2026",
    time: "7:00 AM",
    duration: "1 hour",
    organizer: "Mike Rodriguez",
  },
  "3": {
    id: "3",
    title: "Weekend Camping Adventure",
    category: "Camping",
    image: campingImage,
    location: "Yosemite National Park",
    address: "Yosemite Valley, CA 95389",
    date: "January 31, 2026",
    time: "2:00 PM",
    duration: "2 days",
    organizer: "Adventure Co.",
  },
  "4": {
    id: "4",
    title: "HIIT Group Training Session",
    category: "Fitness",
    image: gymImage,
    location: "FitLife Gym, Downtown",
    address: "450 Main Street, Downtown, NY 10001",
    date: "January 24, 2026",
    time: "5:30 PM",
    duration: "45 minutes",
    organizer: "Coach Alex",
  },
};

const ActivityConfirmed = () => {
  const { id } = useParams<{ id: string }>();
  const activity = id ? activitiesData[id] : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/activity/${id}`);
    toast.success("Activity link copied! Share it with friends.");
  };

  const handleAddToCalendar = () => {
    toast.success("Calendar event created!");
  };

  if (!activity) {
    return (
      <Layout>
        <div className="container-app py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
          <Link to="/discover">
            <Button>Browse Activities</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center py-12">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-14 w-14 text-green-500" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                You've successfully joined the activity. We've sent a confirmation to your email.
              </p>
            </motion.div>

            {/* Activity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-elevated overflow-hidden mb-8"
            >
              <div className="relative h-48">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <h2 className="text-xl font-bold text-white">{activity.title}</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{activity.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{activity.time}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{activity.location}</p>
                    <p className="text-sm text-muted-foreground">{activity.address}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p className="font-medium">{activity.organizer}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleAddToCalendar}
                >
                  <CalendarPlus className="h-4 w-4" />
                  Add to Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share with Friends
                </Button>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Message the Host
              </Button>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/discover">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Discover More Activities
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="gap-2 w-full sm:w-auto">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 bg-muted/30 rounded-2xl text-left"
            >
              <h3 className="font-semibold mb-3">Before You Go</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Check the weather forecast and dress appropriately</li>
                <li>• Arrive 10-15 minutes early to meet your group</li>
                <li>• Bring a water bottle and any required equipment</li>
                <li>• Let the host know if you need to cancel</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ActivityConfirmed;

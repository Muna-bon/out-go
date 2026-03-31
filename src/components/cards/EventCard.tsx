import { motion } from "framer-motion";
import { MapPin, Calendar, Users, DollarSign, ArrowRight, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getEventPlaceholderImage } from "@/lib/eventImages";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  image_url?: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  registered: number;
  price?: number;
  organizer: string;
  featured?: boolean;
  is_featured?: boolean;
  is_recurring?: boolean;
  end_date?: string;
}

const getTimelineBadge = (dateStr: string, endDateStr?: string) => {
  const now = new Date();
  const eventDate = new Date(dateStr);
  const endDate = endDateStr ? new Date(endDateStr) : eventDate;
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const nextWeek = new Date(today.getTime() + 7 * 86400000);
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  // Past event
  if (endDate < now) {
    return { label: "Past", class: "bg-gray-500/10 text-gray-500 border-gray-500/20" };
  }
  
  // Happening now (between start and end)
  if (eventDate <= now && endDate >= now) {
    return { label: "Happening Now", class: "bg-green-500/10 text-green-600 border-green-500/20 animate-pulse" };
  }
  
  // Today
  if (eventDay.getTime() === today.getTime()) {
    return { label: "Today", class: "bg-red-500/10 text-red-600 border-red-500/20" };
  }
  
  // Tomorrow
  if (eventDay.getTime() === tomorrow.getTime()) {
    return { label: "Tomorrow", class: "bg-orange-500/10 text-orange-600 border-orange-500/20" };
  }
  
  // This week
  if (eventDay < nextWeek) {
    return { label: "This Week", class: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
  }
  
  return null;
};

// Generate placeholder avatar initials with colors
const AVATAR_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
  "bg-amber-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
];

const EventCard = ({
  id,
  title,
  description,
  category,
  image,
  image_url,
  location,
  date,
  time,
  capacity,
  registered,
  price,
  organizer,
  featured = false,
  is_featured = false,
  is_recurring = false,
  end_date,
}: EventCardProps) => {
  const navigate = useNavigate();
  const spotsLeft = capacity - registered;
  const isFilling = spotsLeft < capacity * 0.2 && spotsLeft > 0;
  const isFull = spotsLeft <= 0;
  const isFeaturedEvent = featured || is_featured;
  const timeline = getTimelineBadge(date, end_date);

  // Simulated participant avatars (just display count visually)
  const displayedAvatars = Math.min(registered, 4);
  const extraCount = registered - displayedAvatars;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-card rounded-2xl overflow-hidden group border transition-all duration-300 ${
        isFeaturedEvent
          ? "border-yellow-400/50 shadow-lg shadow-yellow-500/5"
          : "border-border hover:border-primary/30 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image || image_url || getEventPlaceholderImage(category)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {isFeaturedEvent && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 text-xs shadow-sm">
                ⭐ Featured
              </Badge>
            )}
            {is_recurring && (
              <Badge className="bg-blue-500/90 text-white border-0 text-xs shadow-sm gap-1">
                <RefreshCw className="h-3 w-3" /> Recurring
              </Badge>
            )}
          </div>
          {timeline && (
            <Badge className={`text-xs border shadow-sm ${timeline.class}`}>
              {timeline.label}
            </Badge>
          )}
        </div>

        {/* Bottom: "Join Now" button overlay */}
        <div className="absolute bottom-3 right-3">
          <Button
            size="sm"
            className="rounded-full px-4 text-xs font-semibold shadow-lg"
            onClick={() => navigate(`/activity/${id}`)}
            disabled={isFull}
          >
            {isFull ? "Full" : "Join Now"}
          </Button>
        </div>

        {/* Bottom left: Category */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm text-xs">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>{date} • {time}</span>
          </div>
        </div>

        {/* Members avatars row + price */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {Array.from({ length: displayedAvatars }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 border-card ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  +{extraCount}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {registered > 0 ? `${registered} People` : "Be first!"}
            </span>
          </div>
          <div className="text-right">
            {price !== undefined && price > 0 ? (
              <span className="font-bold text-sm">₦{price.toLocaleString()}</span>
            ) : (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">Free</Badge>
            )}
          </div>
        </div>

        {/* Filling up indicator */}
        {isFilling && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
            <Clock className="h-3 w-3" />
            <span className="font-medium">{spotsLeft} spots left — filling up fast!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;

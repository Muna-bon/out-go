import { motion } from "framer-motion";
import { MapPin, Calendar, Users, DollarSign, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  registered: number;
  price?: number;
  organizer: string;
  featured?: boolean;
}

const EventCard = ({
  title,
  description,
  category,
  image,
  location,
  date,
  time,
  capacity,
  registered,
  price,
  organizer,
  featured = false,
}: EventCardProps) => {
  const spotsLeft = capacity - registered;
  const isFilling = spotsLeft < capacity * 0.2;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`card-elevated overflow-hidden group ${featured ? "ring-2 ring-primary" : ""}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        
        {featured && (
          <div className="absolute top-3 left-3 gradient-bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-semibold">
            Featured
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{date} at {time}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>{registered}/{capacity} registered</span>
            </div>
            {isFilling && (
              <Badge variant="destructive" className="text-xs">
                {spotsLeft} spots left!
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            {price !== undefined && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-secondary" />
                <span className="font-semibold">{price === 0 ? "Free" : `$${price}`}</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">by {organizer}</span>
          </div>
          <Button size="sm" className="gap-1 group/btn">
            Register
            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;

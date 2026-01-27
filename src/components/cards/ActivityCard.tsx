import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants?: number;
  organizer: string;
  organizerAvatar?: string;
}

const categoryColors: Record<string, string> = {
  walking: "bg-walking/10 text-walking border-walking/20",
  fitness: "bg-fitness/10 text-fitness border-fitness/20",
  hiking: "bg-hiking/10 text-hiking border-hiking/20",
  camping: "bg-camping/10 text-camping border-camping/20",
  wellness: "bg-wellness/10 text-wellness border-wellness/20",
  gym: "bg-gym/10 text-gym border-gym/20",
  sightseeing: "bg-sightseeing/10 text-sightseeing border-sightseeing/20",
};

const ActivityCard = ({
  id,
  title,
  category,
  image,
  location,
  date,
  time,
  participants,
  maxParticipants,
  organizer,
}: ActivityCardProps) => {
  const categoryKey = category.toLowerCase().split(" ")[0];
  const colorClass = categoryColors[categoryKey] || "bg-primary/10 text-primary border-primary/20";

  return (
    <Link to={`/activity/${id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
        className="card-elevated overflow-hidden group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <Badge className={`absolute top-3 left-3 ${colorClass} border`}>
            {category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>
                {participants}{maxParticipants ? `/${maxParticipants}` : ""} joined
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-medium">
                {organizer.charAt(0)}
              </div>
              <span className="text-sm font-medium">{organizer}</span>
            </div>
            <Button size="sm">Join</Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ActivityCard;

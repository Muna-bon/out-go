import { motion } from "framer-motion";
import { MapPin, Star, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VendorCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  hours: string;
  verified: boolean;
  services: string[];
}

const VendorCard = ({
  name,
  type,
  image,
  location,
  rating,
  reviewCount,
  hours,
  verified,
  services,
}: VendorCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="card-elevated overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        {verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-2 py-1 rounded-lg text-xs font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
          <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-sm">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{hours}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{services.length - 3} more
            </Badge>
          )}
        </div>

        <Button className="w-full" variant="outline">
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default VendorCard;

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Zap, Star, MessageCircle, UserPlus, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PartnerCardProps {
  id: string;
  name: string;
  avatar: string | null;
  age: number;
  distance: string;
  activityType: string;
  preferredTime: string;
  pace: string;
  bio: string;
  interests: string[];
  rating: number;
  completedPairings: number;
  isOnline: boolean;
}

const PartnerCard = ({
  name,
  avatar,
  age,
  distance,
  activityType,
  preferredTime,
  pace,
  bio,
  interests,
  rating,
  completedPairings,
  isOnline,
}: PartnerCardProps) => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isRequested, setIsRequested] = useState(false);

  const handleSendRequest = () => {
    setIsRequested(true);
    setShowRequestDialog(false);
    setMessage("");
    toast.success(`Pairing request sent to ${name}!`, {
      description: "You'll be notified when they respond.",
    });
  };

  const paceColors: Record<string, string> = {
    Leisurely: "bg-secondary/10 text-secondary border-secondary/20",
    Moderate: "bg-accent/20 text-accent-foreground border-accent/30",
    Fast: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="card-elevated p-6 relative overflow-hidden group"
      >
        {/* Online Indicator */}
        {isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="text-xs text-secondary font-medium">Online</span>
          </div>
        )}

        {/* Avatar & Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold">
              {name.charAt(0)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{age} years old</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{distance}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-muted-foreground">
                ({completedPairings} pairings)
              </span>
            </div>
          </div>
        </div>

        {/* Activity Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
            {activityType}
          </Badge>
          <Badge variant="outline" className={paceColors[pace]}>
            <Zap className="h-3 w-3 mr-1" />
            {pace}
          </Badge>
          <Badge variant="outline" className="bg-secondary/10 border-secondary/20 text-secondary-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {preferredTime}
          </Badge>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {interests.map((interest) => (
            <span
              key={interest}
              className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isRequested ? (
            <Button variant="outline" className="flex-1 text-secondary" disabled>
              <Check className="h-4 w-4 mr-2" />
              Request Sent
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => setShowRequestDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Request Pairing
            </Button>
          )}
          <Button variant="outline" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Pairing Request to {name}</DialogTitle>
            <DialogDescription>
              Include a personal message to introduce yourself and explain why you'd make a great activity partner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                {name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {activityType} • {pace} pace • {preferredTime}
                </p>
              </div>
            </div>
            <Textarea
              placeholder="Hi! I noticed we both enjoy morning walks. I'd love to be your walking buddy..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRequestDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSendRequest}>
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartnerCard;

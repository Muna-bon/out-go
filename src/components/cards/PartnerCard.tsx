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
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { sendPairingRequest } from "@/lib/api";

interface PartnerCardProps {
  id: string;
  name: string;
  avatar?: string | null;
  avatar_url?: string | null;
  age?: number | null;
  location?: string | null;
  activity_type?: string | null;
  preferred_time?: string | null;
  pace?: string | null;
  bio?: string | null;
  interests?: string[] | null;
  rating?: number | null;
  completed_pairings?: number | null;
  isOnline?: boolean;
}

const PartnerCard = ({
  id,
  name,
  avatar,
  avatar_url,
  age,
  location,
  activity_type,
  preferred_time,
  pace,
  bio,
  interests,
  rating,
  completed_pairings,
  isOnline = false,
}: PartnerCardProps) => {
  const displayAge = age || 25;
  const displayDistance = location || "Local Area";
  const displayActivity = activity_type || "Walking";
  const displayTime = preferred_time || "Any Time";
  const displayPace = pace || "Moderate";
  const displayBio = bio || "Ready to get active!";
  const displayInterests = interests || ["Fitness", "Health"];
  const displayRating = rating || 5.0;
  const displayPairings = completed_pairings || 0;
  const displayAvatar = avatar_url || avatar;
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [isRequested, setIsRequested] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const isSelf = user?.id === id;

  const handleSendRequest = async () => {
    try {
      await sendPairingRequest(id, message);
      setIsRequested(true);
      setShowRequestDialog(false);
      setMessage("");
      toast.success(`Pairing request sent to ${name}!`, {
        description: "You'll be notified when they respond.",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to send request.");
    }
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
        <Link to={`/partner/${id}`} className="flex items-start gap-4 mb-4 hover:opacity-80 transition-opacity">
          <div className="relative">
            {displayAvatar ? (
              <img src={displayAvatar} alt={name} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{displayAge} years old</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{displayDistance}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{displayRating}</span>
              <span className="text-sm text-muted-foreground">
                ({displayPairings} pairings)
              </span>
            </div>
          </div>
        </Link>

        {/* Activity Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
            {displayActivity}
          </Badge>
          <Badge variant="outline" className={paceColors[displayPace] || "bg-accent/20 text-accent-foreground border-accent/30"}>
            <Zap className="h-3 w-3 mr-1" />
            {displayPace}
          </Badge>
          <Badge variant="outline" className="bg-secondary/10 border-secondary/20 text-secondary-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {displayTime}
          </Badge>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{displayBio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {displayInterests.map((interest) => (
            <span
              key={interest}
              className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Actions */}
        {!isSelf && (
          <div className="flex gap-2">
            {isRequested ? (
              <Button variant="outline" className="flex-1 text-secondary" disabled>
                <Check className="h-4 w-4 mr-2" />
                Request Sent
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => {
                if (isAuthenticated) {
                  setShowRequestDialog(true);
                } else {
                  setShowAuthPrompt(true);
                }
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Request Pairing
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={() => {
              if (isAuthenticated) {
                toast("Messaging feature coming soon!");
              } else {
                setShowAuthPrompt(true);
              }
            }}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
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
              {displayAvatar ? (
                <img src={displayAvatar} alt={name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {displayActivity} • {displayPace} pace • {displayTime}
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
    </>
  );
};

export default PartnerCard;

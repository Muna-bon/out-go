import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, Users, CheckCircle, X, Settings, Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserLocation } from "@/context/LocationContext";
import { supabase } from "@/integrations/supabase/client";

export interface NotificationItem {
  id: string;
  type: "activity" | "pairing" | "reminder" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

interface NotificationsDropdownProps {
  user?: any;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ user: propUser }) => {
  const [currentUser, setCurrentUser] = useState<any>(propUser ?? null);
  const { location } = useUserLocation();
  const [open, setOpen] = useState(false);

  // Sync auth state
  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [propUser]);

  // Generate notifications tailored for the authenticated user and their detected city
  const cityLabel = location && location !== "Detecting location..." ? location : "Your Area";
  const storageKey = currentUser?.id ? `outgo_user_notifications_${currentUser.id}` : null;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    // Default rich in-app notification prompts configured for every user
    const defaultNotifs: NotificationItem[] = [
      {
        id: "profile-completion-prompt",
        type: "system",
        title: "Complete Your Profile 🌟",
        message: "Add your bio, fitness level, and favorite sports to unlock tailored partner recommendations.",
        time: "Just now",
        read: false,
        link: "/profile?prompt_update=true",
      },
      {
        id: "city-activity-prompt",
        type: "activity",
        title: `Activities in ${cityLabel} 📍`,
        message: `Discover group runs, outdoor yoga, and cycling sessions happening near ${cityLabel}.`,
        time: "15 min ago",
        read: false,
        link: "/discover",
      },
      {
        id: "partner-match-prompt",
        type: "pairing",
        title: "New Partner Match Available 🤝",
        message: "Active members near you share your workout schedule and are looking for activity buddies.",
        time: "1 hour ago",
        read: false,
        link: "/find-partner",
      },
      {
        id: "upcoming-activity-prompt",
        type: "reminder",
        title: "Upcoming Activity Tomorrow ⏰",
        message: "Morning Run Club starts tomorrow at 7:00 AM. Don't forget your gear!",
        time: "Yesterday",
        read: true,
        link: "/my-activities",
      },
    ];

    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to load notifications from storage", e);
      }
    }

    setNotifications(defaultNotifs);
  }, [currentUser, cityLabel, storageKey]);

  // Save changes to storage
  const persistNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist notifications", e);
      }
    }
  };

  // Rule: Only a signed in user with actual notification should see it!
  if (!currentUser || notifications.length === 0) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    persistNotifications(updated);
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "pairing":
        return <Users className="h-4 w-4 text-primary" />;
      case "activity":
        return <Calendar className="h-4 w-4 text-cyan-500" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-amber-500" />;
      case "system":
        return <Sparkles className="h-4 w-4 text-emerald-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground h-9 w-9 rounded-xl hover:bg-muted"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-84 sm:w-96 p-0 shadow-2xl border-border rounded-2xl overflow-hidden" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Mark all read
              </Button>
            )}
            <Link to="/settings/notifications" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <ScrollArea className="max-h-[380px]">
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3.5 hover:bg-muted/50 transition-colors relative group ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <Link
                  to={notification.link || "#"}
                  onClick={() => {
                    markAsRead(notification.id);
                    setOpen(false);
                  }}
                  className="block pr-6"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-muted flex items-center justify-center mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="font-medium text-xs text-foreground truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="absolute top-3.5 right-3 text-muted-foreground/60 hover:text-foreground p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-border bg-muted/20 flex items-center justify-between">
          <Link
            to="/my-activities"
            onClick={() => setOpen(false)}
            className="text-xs text-primary font-medium hover:underline px-2 py-1"
          >
            View All Activities
          </Link>
          <span className="text-[10px] text-muted-foreground px-2">
            In-app notifications enabled
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;

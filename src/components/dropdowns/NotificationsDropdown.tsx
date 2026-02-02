import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, Users, CheckCircle, X, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "activity" | "pairing" | "reminder" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "pairing",
    title: "New Partner Request",
    message: "Sarah M. wants to pair with you for morning jogs",
    time: "5 min ago",
    read: false,
    link: "/my-pairings",
  },
  {
    id: "2",
    type: "activity",
    title: "Activity Reminder",
    message: "Sunrise Yoga starts tomorrow at 6:30 AM",
    time: "1 hour ago",
    read: false,
    link: "/my-activities",
  },
  {
    id: "3",
    type: "activity",
    title: "New Activity Near You",
    message: "Beach Volleyball game happening this weekend",
    time: "3 hours ago",
    read: true,
    link: "/discover",
  },
  {
    id: "4",
    type: "system",
    title: "Welcome to OutGo!",
    message: "Complete your profile to get personalized recommendations",
    time: "1 day ago",
    read: true,
    link: "/profile",
  },
];

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "pairing":
        return <Users className="h-4 w-4 text-primary" />;
      case "activity":
        return <Calendar className="h-4 w-4 text-accent" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Link to="/settings/notifications">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors relative ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <Link
                    to={notification.link || "#"}
                    onClick={() => {
                      markAsRead(notification.id);
                      setOpen(false);
                    }}
                    className="block"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {!notification.read && (
                    <div className="absolute top-4 right-10 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t border-border">
            <Link to="/my-activities" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-center">
                View All Activity
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;

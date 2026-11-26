import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  Bell,
  Shield,
  LogOut,
  MapPin,
  CheckCircle2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserLocation } from "@/context/LocationContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "account" | "notifications" | "security";
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onOpenChange,
  defaultTab = "account",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Notification preferences state
  const [notifPreferences, setNotifPreferences] = useState({
    partnerMatches: true,
    activityReminders: true,
    localEvents: true,
    weeklyDigest: false,
  });

  const { location: detectedLocation, detectLocation, isLocating } = useUserLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || "");
        const meta = currentUser.user_metadata || {};
        setName(meta.full_name || meta.name || "");
        setLocation(meta.location || "");

        // Load notification preferences from localStorage
        const savedNotifs = localStorage.getItem(`outgo_notif_prefs_${currentUser.id}`);
        if (savedNotifs) {
          try {
            setNotifPreferences(JSON.parse(savedNotifs));
          } catch (e) {
            // keep defaults
          }
        }
      }
    };

    if (open) {
      loadUserData();
    }
  }, [open]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          location: location.trim(),
        },
      });

      if (error) throw error;

      toast.success("Settings updated successfully!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotif = (key: keyof typeof notifPreferences) => {
    const updated = {
      ...notifPreferences,
      [key]: !notifPreferences[key],
    };
    setNotifPreferences(updated);
    if (user?.id) {
      localStorage.setItem(`outgo_notif_prefs_${user.id}`, JSON.stringify(updated));
    }
    toast.success("Notification preferences saved");
  };

  const handlePasswordReset = async () => {
    if (!email) return;
    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw error;
      toast.success("Password reset email sent!", {
        description: "Check your inbox for instructions to set a new password.",
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to send reset link.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      onOpenChange(false);
      navigate("/");
    } catch (err: any) {
      toast.error("Failed to sign out");
    }
  };

  const handleDetectGPS = async () => {
    const loc = await detectLocation(false);
    if (loc) {
      setLocation(loc);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 border-border rounded-2xl">
        <div className="p-6 border-b border-border bg-muted/30">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Settings className="h-4 w-4" />
              </div>
              <DialogTitle className="text-xl font-bold">Account Settings</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Manage your profile preferences, notifications, and login security.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
          <div className="px-6 pt-4 border-b border-border">
            <TabsList className="grid grid-cols-3 w-full bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="account" className="gap-2 text-xs sm:text-sm rounded-lg">
                <User className="h-3.5 w-3.5" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 text-xs sm:text-sm rounded-lg">
                <Bell className="h-3.5 w-3.5" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm rounded-lg">
                <Shield className="h-3.5 w-3.5" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Account Tab */}
          <TabsContent value="account" className="p-6 space-y-5 focus-visible:outline-none">
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <Label htmlFor="settings-name" className="text-xs font-semibold">
                  Display Name
                </Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 h-10"
                />
              </div>

              <div>
                <Label htmlFor="settings-email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="settings-email"
                    value={email}
                    disabled
                    className="h-10 bg-muted/40 cursor-not-allowed pr-24"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Connected via OutGo authentication.
                </p>
              </div>

              <div>
                <Label htmlFor="settings-location" className="text-xs font-semibold">
                  Primary City / Location
                </Label>
                <div className="relative mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="settings-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Abuja, Nigeria"
                      className="pl-9 h-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="h-10 text-xs gap-1.5 shrink-0"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLocating ? "animate-spin text-primary" : ""}`} />
                    {isLocating ? "Detecting..." : "Auto-detect"}
                  </Button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="p-6 space-y-4 focus-visible:outline-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                <div className="space-y-0.5 pr-4">
                  <p className="font-medium text-sm">Partner Match Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive in-app alerts when an active member near you shares your workout schedule.
                  </p>
                </div>
                <Switch
                  checked={notifPreferences.partnerMatches}
                  onCheckedChange={() => handleToggleNotif("partnerMatches")}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                <div className="space-y-0.5 pr-4">
                  <p className="font-medium text-sm">Upcoming Activity Reminders</p>
                  <p className="text-xs text-muted-foreground">
                    Get timely reminders 24 hours and 1 hour before activities you have joined.
                  </p>
                </div>
                <Switch
                  checked={notifPreferences.activityReminders}
                  onCheckedChange={() => handleToggleNotif("activityReminders")}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                <div className="space-y-0.5 pr-4">
                  <p className="font-medium text-sm">Local City Activities</p>
                  <p className="text-xs text-muted-foreground">
                    Notifies you when fresh running clubs, yoga sessions, or events are posted in your city.
                  </p>
                </div>
                <Switch
                  checked={notifPreferences.localEvents}
                  onCheckedChange={() => handleToggleNotif("localEvents")}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="p-6 space-y-6 focus-visible:outline-none">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div>
                <p className="font-semibold text-sm">Change Password</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receive a secure link to your email ({email || "your address"}) to reset or update your password.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePasswordReset}
                disabled={isSendingReset}
                className="gap-2 text-xs"
              >
                <Mail className="h-3.5 w-3.5" />
                {isSendingReset ? "Sending reset email..." : "Send Password Reset Link"}
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
              <div>
                <p className="font-semibold text-sm text-destructive">Account Session</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Log out of OutGo on this browser. You can sign back in anytime.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out of Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

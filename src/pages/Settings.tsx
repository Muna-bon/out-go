import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  LogOut,
  MapPin,
  CheckCircle2,
  Mail,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserLocation } from "@/context/LocationContext";
import { toast } from "sonner";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [notifPreferences, setNotifPreferences] = useState({
    partnerMatches: true,
    activityReminders: true,
    localEvents: true,
  });

  const { location: detectedLocation, detectLocation, isLocating } = useUserLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
      setEmail(currentUser.email || "");
      const meta = currentUser.user_metadata || {};
      setName(meta.full_name || meta.name || "");
      setLocation(meta.location || "");

      const savedNotifs = localStorage.getItem(`outgo_notif_prefs_${currentUser.id}`);
      if (savedNotifs) {
        try {
          setNotifPreferences(JSON.parse(savedNotifs));
        } catch (e) {}
      }
    };

    fetchUser();
  }, [navigate]);

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
      toast.success("Account settings updated successfully!");
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
    toast.success("Notification settings saved");
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
        description: "Check your inbox for a link to update your password.",
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
    <Layout>
      <div className="container-app py-10 max-w-4xl min-h-[75vh]">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>

        <div className="card-elevated p-6 sm:p-8 rounded-2xl">
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setSearchParams({ tab: val });
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 max-w-md bg-muted/60 p-1 rounded-xl mb-6">
              <TabsTrigger value="account" className="gap-2 text-xs sm:text-sm rounded-lg">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 text-xs sm:text-sm rounded-lg">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm rounded-lg">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold mb-1">Personal Details</h3>
                <p className="text-xs text-muted-foreground">
                  Update your display name and default city for local activities.
                </p>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <Label htmlFor="page-settings-name" className="text-xs font-semibold">
                    Display Name
                  </Label>
                  <Input
                    id="page-settings-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1.5 h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="page-settings-email" className="text-xs font-semibold">
                    Email Address
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="page-settings-email"
                      value={email}
                      disabled
                      className="h-10 bg-muted/40 cursor-not-allowed pr-24"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="page-settings-location" className="text-xs font-semibold">
                    Primary City / Location
                  </Label>
                  <div className="relative mt-1.5 flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="page-settings-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Abuja, London, etc."
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

                <div className="pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold mb-1">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground">
                  Choose which alerts and reminders you receive in your OutGo feed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div className="space-y-0.5 pr-4">
                    <p className="font-medium text-sm">Partner Match Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when members nearby share your preferred workout times.
                    </p>
                  </div>
                  <Switch
                    checked={notifPreferences.partnerMatches}
                    onCheckedChange={() => handleToggleNotif("partnerMatches")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div className="space-y-0.5 pr-4">
                    <p className="font-medium text-sm">Upcoming Activity Reminders</p>
                    <p className="text-xs text-muted-foreground">
                      Reminders 24 hours and 1 hour before scheduled group runs and classes.
                    </p>
                  </div>
                  <Switch
                    checked={notifPreferences.activityReminders}
                    onCheckedChange={() => handleToggleNotif("activityReminders")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div className="space-y-0.5 pr-4">
                    <p className="font-medium text-sm">Local City Activities</p>
                    <p className="text-xs text-muted-foreground">
                      Alerts when new public events and workouts are scheduled in your city.
                    </p>
                  </div>
                  <Switch
                    checked={notifPreferences.localEvents}
                    onCheckedChange={() => handleToggleNotif("localEvents")}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold mb-1">Security & Session</h3>
                <p className="text-xs text-muted-foreground">
                  Manage your password and active sign-in session.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <div>
                  <p className="font-semibold text-sm">Password Management</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click below to receive a secure link at {email || "your address"} to change your password.
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
                  {isSendingReset ? "Sending..." : "Send Password Reset Email"}
                </Button>
              </div>

              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
                <div>
                  <p className="font-semibold text-sm text-destructive">Account Session</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sign out of your OutGo session on this device.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

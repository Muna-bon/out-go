import { useState } from "react";
import { Settings, Shield, Percent, Bell, Globe, Star, ArrowLeftRight } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminSettings = () => {
    const [platformFee, setPlatformFee] = useState("2");
    const [featuredFee, setFeaturedFee] = useState("1000");
    const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
    const [settings, setSettings] = useState({
        autoApproveVendors: false,
        emailNotifications: true,
        maintenanceMode: false,
        allowFeaturedEvents: true,
    });

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const currencySymbol = currency === "NGN" ? "₦" : "$";

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-3xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground mt-1">Configure platform settings</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setCurrency(currency === "NGN" ? "USD" : "NGN")}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        {currency}
                    </Button>
                </div>

                {/* Platform Fee */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-5 w-5 text-primary" />
                            Platform Transaction Fee
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Fee Percentage (%)</Label>
                            <div className="flex items-center gap-3 mt-2">
                                <Input type="number" min="0" max="50" step="0.1" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} className="w-32" />
                                <span className="text-sm text-muted-foreground">Applied to all paid registrations and vendor transactions</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Current fee: {platformFee}% of every paid event registration and vendor signup through the platform.
                        </p>
                    </CardContent>
                </Card>

                {/* Featured Event Fee */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Featured Event Fee
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-medium">Allow featured events</p>
                                <p className="text-sm text-muted-foreground">Users can pay to feature their events</p>
                            </div>
                            <Switch
                                checked={settings.allowFeaturedEvents}
                                onCheckedChange={(checked) => setSettings({ ...settings, allowFeaturedEvents: checked })}
                            />
                        </div>
                        <div>
                            <Label>Fee Per Week ({currencySymbol})</Label>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="relative w-48">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencySymbol}</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={featuredFee}
                                        onChange={(e) => setFeaturedFee(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground">per week of featuring</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Featured events get a highlighted badge and priority placement in search results and on the homepage.
                        </p>
                    </CardContent>
                </Card>

                {/* Vendor Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Vendor Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Auto-approve vendors</p>
                                <p className="text-sm text-muted-foreground">New vendors are automatically set to active status</p>
                            </div>
                            <Switch checked={settings.autoApproveVendors} onCheckedChange={(checked) => setSettings({ ...settings, autoApproveVendors: checked })} />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email notifications</p>
                                <p className="text-sm text-muted-foreground">Receive email at maimunahussaini66@gmail.com for new vendor applications and form submissions</p>
                            </div>
                            <Switch checked={settings.emailNotifications} onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })} />
                        </div>
                    </CardContent>
                </Card>

                {/* Platform */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Platform
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Maintenance mode</p>
                                <p className="text-sm text-muted-foreground">Temporarily disable public access to the platform</p>
                            </div>
                            <Switch checked={settings.maintenanceMode} onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })} />
                        </div>
                    </CardContent>
                </Card>

                <Button size="lg" onClick={handleSave}>Save All Settings</Button>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, User, MapPin, Activity, Clock, Zap, Camera, Mail, X, Plus, Heart, Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, deleteAccount, uploadAvatar } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationInput } from "@/components/ui/LocationInput";

const INTEREST_SUGGESTIONS = [
    "Yoga", "Running", "Hiking", "Swimming", "Cycling",
    "Tennis", "Basketball", "Meditation", "CrossFit", "Dance",
    "Rock Climbing", "Surfing", "Martial Arts", "Photography",
    "Kayaking", "Pilates", "Boxing", "Golf", "Volleyball", "Skiing",
];

const ProfileSettings = () => {
    const { user, isAuthenticated, logout, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isNewUser = searchParams.get("new") === "true";
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newInterest, setNewInterest] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: "",
        bio: "",
        age: "",
        activity_type: "walking",
        preferred_time: "morning",
        pace: "moderate",
        interests: [] as string[],
        email_notifications: true,
        push_notifications: true,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                location: user.location || "",
                bio: user.bio || "",
                age: user.age?.toString() || "",
                activity_type: user.activity_type || "walking",
                preferred_time: user.preferred_time || "morning",
                pace: user.pace || "moderate",
                interests: user.interests || [],
                email_notifications: user.email_notifications ?? true,
                push_notifications: user.push_notifications ?? true,
            });
            setAvatarUrl(user.avatar_url || null);
        }
    }, [user, isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                location: formData.location,
                bio: formData.bio,
                age: formData.age ? parseInt(formData.age, 10) : null,
                activity_type: formData.activity_type,
                preferred_time: formData.preferred_time,
                pace: formData.pace,
                interests: formData.interests,
                email_notifications: formData.email_notifications,
                push_notifications: formData.push_notifications,
            });
            await refreshProfile();
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteAccount();
            toast.success("Account deleted successfully.");
            logout();
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete account");
            setIsDeleting(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB.");
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const url = await uploadAvatar(file);
            setAvatarUrl(url);
            await refreshProfile();
            toast.success("Profile picture updated!");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload avatar");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        try {
            await updateProfile({ avatar_url: null });
            setAvatarUrl(null);
            await refreshProfile();
            toast.success("Profile picture removed.");
        } catch (error: any) {
            toast.error(error.message || "Failed to remove avatar");
        }
    };

    const addInterest = (interest: string) => {
        const trimmed = interest.trim();
        if (trimmed && !formData.interests.includes(trimmed)) {
            setFormData({ ...formData, interests: [...formData.interests, trimmed] });
        }
        setNewInterest("");
    };

    const removeInterest = (interest: string) => {
        setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    };

    const availableSuggestions = INTEREST_SUGGESTIONS.filter(
        s => !formData.interests.includes(s) &&
            s.toLowerCase().includes(newInterest.toLowerCase())
    );

    return (
        <Layout>
            <div className="container-app py-24 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div>
                        {isNewUser && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-2xl"
                            >
                                <h2 className="text-xl font-bold mb-2">🎉 Welcome to OwtGo!</h2>
                                <p className="text-muted-foreground">
                                    Take a moment to complete your profile. Adding your interests, location, and a photo helps others find you for activities and events.
                                </p>
                            </motion.div>
                        )}
                        <h1 className="text-3xl font-bold">{isNewUser ? "Complete Your Profile" : "Profile Settings"}</h1>
                        <p className="text-muted-foreground mt-2">
                            {isNewUser
                                ? "Fill in your details to get the best experience on OwtGo."
                                : "Manage your personal information, activity preferences, and visibility."
                            }
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Avatar Upload */}
                        <div className="card-elevated p-6 flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-background shadow-lg overflow-hidden bg-muted flex items-center justify-center">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        <span className="text-4xl font-bold text-primary">
                                            {(formData.name || "U").charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <Camera className="h-5 w-5" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm text-muted-foreground">
                                    {isUploadingAvatar ? "Uploading..." : "Click the camera icon to change your photo"}
                                </p>
                                {avatarUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="text-sm text-destructive hover:underline flex items-center gap-1"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Remove photo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="card-elevated p-6 space-y-6">
                            <h2 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Personal Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        disabled
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            className="pl-10"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        min="13"
                                        max="120"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="Your age"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <LocationInput
                                        value={formData.location}
                                        onChange={(val: string) => setFormData({ ...formData, location: val })}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell others a bit about your fitness journey and goals..."
                                        className="min-h-[100px]"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {formData.bio.length}/300 characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="card-elevated p-6 space-y-6">
                            <h2 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
                                <Heart className="h-5 w-5 text-primary" />
                                Interests
                            </h2>

                            {formData.interests.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.interests.map((interest) => (
                                        <Badge key={interest} variant="secondary" className="gap-1 pr-1 text-sm">
                                            {interest}
                                            <button
                                                type="button"
                                                onClick={() => removeInterest(interest)}
                                                className="ml-1 hover:bg-muted rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add an interest..."
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addInterest(newInterest);
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => addInterest(newInterest)}
                                    disabled={!newInterest.trim()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {availableSuggestions.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSuggestions.slice(0, 10).map((s) => (
                                            <button
                                                type="button"
                                                key={s}
                                                onClick={() => addInterest(s)}
                                                className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-primary/10 hover:border-primary/30 transition-colors"
                                            >
                                                + {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Preferences */}
                        <div className="card-elevated p-6 space-y-6">
                            <h2 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Activity Preferences
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" /> Activity Type
                                    </Label>
                                    <Select
                                        value={formData.activity_type}
                                        onValueChange={(val) => setFormData({ ...formData, activity_type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="walking">Walking</SelectItem>
                                            <SelectItem value="jogging">Jogging</SelectItem>
                                            <SelectItem value="hiking">Hiking</SelectItem>
                                            <SelectItem value="fitness">Fitness</SelectItem>
                                            <SelectItem value="yoga">Yoga</SelectItem>
                                            <SelectItem value="swimming">Swimming</SelectItem>
                                            <SelectItem value="cycling">Cycling</SelectItem>
                                            <SelectItem value="camping">Camping</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Zap className="h-4 w-4" /> Preferred Pace
                                    </Label>
                                    <Select
                                        value={formData.pace}
                                        onValueChange={(val) => setFormData({ ...formData, pace: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select pace" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="leisurely">Leisurely</SelectItem>
                                            <SelectItem value="moderate">Moderate</SelectItem>
                                            <SelectItem value="fast">Fast</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> Preferred Time
                                    </Label>
                                    <Select
                                        value={formData.preferred_time}
                                        onValueChange={(val) => setFormData({ ...formData, preferred_time: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Morning</SelectItem>
                                            <SelectItem value="afternoon">Afternoon</SelectItem>
                                            <SelectItem value="evening">Evening</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="card-elevated p-6 space-y-6">
                            <h2 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Notification Settings
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive updates about events, pairings, and news via email.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.email_notifications}
                                        onCheckedChange={(val) => setFormData({ ...formData, email_notifications: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified instantly when someone joins your event or requests to pair.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.push_notifications}
                                        onCheckedChange={(val) => setFormData({ ...formData, push_notifications: val })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center gap-4 border-t pt-6 mt-6">
                            <Button type="button" variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white">
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </Button>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
};

export default ProfileSettings;

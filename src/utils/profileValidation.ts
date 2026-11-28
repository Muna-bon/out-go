/**
 * Profile validation utility to check whether a user has filled out
 * all required profile fields to unlock key OutGo features.
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfileData {
  name?: string;
  full_name?: string;
  location?: string;
  bio?: string;
  interests?: string[];
  availability?: string[];
}

export const isProfileComplete = (profile: UserProfileData | null | undefined): boolean => {
  if (!profile) return false;

  const name = (profile.full_name || profile.name || "").trim();
  const location = (profile.location || "").trim();
  const bio = (profile.bio || "").trim();
  const hasInterests = Array.isArray(profile.interests) && profile.interests.length > 0;
  const hasAvailability = Array.isArray(profile.availability) && profile.availability.length > 0;

  // Location must not be a generic placeholder
  const isRealLocation =
    location.length > 0 &&
    location !== "Location not set" &&
    location !== "Detecting location...";

  return Boolean(name && isRealLocation && bio && hasInterests && hasAvailability);
};

export const getProfileMissingFields = (profile: UserProfileData | null | undefined): string[] => {
  const missing: string[] = [];
  if (!profile) return ["Name", "Location", "Bio", "Interests", "Workout Times"];

  const name = (profile.full_name || profile.name || "").trim();
  const location = (profile.location || "").trim();
  const bio = (profile.bio || "").trim();
  const hasInterests = Array.isArray(profile.interests) && profile.interests.length > 0;
  const hasAvailability = Array.isArray(profile.availability) && profile.availability.length > 0;

  if (!name) missing.push("Display Name");
  if (!location || location === "Location not set" || location === "Detecting location...") {
    missing.push("City / Location");
  }
  if (!bio) missing.push("Short Bio");
  if (!hasInterests) missing.push("Activity Interests");
  if (!hasAvailability) missing.push("Workout Schedule");

  return missing;
};

/**
 * Gets cached profile from localStorage or fallback
 */
export const getCachedUserProfile = (): UserProfileData | null => {
  try {
    const cached = localStorage.getItem("outgo_user_profile");
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn("Could not read cached profile:", err);
  }
  return null;
};

/**
 * Dispatches a global event to open the Profile Completion Modal anywhere in the app.
 */
export const openProfileCompletionModal = (reason?: string) => {
  window.dispatchEvent(
    new CustomEvent("outgo-open-profile-completion", {
      detail: { reason: reason || "Please complete your profile to unlock this feature." },
    })
  );
};

/**
 * Validates whether the user can perform a key action.
 * If not authenticated or profile is incomplete, alerts the user and opens the modal.
 */
export const requireCompleteProfile = async (
  actionDescription: string,
  onComplete: () => void
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Check localStorage cache first
    let profile = getCachedUserProfile();

    if (user) {
      const meta = user.user_metadata || {};
      profile = {
        name: meta.full_name || meta.name || profile?.name || "",
        full_name: meta.full_name || meta.name || profile?.full_name || "",
        location: meta.location || profile?.location || "",
        bio: meta.bio || profile?.bio || "",
        interests: meta.interests || profile?.interests || [],
        availability: meta.availability || profile?.availability || [],
      };
    }

    if (!user && !profile) {
      toast.error("Sign in required", {
        description: `Please sign in and complete your profile to ${actionDescription}.`,
      });
      return false;
    }

    if (!isProfileComplete(profile)) {
      const missing = getProfileMissingFields(profile);
      toast.warning("Profile completion required", {
        description: `Please finish setting up your ${missing.slice(0, 2).join(" & ")} before you ${actionDescription}.`,
        duration: 5000,
      });
      openProfileCompletionModal(`Profile completion is required to ${actionDescription}.`);
      return false;
    }

    onComplete();
    return true;
  } catch (err) {
    console.warn("Profile check error:", err);
    // Allow action if check fails unexpectedly
    onComplete();
    return true;
  }
};

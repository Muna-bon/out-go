import campingImg from "@/assets/activity-camping.jpg";
import gymImg from "@/assets/activity-gym.jpg";
import runningImg from "@/assets/activity-running.jpg";
import yogaImg from "@/assets/activity-yoga.jpg";
import hikingImg from "@/assets/hero-hiking.jpg";

const categoryImageMap: Record<string, string> = {
    "walking & jogging": runningImg,
    "fitness & workouts": gymImg,
    "hiking & camping": hikingImg,
    "sightseeing & leisure": campingImg,
    "wellness programs": yogaImg,
    "gym programs": gymImg,
    "group exercises": gymImg,
    // Fallback keywords
    walking: runningImg,
    jogging: runningImg,
    running: runningImg,
    hiking: hikingImg,
    camping: campingImg,
    yoga: yogaImg,
    fitness: gymImg,
    gym: gymImg,
    wellness: yogaImg,
};

/**
 * Returns a placeholder image URL based on the event category.
 * Falls back to a gradient-based approach if no match is found.
 */
export const getEventPlaceholderImage = (category?: string | null): string => {
    if (!category) return runningImg;

    const lower = category.toLowerCase();

    // Exact match first
    if (categoryImageMap[lower]) {
        return categoryImageMap[lower];
    }

    // Partial match
    for (const [key, img] of Object.entries(categoryImageMap)) {
        if (lower.includes(key) || key.includes(lower)) {
            return img;
        }
    }

    return runningImg; // Default fallback
};

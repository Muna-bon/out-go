import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: string;
  coordinates: Coordinates | null;
  isLocating: boolean;
  detectLocation: (silent?: boolean) => Promise<string | null>;
  setLocation: (loc: string) => void;
  lastCity: string | null;
}

const STORAGE_KEY = "outgo_user_location";
const LAST_CITY_KEY = "outgo_last_detected_city";
const DEFAULT_LOCATION = "Detecting location...";

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Helper to reverse geocode lat/lng to a friendly "City, State/Country"
async function reverseGeocode(lat?: number, lng?: number): Promise<string> {
  try {
    // Primary: BigDataCloud free client reverse geocoding (fast, no rate limits, no API key)
    // If lat & lng are omitted, BigDataCloud automatically uses client IP to return their TRUE current location!
    const query = lat !== undefined && lng !== undefined ? `latitude=${lat}&longitude=${lng}&` : "";
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?${query}localityLanguage=en`;
    const res = await fetch(bdcUrl);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const state = data.principalSubdivisionCode || data.principalSubdivision || data.countryName;
      if (city) {
        return state && state !== city ? `${city}, ${state}` : city;
      }
    }
  } catch (e) {
    console.warn("BigDataCloud reverse geocode failed, trying fallback:", e);
  }

  if (lat !== undefined && lng !== undefined) {
    try {
      // Fallback: OpenStreetMap Nominatim
      const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(osmUrl, {
        headers: { "Accept-Language": "en" },
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county;
        const state = addr.state || addr.country;
        if (city) {
          return state ? `${city}, ${state}` : city;
        }
      }
    } catch (e) {
      console.warn("OSM reverse geocode failed:", e);
    }
  }

  return "Current Location";
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LOCATION;
  });
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [lastCity, setLastCity] = useState<string | null>(() => {
    return localStorage.getItem(LAST_CITY_KEY);
  });

  const setLocation = useCallback((newLoc: string) => {
    const trimmed = newLoc.trim();
    if (!trimmed) return;
    setLocationState(trimmed);
    localStorage.setItem(STORAGE_KEY, trimmed);
    toast.success(`Location set to ${trimmed}`, {
      description: "Activities and partners near you will be displayed.",
    });
  }, []);

  const detectLocation = useCallback(
    async (silent: boolean = false): Promise<string | null> => {
      if (!("geolocation" in navigator)) {
        if (!silent) toast.error("Geolocation is not supported by your browser.");
        return null;
      }

      setIsLocating(true);

      return new Promise<string | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setCoordinates({ latitude, longitude });

            try {
              const detectedLoc = await reverseGeocode(latitude, longitude);
              const prevCity = localStorage.getItem(LAST_CITY_KEY);

              // Check if city changed
              if (prevCity && prevCity.toLowerCase() !== detectedLoc.toLowerCase()) {
                toast.info("📍 New City Detected!", {
                  description: `You've moved to ${detectedLoc}. Your activity feed and suggestions have been updated.`,
                  duration: 6000,
                });
              } else if (!silent) {
                toast.success("Location Detected!", {
                  description: `Showing activities in ${detectedLoc}`,
                });
              }

              setLocationState(detectedLoc);
              setLastCity(detectedLoc);
              localStorage.setItem(STORAGE_KEY, detectedLoc);
              localStorage.setItem(LAST_CITY_KEY, detectedLoc);
              setIsLocating(false);
              resolve(detectedLoc);
            } catch (err) {
              if (!silent) toast.error("Could not determine your city name.");
              setIsLocating(false);
              resolve(null);
            }
          },
          (err) => {
            if (!silent) {
              if (err.code === 1) {
                toast.error("Location permission denied", {
                  description: "Please allow location access in your browser or type your city manually.",
                });
              } else {
                toast.error("Could not fetch location. Please enter manually.");
              }
            }
            setIsLocating(false);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      });
    },
    []
  );

  // Auto-detect user's true location on startup and check for city changes
  useEffect(() => {
    let isMounted = true;

    const initTrueLocation = async () => {
      try {
        const savedLocation = localStorage.getItem(STORAGE_KEY);
        const prevCity = localStorage.getItem(LAST_CITY_KEY);

        // Fetch real city from IP automatically (no permission needed)
        const trueCity = await reverseGeocode();
        if (isMounted && trueCity && trueCity !== "Current Location") {
          // Check if user moved outside their previous city
          if (prevCity && prevCity.toLowerCase() !== trueCity.toLowerCase()) {
            toast.info("📍 New City Detected!", {
              description: `You've moved to ${trueCity}. Your activity feed and suggestions have been updated.`,
              duration: 6000,
            });
            setLocationState(trueCity);
            setLastCity(trueCity);
            localStorage.setItem(STORAGE_KEY, trueCity);
            localStorage.setItem(LAST_CITY_KEY, trueCity);
          } else if (!savedLocation || savedLocation === "Detecting location..." || savedLocation === "New York, NY") {
            setLocationState(trueCity);
            setLastCity(trueCity);
            localStorage.setItem(STORAGE_KEY, trueCity);
            localStorage.setItem(LAST_CITY_KEY, trueCity);
          }
        }
      } catch (err) {
        console.warn("Startup location check failed:", err);
      }

      // Check if GPS permission is granted for high-precision coordinates
      if ("permissions" in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          if (permissionStatus.state === "granted") {
            detectLocation(true);
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") {
              detectLocation(false);
            }
          };
        } catch (e) {
          // Permissions API unsupported/blocked
        }
      }
    };

    initTrueLocation();

    return () => {
      isMounted = false;
    };
  }, [detectLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        coordinates,
        isLocating,
        detectLocation,
        setLocation,
        lastCity,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useUserLocation must be used within a LocationProvider");
  }
  return context;
};

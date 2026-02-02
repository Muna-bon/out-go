import { useState, useEffect } from "react";
import { MapPin, Navigation, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const popularLocations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "San Francisco, CA",
  "Miami, FL",
  "Seattle, WA",
];

const LocationPicker = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Simulate reverse geocoding
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLocation("Current Location");
            toast.success("Location detected!", {
              description: "Showing activities near you",
            });
          } catch {
            toast.error("Could not determine your location");
          } finally {
            setIsLocating(false);
            setOpen(false);
          }
        },
        (error) => {
          toast.error("Location access denied", {
            description: "Please enable location services or enter manually",
          });
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Geolocation not supported");
      setIsLocating(false);
    }
  };

  const handleSelectLocation = (loc: string) => {
    setLocation(loc);
    toast.success(`Location set to ${loc}`);
    setOpen(false);
  };

  const filteredLocations = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`text-muted-foreground ${location ? "text-primary" : ""}`}
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold mb-3">Your Location</h3>
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />
          <Button
            variant="outline"
            className="w-full gap-2 justify-start"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            <Navigation className="h-4 w-4" />
            {isLocating ? "Detecting..." : "Use Current Location"}
          </Button>
        </div>

        <div className="p-2 max-h-[250px] overflow-y-auto">
          <p className="text-xs text-muted-foreground px-2 py-1">
            Popular Locations
          </p>
          {filteredLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelectLocation(loc)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <span className="text-sm">{loc}</span>
              {location === loc && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
          {filteredLocations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No locations found
            </p>
          )}
        </div>

        {location && (
          <div className="p-2 border-t border-border">
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{location}</span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default LocationPicker;

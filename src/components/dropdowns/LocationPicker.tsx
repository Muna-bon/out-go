import { useState } from "react";
import { MapPin, Navigation, Check, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserLocation } from "@/context/LocationContext";

const popularLocations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "San Francisco, CA",
  "Miami, FL",
  "Seattle, WA",
  "Austin, TX",
  "London, UK",
  "Toronto, Canada",
];

const LocationPicker = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { location, isLocating, detectLocation, setLocation } = useUserLocation();

  const handleUseCurrentLocation = async () => {
    await detectLocation(false);
    setOpen(false);
  };

  const handleSelectLocation = (loc: string) => {
    setLocation(loc);
    setOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(searchQuery.trim());
      setSearchQuery("");
      setOpen(false);
    }
  };

  const filteredLocations = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground text-xs font-medium px-2.5 h-9 rounded-xl border border-border/50 hover:bg-muted/60"
        >
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="hidden md:inline truncate max-w-[120px]">
            {location || "Select Location"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-xl border-border/80" align="end">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Your Location</h3>
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Auto-detects on move
            </span>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <Input
              placeholder="Search or enter city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
            {searchQuery.trim() && (
              <Button type="submit" size="sm" className="h-9 text-xs shrink-0">
                Set
              </Button>
            )}
          </form>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 justify-start h-9 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-medium"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Navigation className="h-3.5 w-3.5 text-primary" />
            )}
            {isLocating ? "Detecting GPS location..." : "Auto-Detect Current Location"}
          </Button>
        </div>

        <div className="p-2 max-h-[220px] overflow-y-auto">
          <p className="text-[11px] text-muted-foreground px-2 py-1 uppercase tracking-wider font-semibold">
            Popular Cities
          </p>
          {filteredLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleSelectLocation(loc)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <span className="text-xs">{loc}</span>
              {location === loc && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
          {filteredLocations.length === 0 && (
            <div className="text-center py-4 px-2">
              <p className="text-xs text-muted-foreground">Press enter or 'Set' to use "{searchQuery}"</p>
            </div>
          )}
        </div>

        {location && (
          <div className="p-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Active city:</span>
              <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                {location}
              </span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default LocationPicker;

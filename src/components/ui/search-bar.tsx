import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserLocation } from "@/context/LocationContext";

interface SearchBarProps {
  variant?: "default" | "hero";
  onSearch?: (query: string, location: string, date: string) => void;
}

const SearchBar = ({ variant = "default", onSearch }: SearchBarProps) => {
  const isHero = variant === "hero";
  const navigate = useNavigate();
  const { location: detectedLocation, isLocating, detectLocation } = useUserLocation();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(detectedLocation || "");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (detectedLocation && !location) {
      setLocation(detectedLocation);
    }
  }, [detectedLocation]);

  const handleDetectGPS = async () => {
    const loc = await detectLocation(false);
    if (loc) {
      setLocation(loc);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, location, date);
      return;
    }
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    navigate(`/discover?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${
        isHero
          ? "bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-elevated"
          : "bg-card p-3 rounded-xl shadow-card"
      }`}
    >
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search activities, events, or gyms..."
          className="pl-10 border-0 bg-muted/50 h-12 rounded-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 sm:flex-initial">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="City or location"
            className="pl-9 pr-9 border-0 bg-muted/50 h-12 rounded-xl sm:w-44"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            title="Auto-detect current location"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLocating ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
        <div className="relative flex-1 sm:flex-initial">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="date"
            className="pl-10 border-0 bg-muted/50 h-12 rounded-xl sm:w-36"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button size="lg" className={isHero ? "h-12 px-8" : "h-12"} onClick={handleSearch}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

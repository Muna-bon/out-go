import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  variant?: "default" | "hero";
  onSearch?: (query: string, location: string, date: string) => void;
}

const recentSearches = [
  "Yoga classes near me",
  "Morning running groups",
  "Weekend hiking",
  "HIIT workouts",
];

const popularCategories = [
  { name: "Walking & Jogging", count: 248 },
  { name: "Fitness & Workouts", count: 186 },
  { name: "Hiking", count: 124 },
  { name: "Yoga & Wellness", count: 156 },
];

const SearchBar = ({ variant = "default", onSearch }: SearchBarProps) => {
  const isHero = variant === "hero";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (overrideQuery?: string) => {
    const finalQuery = overrideQuery !== undefined ? overrideQuery : query;
    if (onSearch) {
      onSearch(finalQuery, location, date);
      setShowSuggestions(false);
      return;
    }
    const params = new URLSearchParams();
    if (finalQuery) params.set("q", finalQuery);
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    setShowSuggestions(false);
    navigate(`/discover?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryClick = (category: string) => {
    setShowSuggestions(false);
    navigate(`/discover?category=${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchContainerRef}
      className={`relative flex flex-col sm:flex-row gap-3 ${isHero
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
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                        className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-xs transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2">
                  Popular Categories
                </h3>
                <div className="space-y-1">
                  {popularCategories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group text-left"
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs">{category.count} activities</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 relative z-10">
        <div className="relative flex-1 sm:flex-initial">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            placeholder="Location"
            className="pl-10 border-0 bg-muted/50 h-12 rounded-xl sm:w-40 relative z-20"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="relative flex-1 sm:flex-initial">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="date"
            className="pl-10 border-0 bg-muted/50 h-12 rounded-xl sm:w-36 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full relative z-20 cursor-pointer"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
          />
        </div>
        <Button size="lg" className={isHero ? "h-12 px-8 z-20 relative" : "h-12 z-20 relative"} onClick={() => handleSearch()}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

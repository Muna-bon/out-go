import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    if (date) params.set("date", date);

    navigate(`/discover?${params.toString()}`);
    onOpenChange(false);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/discover?category=${encodeURIComponent(category)}`);
    onOpenChange(false);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && open) {
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, query, location, date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search activities, events, or gyms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9 h-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full relative z-20 cursor-pointer"
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
              />
            </div>
            <Button onClick={handleSearch} className="h-10 px-6">
              Search
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentSearch(search)}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Popular Categories
            </h3>
            <div className="space-y-2">
              {popularCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group"
                >
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">{category.count} activities</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

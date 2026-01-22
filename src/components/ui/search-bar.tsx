import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  variant?: "default" | "hero";
  onSearch?: (query: string) => void;
}

const SearchBar = ({ variant = "default", onSearch }: SearchBarProps) => {
  const isHero = variant === "hero";

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
        />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 sm:flex-initial">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Location"
            className="pl-10 border-0 bg-muted/50 h-12 rounded-xl sm:w-40"
          />
        </div>
        <div className="relative flex-1 sm:flex-initial">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Date"
            className="pl-10 border-0 bg-muted/50 h-12 rounded-xl sm:w-36"
          />
        </div>
        <Button size="lg" className={isHero ? "h-12 px-8" : "h-12"}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

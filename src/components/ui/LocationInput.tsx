import { useState, useRef, useEffect } from "react";
import { Navigation, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const popularLocations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "San Francisco, CA",
    "Miami, FL",
    "Seattle, WA",
    "Austin, TX",
    "Denver, CO",
];

export const LocationInput = ({ value, onChange, placeholder = "City, State", icon = true, className = "" }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUseCurrentLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async () => {
                    try {
                        await new Promise((resolve) => setTimeout(resolve, 800));
                        onChange("Current Location");
                        toast.success("Location detected!");
                    } finally {
                        setIsLocating(false);
                        setIsOpen(false);
                    }
                },
                () => {
                    toast.error("Location access denied");
                    setIsLocating(false);
                }
            );
        } else {
            toast.error("Geolocation not supported");
            setIsLocating(false);
        }
    };

    const filteredLocations = popularLocations.filter(loc => loc.toLowerCase().includes((value || "").toLowerCase()) && loc !== value);

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {icon && <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />}
            <Input
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className={icon ? "pl-10 relative" : "relative"}
            />
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border shadow-lg rounded-md max-h-60 overflow-y-auto">
                    <div
                        className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center gap-2 border-b text-sm font-medium text-primary"
                        onClick={handleUseCurrentLocation}
                    >
                        <Navigation className="h-4 w-4" />
                        {isLocating ? "Detecting..." : "Use Current Location"}
                    </div>
                    {filteredLocations.map(loc => (
                        <div
                            key={loc}
                            className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center gap-2 text-sm"
                            onClick={() => {
                                onChange(loc);
                                setIsOpen(false);
                            }}
                        >
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {loc}
                        </div>
                    ))}
                    {filteredLocations.length === 0 && (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                            No matching popular locations...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

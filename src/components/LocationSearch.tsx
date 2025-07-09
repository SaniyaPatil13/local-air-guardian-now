
import { useState } from "react";
import { Search, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LocationSearchProps {
  onLocationChange: (location: string) => void;
}

const indianCities = [
  "Delhi, India",
  "Mumbai, Maharashtra", 
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Kanpur, Uttar Pradesh",
  "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh",
  "Bhopal, Madhya Pradesh",
  "Patna, Bihar",
  "Gurgaon, Haryana",
  "Noida, Uttar Pradesh",
  "Faridabad, Haryana",
  "Ghaziabad, Uttar Pradesh",
  "Agra, Uttar Pradesh",
  "Varanasi, Uttar Pradesh",
  "Meerut, Uttar Pradesh",
  "Rajkot, Gujarat",
  "Kalyan-Dombivli, Maharashtra",
  "Vasai-Virar, Maharashtra",
  "Vijayawada, Andhra Pradesh",
  "Jodhpur, Rajasthan",
  "Madurai, Tamil Nadu",
  "Raipur, Chhattisgarh",
  "Kota, Rajasthan"
];

export const LocationSearch = ({ onLocationChange }: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = indianCities.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setIsExpanded(true);
    } else {
      setFilteredLocations([]);
      setIsExpanded(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSearchTerm(location);
    setIsExpanded(false);
    onLocationChange(location);
    console.log(`Location selected: ${location}`);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode these coordinates to Indian location
          console.log(`Current location: ${latitude}, ${longitude}`);
          // For demo, we'll default to Delhi
          const currentLocation = "Delhi, India";
          handleLocationSelect(currentLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to Delhi
          handleLocationSelect("Delhi, India");
        }
      );
    } else {
      console.log("Geolocation not supported");
      handleLocationSelect("Delhi, India");
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow for clicks
    setTimeout(() => setIsExpanded(false), 200);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search Indian cities..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchTerm.length === 0 && setIsExpanded(true)}
            onBlur={handleBlur}
            className="pl-10 w-64"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCurrentLocation}
          className="flex items-center space-x-1"
        >
          <Navigation className="h-4 w-4" />
          <span className="hidden sm:inline">Current</span>
        </Button>
      </div>

      {isExpanded && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto bg-white border shadow-lg">
          <div className="p-2">
            {filteredLocations.length > 0 ? (
              <>
                <div className="text-xs text-gray-500 mb-2 px-2">Search Results</div>
                {filteredLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{location}</span>
                  </button>
                ))}
              </>
            ) : searchTerm.length === 0 ? (
              <>
                <div className="text-xs text-gray-500 mb-2 px-2">Major Indian Cities</div>
                {indianCities.slice(0, 8).map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{location}</span>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No Indian cities found for "{searchTerm}"
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

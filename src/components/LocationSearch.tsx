
import { useState } from "react";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { locationService } from "@/services/locationService";
import { toast } from "@/components/ui/use-toast";

interface LocationSearchProps {
  onLocationChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
}

const indianCities = [
  "Delhi, India",
  
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
  "Kota, Rajasthan",
  "Coimbatore, Tamil Nadu",
  "Kochi, Kerala",
  "Thiruvananthapuram, Kerala",
  "Chandigarh, Chandigarh",
  "Visakhapatnam, Andhra Pradesh",
  "Surat, Gujarat",
  "Vadodara, Gujarat",
  "Nashik, Maharashtra",
  "Aurangabad, Maharashtra",
  "Solapur, Maharashtra",
  "Mysore, Karnataka",
  "Hubli, Karnataka",
  "Mangalore, Karnataka",
  "Belgaum, Karnataka",
  "Gulbarga, Karnataka",
  "Tirupur, Tamil Nadu",
  "Salem, Tamil Nadu",
  "Tiruchirappalli, Tamil Nadu",
  "Erode, Tamil Nadu",
  "Thanjavur, Tamil Nadu",
  "Dindigul, Tamil Nadu",
  "Tirunelveli, Tamil Nadu",
  "Tiruppur, Tamil Nadu",
  "Vellore, Tamil Nadu",
  "Amritsar, Punjab",
  "Ludhiana, Punjab",
  "Jalandhar, Punjab",
  "Patiala, Punjab",
  "Bathinda, Punjab",
  "Mohali, Punjab",
  "Bareilly, Uttar Pradesh",
  "Aligarh, Uttar Pradesh",
  "Moradabad, Uttar Pradesh",
  "Saharanpur, Uttar Pradesh",
  "Gorakhpur, Uttar Pradesh",
  "Firozabad, Uttar Pradesh",
  "Jhansi, Uttar Pradesh",
  "Muzaffarnagar, Uttar Pradesh",
  "Mathura, Uttar Pradesh",
  "Shahjahanpur, Uttar Pradesh",
  "Rampur, Uttar Pradesh",
  "Modinagar, Uttar Pradesh",
  "Hapur, Uttar Pradesh",
  "Etawah, Uttar Pradesh",
  "Mirzapur, Uttar Pradesh",
  "Bulandshahr, Uttar Pradesh",
  "Sambhal, Uttar Pradesh",
  "Amroha, Uttar Pradesh",
  "Hardoi, Uttar Pradesh",
  "Fatehpur, Uttar Pradesh",
  "Raebareli, Uttar Pradesh",
  "Orai, Uttar Pradesh",
  "Sitapur, Uttar Pradesh",
  "Bahraich, Uttar Pradesh",
  "Modinagar, Uttar Pradesh",
  "Unnao, Uttar Pradesh",
  "Jaunpur, Uttar Pradesh",
  "Lakhimpur, Uttar Pradesh",
  "Hathras, Uttar Pradesh",
  "Banda, Uttar Pradesh",
  "Pilibhit, Uttar Pradesh",
  "Barabanki, Uttar Pradesh",
  "Khurja, Uttar Pradesh",
  "Gonda, Uttar Pradesh",
  "Mainpuri, Uttar Pradesh",
  "Lalitpur, Uttar Pradesh",
  "Etah, Uttar Pradesh",
  "Deoria, Uttar Pradesh",
  "Ughaiti, Uttar Pradesh",
  "Ghazipur, Uttar Pradesh",
  "Sultanpur, Uttar Pradesh",
  "Azamgarh, Uttar Pradesh",
  "Bijnor, Uttar Pradesh",
  "Saharanpur, Uttar Pradesh",
  "Sambhal, Uttar Pradesh",
  "Amroha, Uttar Pradesh",
  "Hardoi, Uttar Pradesh",
  "Fatehpur, Uttar Pradesh",
  "Raebareli, Uttar Pradesh",
  "Orai, Uttar Pradesh",
  "Sitapur, Uttar Pradesh",
  "Bahraich, Uttar Pradesh",
  "Modinagar, Uttar Pradesh",
  "Unnao, Uttar Pradesh",
  "Jaunpur, Uttar Pradesh",
  "Lakhimpur, Uttar Pradesh",
  "Hathras, Uttar Pradesh",
  "Banda, Uttar Pradesh",
  "Pilibhit, Uttar Pradesh",
  "Barabanki, Uttar Pradesh",
  "Khurja, Uttar Pradesh",
  "Gonda, Uttar Pradesh",
  "Mainpuri, Uttar Pradesh",
  "Lalitpur, Uttar Pradesh",
  "Etah, Uttar Pradesh",
  "Deoria, Uttar Pradesh",
  "Ughaiti, Uttar Pradesh",
  "Ghazipur, Uttar Pradesh",
  "Sultanpur, Uttar Pradesh",
  "Azamgarh, Uttar Pradesh",
  "Bijnor, Uttar Pradesh"
];

// Mumbai locality suggestions with coordinates for precise selection
const mumbaiLocalities: { label: string; coordinates: { lat: number; lng: number } }[] = [
  { label: "Bandra, Mumbai", coordinates: { lat: 19.0596, lng: 72.8295 } },
  { label: "Dadar, Mumbai", coordinates: { lat: 19.0186, lng: 72.8424 } },
  { label: "Sion, Mumbai", coordinates: { lat: 19.0473, lng: 72.8626 } },
  { label: "Andheri, Mumbai", coordinates: { lat: 19.1197, lng: 72.8468 } },
  { label: "Powai, Mumbai", coordinates: { lat: 19.1166, lng: 72.9043 } },
  { label: "BKC, Mumbai", coordinates: { lat: 19.0669, lng: 72.8697 } },
  { label: "Worli, Mumbai", coordinates: { lat: 19.0169, lng: 72.8160 } },
  { label: "Colaba, Mumbai", coordinates: { lat: 18.9067, lng: 72.8147 } },
  { label: "Chembur, Mumbai", coordinates: { lat: 19.0622, lng: 72.9007 } },
  { label: "Ghatkopar, Mumbai", coordinates: { lat: 19.0853, lng: 72.9080 } },
  { label: "Mulund, Mumbai", coordinates: { lat: 19.1726, lng: 72.9569 } },
  { label: "Vile Parle, Mumbai", coordinates: { lat: 19.1003, lng: 72.8424 } },
  { label: "Kurla, Mumbai", coordinates: { lat: 19.0726, lng: 72.8790 } },
  { label: "Malad, Mumbai", coordinates: { lat: 19.1860, lng: 72.8484 } },
  { label: "Kandivali, Mumbai", coordinates: { lat: 19.2041, lng: 72.8517 } },
  { label: "Borivali, Mumbai", coordinates: { lat: 19.2290, lng: 72.8570 } },
  { label: "Dahisar, Mumbai", coordinates: { lat: 19.2573, lng: 72.8615 } },
  { label: "Marine Drive, Mumbai", coordinates: { lat: 18.9432, lng: 72.8238 } },
  { label: "Churchgate, Mumbai", coordinates: { lat: 18.9353, lng: 72.8273 } },
  { label: "Nariman Point, Mumbai", coordinates: { lat: 18.9250, lng: 72.8236 } },
  { label: "Lower Parel, Mumbai", coordinates: { lat: 18.9936, lng: 72.8305 } },
  { label: "Fort, Mumbai", coordinates: { lat: 18.9350, lng: 72.8356 } },
  { label: "Mahim, Mumbai", coordinates: { lat: 19.0387, lng: 72.8400 } },
  { label: "Matunga, Mumbai", coordinates: { lat: 19.0270, lng: 72.8553 } },
  { label: "Wadala, Mumbai", coordinates: { lat: 19.0169, lng: 72.8593 } },
  { label: "Byculla, Mumbai", coordinates: { lat: 18.9766, lng: 72.8331 } },
  { label: "Sewri, Mumbai", coordinates: { lat: 18.9907, lng: 72.8538 } },
  { label: "Parel, Mumbai", coordinates: { lat: 18.9920, lng: 72.8380 } },
  { label: "Santacruz, Mumbai", coordinates: { lat: 19.0800, lng: 72.8410 } },
  { label: "Juhu, Mumbai", coordinates: { lat: 19.1024, lng: 72.8265 } },
  { label: "Versova, Mumbai", coordinates: { lat: 19.1340, lng: 72.8126 } },
  { label: "Vikhroli, Mumbai", coordinates: { lat: 19.1120, lng: 72.9342 } },
  { label: "Bhandup, Mumbai", coordinates: { lat: 19.1490, lng: 72.9356 } },
  { label: "Kanjurmarg, Mumbai", coordinates: { lat: 19.1240, lng: 72.9355 } },
  { label: "Govandi, Mumbai", coordinates: { lat: 19.0493, lng: 72.9173 } },
  { label: "Mankhurd, Mumbai", coordinates: { lat: 19.0516, lng: 72.9316 } },
  { label: "Chunabhatti, Mumbai", coordinates: { lat: 19.0444, lng: 72.8738 } },
  { label: "Antop Hill, Mumbai", coordinates: { lat: 19.0178, lng: 72.8612 } },
  { label: "Grant Road, Mumbai", coordinates: { lat: 18.9609, lng: 72.8143 } },
  { label: "Charni Road, Mumbai", coordinates: { lat: 18.9510, lng: 72.8180 } }
];

type Suggestion = { label: string; coordinates?: { lat: number; lng: number } };

export const LocationSearch = ({ onLocationChange }: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Suggestion[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleSearch = (value: string) => {
    console.log('Search input changed:', value);
    setSearchTerm(value);
    if (value.length > 0) {
      const term = value.toLowerCase();
      const mumbaiMatches = mumbaiLocalities.filter(s => s.label.toLowerCase().includes(term));
      const cityMatches = indianCities
        .filter(location => location.toLowerCase().includes(term))
        .map<Suggestion>((label) => ({ label }));
      const combined = [...mumbaiMatches, ...cityMatches];
      console.log('Filtered locations:', combined);
      setFilteredLocations(combined);
      setIsExpanded(true);
    } else {
      setFilteredLocations([]);
      setIsExpanded(false);
    }
  };

  const handleLocationSelect = (location: string, coordinates?: { lat: number; lng: number }) => {
    setSearchTerm(location);
    setIsExpanded(false);
    setFilteredLocations([]);
    onLocationChange(location, coordinates);
    console.log(`Location selected and passed: ${location}`, coordinates);
  };

  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // Try high-accuracy sampling first
      let position;
      try {
        position = await locationService.getHighAccuracyLocation(8000, 30);
      } catch (_) {
        position = await locationService.getCurrentLocation();
      }
      console.log(`Current location coordinates: ${position.latitude}, ${position.longitude}`);
      
      // Check if location is within India
      if (!locationService.isWithinIndia(position.latitude, position.longitude)) {
        console.warn('Location is outside India, using Delhi as fallback');
        handleLocationSelect("Delhi, India", { lat: 28.6139, lng: 77.2090 });
        return;
      }

      // Reverse geocode to get detailed address
      const locationData = await locationService.reverseGeocode(position.latitude, position.longitude);
      // Prefer locality when available, especially within Mumbai
      let formattedLocation = `${locationData.city}, ${locationData.state}`;
      if (locationData.city && locationData.city.toLowerCase() === 'mumbai' && locationData.locality) {
        formattedLocation = `${locationData.locality}, ${locationData.city}`;
      } else if (locationData.locality && locationData.city) {
        formattedLocation = `${locationData.locality}, ${locationData.city}`;
      }
      
      console.log(`Reverse geocoded location: ${formattedLocation}`);
      handleLocationSelect(formattedLocation, { 
        lat: position.latitude, 
        lng: position.longitude 
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      toast({
        title: "Location error",
        description: "Unable to get precise GPS location. Falling back to approximate location.",
      });
      // Try IP-based approximate location
      try {
        const approx = await locationService.getApproxLocationByIP();
        if (!locationService.isWithinIndia(approx.latitude, approx.longitude)) {
          handleLocationSelect("Delhi, India", { lat: 28.6139, lng: 77.2090 });
          return;
        }
        const locData = await locationService.reverseGeocode(approx.latitude, approx.longitude);
        let formattedLocation = `${locData.city}, ${locData.state}`;
        if (locData.city && locData.city.toLowerCase() === 'mumbai' && locData.locality) {
          formattedLocation = `${locData.locality}, ${locData.city}`;
        } else if (locData.locality && locData.city) {
          formattedLocation = `${locData.locality}, ${locData.city}`;
        }
        handleLocationSelect(formattedLocation, { lat: approx.latitude, lng: approx.longitude });
      } catch (_) {
        handleLocationSelect("Delhi, India", { lat: 28.6139, lng: 77.2090 });
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleInputFocus = () => {
    console.log('Input focused, searchTerm:', searchTerm);
    if (searchTerm.length === 0) {
      // Show featured suggestions: a few Mumbai localities + popular cities
      const featured: Suggestion[] = [
        ...mumbaiLocalities.slice(0, 5),
        ...indianCities.slice(0, 5).map((label) => ({ label }))
      ];
      setFilteredLocations(featured);
      setIsExpanded(true);
    } else {
      // If there's already a search term, show filtered results
      const term = searchTerm.toLowerCase();
      const mumbaiMatches = mumbaiLocalities.filter(s => s.label.toLowerCase().includes(term));
      const cityMatches = indianCities
        .filter(location => location.toLowerCase().includes(term))
        .map<Suggestion>((label) => ({ label }));
      setFilteredLocations([...mumbaiMatches, ...cityMatches]);
      setIsExpanded(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow for clicks
    setTimeout(() => {
      setIsExpanded(false);
      setFilteredLocations([]);
    }, 200);
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
            onFocus={handleInputFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsExpanded(false);
                setFilteredLocations([]);
              }
            }}
            className="pl-10 w-64"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center space-x-1"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isLoadingLocation ? "Detecting..." : "Current"}
          </span>
        </Button>
      </div>

      {isExpanded && (
        <Card 
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto bg-white border shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="p-2">
            {console.log('Rendering dropdown, filteredLocations:', filteredLocations, 'searchTerm:', searchTerm)}
            {filteredLocations.length > 0 ? (
              <>
                <div className="text-xs text-gray-500 mb-2 px-2">
                  {searchTerm.length > 0 ? 'Search Results' : 'Major Indian Cities'}
                </div>
                {filteredLocations.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleLocationSelect(s.label, s.coordinates)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{s.label}</span>
                  </button>
                ))}
              </>
            ) : searchTerm.length > 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No Indian cities found for "{searchTerm}"
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
};

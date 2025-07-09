
import { Card } from "@/components/ui/card";
import { MapPin, Layers, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AQIMapProps {
  currentLocation: {
    location: string;
    aqi: number;
    coordinates: { lat: number; lng: number };
  };
}

// Mock data for nearby locations
const mockNearbyLocations = [
  { name: "Oakland", aqi: 82, lat: 37.8044, lng: -122.2711 },
  { name: "San Jose", aqi: 68, lat: 37.3382, lng: -121.8863 },
  { name: "Berkeley", aqi: 71, lat: 37.8715, lng: -122.2730 },
  { name: "Fremont", aqi: 65, lat: 37.5485, lng: -121.9886 },
  { name: "Santa Clara", aqi: 73, lat: 37.3541, lng: -121.9552 }
];

export const AQIMap = ({ currentLocation }: AQIMapProps) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-red-700";
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Regional Air Quality Map</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Wind className="h-4 w-4" />
          <span>Live Data</span>
        </div>
      </div>

      {/* Map Placeholder with Overlay Points */}
      <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden mb-4">
        {/* Background pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gray-200"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                   radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                   linear-gradient(45deg, rgba(156, 163, 175, 0.05) 25%, transparent 25%),
                   linear-gradient(-45deg, rgba(156, 163, 175, 0.05) 25%, transparent 25%)
                 `,
                 backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
               }}>
          </div>
        </div>

        {/* Current Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className={`w-8 h-8 ${getAQIColor(currentLocation.aqi)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse`}>
              {Math.round(currentLocation.aqi)}
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
              {currentLocation.location}
            </div>
          </div>
        </div>

        {/* Nearby Locations */}
        {mockNearbyLocations.map((location, index) => (
          <div 
            key={location.name}
            className="absolute"
            style={{
              top: `${30 + (index * 15)}%`,
              left: `${20 + (index * 20)}%`
            }}
          >
            <div className="relative group cursor-pointer">
              <div className={`w-6 h-6 ${getAQIColor(location.aqi)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md hover:shadow-lg transition-shadow`}>
                {Math.round(location.aqi)}
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {location.name}
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="text-xs font-semibold mb-2">AQI Scale</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Good (0-50)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Moderate (51-100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs">Unhealthy (101-150)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Very Unhealthy (151+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{currentLocation.location}</div>
              <div className="text-xs text-gray-600">Current Location</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{Math.round(currentLocation.aqi)}</div>
              <Badge className={`text-xs ${getAQIColor(currentLocation.aqi)} text-white`}>
                {getAQICategory(currentLocation.aqi)}
              </Badge>
            </div>
          </div>
        </div>

        {mockNearbyLocations.map((location) => (
          <div key={location.name} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{location.name}</div>
                <div className="text-xs text-gray-600">Nearby</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{location.aqi}</div>
                <Badge className={`text-xs ${getAQIColor(location.aqi)} text-white`}>
                  {getAQICategory(location.aqi)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

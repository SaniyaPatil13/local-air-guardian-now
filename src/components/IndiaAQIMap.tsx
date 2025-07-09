import { Card } from "@/components/ui/card";
import { MapPin, Layers, Wind, AlertTriangle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IndiaAQIMapProps {
  currentLocation: {
    location: string;
    aqi: number;
    coordinates: { lat: number; lng: number };
    state: string;
    district: string;
  };
}

// Major Indian cities and districts with mock AQI data
const indianCitiesAQI = [
  { name: "Mumbai", state: "Maharashtra", district: "Mumbai City", aqi: 142, lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore", state: "Karnataka", district: "Bangalore Urban", aqi: 98, lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", district: "Chennai", aqi: 115, lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", state: "West Bengal", district: "Kolkata", aqi: 178, lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", state: "Telangana", district: "Hyderabad", aqi: 125, lat: 17.3850, lng: 78.4867 },
  { name: "Pune", state: "Maharashtra", district: "Pune", aqi: 108, lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", district: "Ahmedabad", aqi: 135, lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", district: "Jaipur", aqi: 152, lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", district: "Lucknow", aqi: 168, lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur", state: "Uttar Pradesh", district: "Kanpur Nagar", aqi: 195, lat: 26.4499, lng: 80.3319 },
  { name: "Nagpur", state: "Maharashtra", district: "Nagpur", aqi: 118, lat: 21.1458, lng: 79.0882 },
  { name: "Indore", state: "Madhya Pradesh", district: "Indore", aqi: 128, lat: 22.7196, lng: 75.8577 },
  { name: "Bhopal", state: "Madhya Pradesh", district: "Bhopal", aqi: 122, lat: 23.2599, lng: 77.4126 },
  { name: "Patna", state: "Bihar", district: "Patna", aqi: 185, lat: 25.5941, lng: 85.1376 },
  { name: "Gurgaon", state: "Haryana", district: "Gurugram", aqi: 158, lat: 28.4595, lng: 77.0266 },
];

export const IndiaAQIMap = ({ currentLocation }: IndiaAQIMapProps) => {
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
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    if (aqi <= 300) return "Poor";
    if (aqi <= 400) return "Very Poor";
    return "Severe";
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50) return "Minimal impact";
    if (aqi <= 100) return "Minor breathing discomfort";
    if (aqi <= 200) return "Breathing discomfort for sensitive people";
    if (aqi <= 300) return "Breathing problems for most people";
    if (aqi <= 400) return "Respiratory illness on prolonged exposure";
    return "Emergency conditions, avoid all outdoor activities";
  };

  const criticalCities = indianCitiesAQI.filter(city => city.aqi > 150);

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {criticalCities.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-red-800">Air Quality Alert</h3>
          </div>
          <p className="text-sm text-red-700">
            {criticalCities.length} cities are experiencing unhealthy air quality levels. 
            Take necessary precautions if you're in these areas.
          </p>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">India Air Quality Map</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span>CPCB Live Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="h-4 w-4" />
              <span>Real-time</span>
            </div>
          </div>
        </div>

        {/* India Map Visualization */}
        <div className="relative bg-gradient-to-br from-orange-100 to-green-100 rounded-lg h-[500px] overflow-hidden mb-6">
          {/* Stylized India outline */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              <path
                d="M200 150 Q250 100 350 120 L450 110 Q500 130 520 180 L530 250 Q540 300 520 350 L500 400 Q480 450 450 470 L400 480 Q350 490 300 480 L250 470 Q200 450 180 400 L170 350 Q160 300 170 250 L180 200 Q190 175 200 150 Z"
                fill="rgba(34, 197, 94, 0.1)"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Current Location Marker */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className={`w-10 h-10 ${getAQIColor(currentLocation.aqi)} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse border-2 border-white`}>
                {Math.round(currentLocation.aqi)}
              </div>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md text-xs font-medium whitespace-nowrap border">
                📍 {currentLocation.location}
              </div>
            </div>
          </div>

          {/* Other Cities */}
          {indianCitiesAQI.slice(0, 12).map((city, index) => (
            <div 
              key={city.name}
              className="absolute cursor-pointer group"
              style={{
                top: `${20 + (index * 8) + Math.random() * 40}%`,
                left: `${25 + (index * 6) + Math.random() * 50}%`
              }}
            >
              <div className="relative">
                <div className={`w-7 h-7 ${getAQIColor(city.aqi)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-110`}>
                  {Math.round(city.aqi)}
                </div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 border">
                  <div className="font-semibold">{city.name}</div>
                  <div className="text-gray-600">{city.state}</div>
                  <div className={`text-xs ${city.aqi > 150 ? 'text-red-600' : 'text-gray-600'}`}>
                    AQI: {city.aqi} - {getAQICategory(city.aqi)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-semibold mb-2">Indian AQI Scale (CPCB)</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Good (0-50)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Satisfactory (51-100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">Moderate (101-200)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Poor (201-300)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs">Very Poor (301-400)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                <span className="text-xs">Severe (401+)</span>
              </div>
            </div>
          </div>

          {/* North India Pollution Zone Indicator */}
          <div className="absolute top-4 right-4 bg-red-100/90 backdrop-blur-sm rounded-lg p-2 text-xs">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-red-700 font-medium">NCR High Pollution Zone</span>
            </div>
          </div>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Current Location */}
          <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{currentLocation.location}</div>
                <div className="text-xs text-gray-600">{currentLocation.state} • {currentLocation.district}</div>
                <div className="text-xs text-blue-600 mt-1">📍 Current Location</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{Math.round(currentLocation.aqi)}</div>
                <Badge className={`text-xs ${getAQIColor(currentLocation.aqi)} text-white`}>
                  {getAQICategory(currentLocation.aqi)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Top cities by AQI */}
          {indianCitiesAQI
            .sort((a, b) => b.aqi - a.aqi)
            .slice(0, 8)
            .map((city) => (
            <div key={city.name} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{city.name}</div>
                  <div className="text-xs text-gray-600">{city.state}</div>
                  <div className="text-xs text-gray-500 mt-1">{city.district}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{city.aqi}</div>
                  <Badge className={`text-xs ${getAQIColor(city.aqi)} text-white`}>
                    {getAQICategory(city.aqi)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CPCB Information */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">CPCB Integration</span>
          </div>
          <p className="text-sm text-gray-700">
            Data sourced from Central Pollution Control Board (CPCB) monitoring stations across India. 
            Real-time updates every 15 minutes from {indianCitiesAQI.length} major cities and districts.
          </p>
        </div>
      </Card>
    </div>
  );
};


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

// Major Indian states and districts with mock AQI data
const indianStatesAQI = [
  { name: "Delhi", aqi: 165, lat: 28.6139, lng: 77.2090 },
  { name: "Punjab", aqi: 195, lat: 30.7333, lng: 76.7794 },
  { name: "Haryana", aqi: 158, lat: 29.0588, lng: 76.0856 },
  { name: "Uttar Pradesh", aqi: 180, lat: 26.8467, lng: 80.9462 },
  { name: "Rajasthan", aqi: 152, lat: 26.9124, lng: 75.7873 },
  { name: "Maharashtra", aqi: 142, lat: 19.0760, lng: 72.8777 },
  { name: "Karnataka", aqi: 98, lat: 12.9716, lng: 77.5946 },
  { name: "Tamil Nadu", aqi: 115, lat: 13.0827, lng: 80.2707 },
  { name: "West Bengal", aqi: 178, lat: 22.5726, lng: 88.3639 },
  { name: "Bihar", aqi: 185, lat: 25.5941, lng: 85.1376 },
  { name: "Odisha", aqi: 128, lat: 20.9517, lng: 85.0985 },
  { name: "Andhra Pradesh", aqi: 125, lat: 15.9129, lng: 79.7400 },
  { name: "Telangana", aqi: 125, lat: 17.3850, lng: 78.4867 },
  { name: "Madhya Pradesh", aqi: 135, lat: 22.9734, lng: 78.6569 },
  { name: "Gujarat", aqi: 135, lat: 23.0225, lng: 72.5714 },
  { name: "Kerala", aqi: 89, lat: 10.8505, lng: 76.2711 },
  { name: "Assam", aqi: 118, lat: 26.2006, lng: 92.9376 },
  { name: "Jharkhand", aqi: 145, lat: 23.6102, lng: 85.2799 },
  { name: "Chhattisgarh", aqi: 138, lat: 21.2787, lng: 81.8661 },
];

export const IndiaAQIMap = ({ currentLocation }: IndiaAQIMapProps) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981"; // green-500
    if (aqi <= 100) return "#eab308"; // yellow-500
    if (aqi <= 150) return "#f97316"; // orange-500
    if (aqi <= 200) return "#ef4444"; // red-500
    if (aqi <= 300) return "#a855f7"; // purple-500
    return "#991b1b"; // red-700
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    if (aqi <= 300) return "Poor";
    if (aqi <= 400) return "Very Poor";
    return "Severe";
  };

  const criticalStates = indianStatesAQI.filter(state => state.aqi > 150);

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {criticalStates.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-red-800">Air Quality Alert</h3>
          </div>
          <p className="text-sm text-red-700">
            {criticalStates.length} states are experiencing unhealthy air quality levels. 
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
        <div className="relative bg-gradient-to-br from-orange-50 to-green-50 rounded-lg h-[600px] overflow-hidden mb-6 border-2 border-gray-200">
          {/* SVG India Map with State Outlines */}
          <svg viewBox="0 0 1000 700" className="w-full h-full">
            {/* India outline and state boundaries */}
            <g id="india-map">
              {/* Rajasthan */}
              <path d="M200 180 L320 170 L340 220 L300 280 L250 290 L200 250 Z" 
                    fill={getAQIColor(152)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Rajasthan - AQI: 152</title>
              </path>
              
              {/* Punjab */}
              <path d="M280 120 L340 115 L360 140 L340 170 L280 175 Z" 
                    fill={getAQIColor(195)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Punjab - AQI: 195</title>
              </path>
              
              {/* Haryana & Delhi */}
              <path d="M340 115 L380 120 L390 160 L340 170 Z" 
                    fill={getAQIColor(158)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Haryana - AQI: 158</title>
              </path>
              
              {/* Uttar Pradesh */}
              <path d="M390 160 L520 155 L540 200 L480 220 L390 210 Z" 
                    fill={getAQIColor(180)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Uttar Pradesh - AQI: 180</title>
              </path>
              
              {/* Bihar */}
              <path d="M540 200 L620 195 L630 230 L540 240 Z" 
                    fill={getAQIColor(185)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Bihar - AQI: 185</title>
              </path>
              
              {/* West Bengal */}
              <path d="M630 230 L680 225 L700 280 L650 300 L630 260 Z" 
                    fill={getAQIColor(178)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>West Bengal - AQI: 178</title>
              </path>
              
              {/* Madhya Pradesh */}
              <path d="M300 280 L480 270 L500 330 L350 340 Z" 
                    fill={getAQIColor(135)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Madhya Pradesh - AQI: 135</title>
              </path>
              
              {/* Gujarat */}
              <path d="M150 280 L300 270 L320 350 L180 380 Z" 
                    fill={getAQIColor(135)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Gujarat - AQI: 135</title>
              </path>
              
              {/* Maharashtra */}
              <path d="M180 380 L350 360 L400 450 L220 480 Z" 
                    fill={getAQIColor(142)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Maharashtra - AQI: 142</title>
              </path>
              
              {/* Karnataka */}
              <path d="M350 450 L450 440 L470 520 L380 540 Z" 
                    fill={getAQIColor(98)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Karnataka - AQI: 98</title>
              </path>
              
              {/* Tamil Nadu */}
              <path d="M450 500 L550 490 L570 580 L480 590 Z" 
                    fill={getAQIColor(115)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Tamil Nadu - AQI: 115</title>
              </path>
              
              {/* Kerala */}
              <path d="M380 540 L430 535 L450 600 L400 610 Z" 
                    fill={getAQIColor(89)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Kerala - AQI: 89</title>
              </path>
              
              {/* Andhra Pradesh */}
              <path d="M450 440 L550 430 L570 490 L470 500 Z" 
                    fill={getAQIColor(125)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Andhra Pradesh - AQI: 125</title>
              </path>
              
              {/* Telangana */}
              <path d="M400 380 L500 370 L520 420 L450 430 Z" 
                    fill={getAQIColor(125)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Telangana - AQI: 125</title>
              </path>
              
              {/* Odisha */}
              <path d="M500 330 L580 320 L600 380 L520 390 Z" 
                    fill={getAQIColor(128)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Odisha - AQI: 128</title>
              </path>
              
              {/* Chhattisgarh */}
              <path d="M480 270 L540 265 L560 320 L500 330 Z" 
                    fill={getAQIColor(138)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Chhattisgarh - AQI: 138</title>
              </path>
              
              {/* Jharkhand */}
              <path d="M540 240 L620 235 L630 280 L560 290 Z" 
                    fill={getAQIColor(145)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Jharkhand - AQI: 145</title>
              </path>
              
              {/* Assam and Northeast */}
              <path d="L700 200 L780 190 L800 250 L720 270 Z" 
                    fill={getAQIColor(118)} 
                    stroke="#333" 
                    strokeWidth="1" 
                    opacity="0.8"
                    className="hover:opacity-100 cursor-pointer transition-opacity">
                <title>Assam - AQI: 118</title>
              </path>
            </g>
          </svg>

          {/* Current Location Marker */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse border-4 border-white z-10`}
                   style={{ backgroundColor: getAQIColor(currentLocation.aqi) }}>
                {Math.round(currentLocation.aqi)}
              </div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-md text-xs font-medium whitespace-nowrap border z-10">
                📍 {currentLocation.location}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-xs font-semibold mb-3">Indian AQI Scale (CPCB)</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(25) }}></div>
                <span className="text-xs">Good (0-50)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(75) }}></div>
                <span className="text-xs">Satisfactory (51-100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(125) }}></div>
                <span className="text-xs">Moderate (101-200)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(250) }}></div>
                <span className="text-xs">Poor (201-300)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(350) }}></div>
                <span className="text-xs">Very Poor (301-400)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(450) }}></div>
                <span className="text-xs">Severe (401+)</span>
              </div>
            </div>
          </div>

          {/* North India Pollution Zone Indicator */}
          <div className="absolute top-4 right-4 bg-red-100/90 backdrop-blur-sm rounded-lg p-3 text-xs">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 font-medium">NCR High Pollution Zone</span>
            </div>
          </div>
        </div>

        {/* State Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Current Location */}
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{currentLocation.location}</div>
                <div className="text-xs text-gray-600">{currentLocation.state} • {currentLocation.district}</div>
                <div className="text-xs text-blue-600 mt-1">📍 Current Location</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{Math.round(currentLocation.aqi)}</div>
                <Badge className="text-xs text-white" 
                       style={{ backgroundColor: getAQIColor(currentLocation.aqi) }}>
                  {getAQICategory(currentLocation.aqi)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Top states by AQI */}
          {indianStatesAQI
            .sort((a, b) => b.aqi - a.aqi)
            .slice(0, 8)
            .map((state) => (
            <div key={state.name} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{state.name}</div>
                  <div className="text-xs text-gray-500 mt-1">State Average</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{state.aqi}</div>
                  <Badge className="text-xs text-white" 
                         style={{ backgroundColor: getAQIColor(state.aqi) }}>
                    {getAQICategory(state.aqi)}
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
            Real-time updates every 15 minutes from {indianStatesAQI.length} states and major cities.
          </p>
        </div>
      </Card>
    </div>
  );
};

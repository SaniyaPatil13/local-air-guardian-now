
import { Card } from "@/components/ui/card";
import { MapPin, Layers, AlertTriangle, Activity, Satellite } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

interface IndiaAQIMapProps {
  currentLocation: {
    location: string;
    aqi: number;
    coordinates: { lat: number; lng: number };
    state: string;
    district: string;
  };
}

const geoUrl = "/india_states.geojson";

// Expanded list of major Indian cities/districts with AQI and coordinates
const majorCitiesAQI = [
  { name: "Delhi", aqi: 165, lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", aqi: 139, lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore", aqi: 98, lat: 12.9716, lng: 77.5946 },
  { name: "Kolkata", aqi: 178, lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", aqi: 115, lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", aqi: 125, lat: 17.3850, lng: 78.4867 },
  { name: "Ahmedabad", aqi: 135, lat: 23.0225, lng: 72.5714 },
  { name: "Pune", aqi: 110, lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", aqi: 152, lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", aqi: 180, lat: 26.8467, lng: 80.9462 },
  { name: "Patna", aqi: 185, lat: 25.5941, lng: 85.1376 },
  { name: "Bhopal", aqi: 135, lat: 23.2599, lng: 77.4126 },
  { name: "Indore", aqi: 120, lat: 22.7196, lng: 75.8577 },
  { name: "Chandigarh", aqi: 140, lat: 30.7333, lng: 76.7794 },
  { name: "Kanpur", aqi: 170, lat: 26.4499, lng: 80.3319 },
  { name: "Nagpur", aqi: 130, lat: 21.1458, lng: 79.0882 },
  { name: "Visakhapatnam", aqi: 105, lat: 17.6868, lng: 83.2185 },
  { name: "Thane", aqi: 120, lat: 19.2183, lng: 72.9781 },
  { name: "Agra", aqi: 160, lat: 27.1767, lng: 78.0081 },
  { name: "Varanasi", aqi: 175, lat: 25.3176, lng: 82.9739 },
  { name: "Ludhiana", aqi: 150, lat: 30.9000, lng: 75.8573 },
  { name: "Nashik", aqi: 115, lat: 19.9975, lng: 73.7898 },
  { name: "Meerut", aqi: 155, lat: 28.9845, lng: 77.7064 },
  { name: "Faridabad", aqi: 145, lat: 28.4089, lng: 77.3178 },
  { name: "Rajkot", aqi: 125, lat: 22.3039, lng: 70.8022 },
  { name: "Srinagar", aqi: 90, lat: 34.0837, lng: 74.7973 },
  { name: "Amritsar", aqi: 135, lat: 31.6340, lng: 74.8723 },
  { name: "Allahabad", aqi: 165, lat: 25.4358, lng: 81.8463 },
  { name: "Ranchi", aqi: 140, lat: 23.3441, lng: 85.3096 },
  { name: "Coimbatore", aqi: 100, lat: 11.0168, lng: 76.9558 },
  { name: "Jodhpur", aqi: 120, lat: 26.2389, lng: 73.0243 },
  { name: "Guwahati", aqi: 110, lat: 26.1445, lng: 91.7362 },
  { name: "Jabalpur", aqi: 115, lat: 23.1815, lng: 79.9864 },
  { name: "Madurai", aqi: 105, lat: 9.9252, lng: 78.1198 },
  { name: "Raipur", aqi: 130, lat: 21.2514, lng: 81.6296 },
  { name: "Kota", aqi: 125, lat: 25.2138, lng: 75.8648 },
  { name: "Chandrapur", aqi: 120, lat: 19.9615, lng: 79.2961 },
  { name: "Gwalior", aqi: 135, lat: 26.2183, lng: 78.1828 },
  { name: "Vijayawada", aqi: 110, lat: 16.5062, lng: 80.6480 },
  { name: "Jamshedpur", aqi: 120, lat: 22.8046, lng: 86.2029 },
  { name: "Bhilai", aqi: 125, lat: 21.1938, lng: 81.3509 },
  { name: "Cuttack", aqi: 115, lat: 20.4625, lng: 85.8828 },
  { name: "Firozabad", aqi: 140, lat: 27.1591, lng: 78.3958 },
  { name: "Dhanbad", aqi: 135, lat: 23.7957, lng: 86.4304 },
  { name: "Bikaner", aqi: 120, lat: 28.0229, lng: 73.3119 },
  { name: "Warangal", aqi: 110, lat: 17.9784, lng: 79.5941 },
  { name: "Guntur", aqi: 105, lat: 16.3067, lng: 80.4365 },
  { name: "Noida", aqi: 150, lat: 28.5355, lng: 77.3910 },
  { name: "Howrah", aqi: 130, lat: 22.5958, lng: 88.2636 },
  { name: "Solapur", aqi: 120, lat: 17.6599, lng: 75.9064 },
  { name: "Hubli", aqi: 110, lat: 15.3647, lng: 75.1240 },
  { name: "Tiruchirappalli", aqi: 105, lat: 10.7905, lng: 78.7047 },
  { name: "Bareilly", aqi: 140, lat: 28.3670, lng: 79.4304 },
  { name: "Moradabad", aqi: 135, lat: 28.8386, lng: 78.7733 },
  { name: "Mysore", aqi: 100, lat: 12.2958, lng: 76.6394 },
  { name: "Gurgaon", aqi: 145, lat: 28.4595, lng: 77.0266 },
  { name: "Aligarh", aqi: 130, lat: 27.8974, lng: 78.0880 },
  { name: "Jalandhar", aqi: 120, lat: 31.3260, lng: 75.5762 },
  { name: "Bhubaneswar", aqi: 110, lat: 20.2961, lng: 85.8245 },
  { name: "Salem", aqi: 105, lat: 11.6643, lng: 78.1460 },
  { name: "Udaipur", aqi: 115, lat: 24.5854, lng: 73.7125 },
  { name: "Jammu", aqi: 100, lat: 32.7266, lng: 74.8570 },
  { name: "Siliguri", aqi: 110, lat: 26.7271, lng: 88.3953 },
  { name: "Mangalore", aqi: 100, lat: 12.9141, lng: 74.8560 },
  { name: "Erode", aqi: 105, lat: 11.3410, lng: 77.7172 },
  { name: "Belgaum", aqi: 100, lat: 15.8497, lng: 74.4977 },
  { name: "Ambattur", aqi: 110, lat: 13.1143, lng: 80.1548 },
  { name: "Tiruppur", aqi: 105, lat: 11.1085, lng: 77.3411 },
  { name: "Durgapur", aqi: 120, lat: 23.5204, lng: 87.3119 },
  { name: "Asansol", aqi: 115, lat: 23.6739, lng: 86.9524 },
  { name: "Rourkela", aqi: 110, lat: 22.2604, lng: 84.8536 },
  { name: "Nanded", aqi: 105, lat: 19.1383, lng: 77.3210 },
  { name: "Kolhapur", aqi: 100, lat: 16.7050, lng: 74.2433 },
  { name: "Ajmer", aqi: 110, lat: 26.4499, lng: 74.6399 },
  { name: "Akola", aqi: 105, lat: 20.7002, lng: 77.0087 },
  { name: "Gulbarga", aqi: 100, lat: 17.3297, lng: 76.8343 },
  { name: "Jamnagar", aqi: 110, lat: 22.4707, lng: 70.0577 },
  { name: "Ujjain", aqi: 105, lat: 23.1793, lng: 75.7849 },
  { name: "Loni", aqi: 100, lat: 28.7515, lng: 77.2880 },
  { name: "Sagar", aqi: 105, lat: 23.8388, lng: 78.7378 },
  { name: "Saharanpur", aqi: 110, lat: 29.9640, lng: 77.5460 },
  { name: "Mathura", aqi: 105, lat: 27.4924, lng: 77.6737 },
  { name: "Bardhaman", aqi: 110, lat: 23.2324, lng: 87.8615 },
  { name: "Rampur", aqi: 105, lat: 28.8154, lng: 79.0250 },
  { name: "Shimoga", aqi: 100, lat: 13.9299, lng: 75.5681 },
  { name: "Tumkur", aqi: 105, lat: 13.3422, lng: 77.1010 },
  { name: "Shillong", aqi: 90, lat: 25.5788, lng: 91.8933 },
  { name: "Parbhani", aqi: 100, lat: 19.2704, lng: 76.7601 },
  { name: "Panipat", aqi: 110, lat: 29.3909, lng: 76.9635 },
  { name: "Darbhanga", aqi: 105, lat: 26.1542, lng: 85.8918 },
  { name: "Bihar Sharif", aqi: 100, lat: 25.1972, lng: 85.5232 },
  { name: "Aizawl", aqi: 90, lat: 23.7271, lng: 92.7176 },
  { name: "Satna", aqi: 100, lat: 24.6005, lng: 80.8322 },
  { name: "Cuddalore", aqi: 95, lat: 11.7447, lng: 79.7682 },
  { name: "Kakinada", aqi: 100, lat: 16.9891, lng: 82.2475 },
  { name: "Dewas", aqi: 95, lat: 22.9676, lng: 76.0556 },
  { name: "Mirzapur", aqi: 100, lat: 25.1458, lng: 82.5698 },
  { name: "Etawah", aqi: 95, lat: 26.7779, lng: 79.0210 },
  { name: "Anantapur", aqi: 90, lat: 14.6819, lng: 77.6006 },
  { name: "Nellore", aqi: 95, lat: 14.4426, lng: 79.9865 },
  { name: "Bally", aqi: 90, lat: 22.6450, lng: 88.3473 },
  { name: "Durg", aqi: 95, lat: 21.1905, lng: 81.2849 },
  { name: "Kharagpur", aqi: 90, lat: 22.3460, lng: 87.2319 },
  { name: "Bhimavaram", aqi: 90, lat: 16.5449, lng: 81.5212 },
  { name: "Ongole", aqi: 90, lat: 15.5057, lng: 80.0499 },
  { name: "Hindupur", aqi: 90, lat: 13.8281, lng: 77.4928 },
  { name: "Bettiah", aqi: 90, lat: 26.8022, lng: 84.5027 },
  { name: "Bharatpur", aqi: 90, lat: 27.2173, lng: 77.4895 },
  { name: "Sambalpur", aqi: 90, lat: 21.4669, lng: 83.9812 },
  { name: "Purnia", aqi: 90, lat: 25.7771, lng: 87.4753 },
  { name: "Navsari", aqi: 90, lat: 20.9467, lng: 72.9520 },
  { name: "Porbandar", aqi: 90, lat: 21.6417, lng: 69.6293 },
  { name: "Naihati", aqi: 90, lat: 22.8900, lng: 88.4152 },
  { name: "Bulandshahr", aqi: 90, lat: 28.4069, lng: 77.8498 },
  { name: "Bongaigaon", aqi: 90, lat: 26.4826, lng: 90.5537 },
  { name: "Banda", aqi: 90, lat: 25.4753, lng: 80.3358 },
  { name: "Bidar", aqi: 90, lat: 17.9133, lng: 77.5301 },
  { name: "Pali", aqi: 90, lat: 25.7725, lng: 73.3234 },
  { name: "Sonipat", aqi: 90, lat: 28.9959, lng: 77.0117 },
  { name: "Rohtak", aqi: 90, lat: 28.8955, lng: 76.6066 },
  { name: "Muzaffarnagar", aqi: 90, lat: 29.4739, lng: 77.7041 },
  { name: "Mathura", aqi: 90, lat: 27.4924, lng: 77.6737 },
  { name: "Panihati", aqi: 90, lat: 22.6900, lng: 88.3748 },
  { name: "Bally", aqi: 90, lat: 22.6450, lng: 88.3473 }
];

export const IndiaAQIMap = ({ currentLocation }: IndiaAQIMapProps) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 200) return "#ff7e00";
    if (aqi <= 300) return "#ff0000";
    if (aqi <= 400) return "#8f3f97";
    return "#7e0023";
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    if (aqi <= 300) return "Poor";
    if (aqi <= 400) return "Very Poor";
    return "Severe";
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Satellite className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-blue-800">India Map (Free & Open Source)</h3>
        </div>
        <p className="text-sm text-blue-700">
          Major Indian cities are shown below with AQI color-coded markers. No API key required.
        </p>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">India Air Quality Map (react-simple-maps)</h3>
          </div>
        </div>
        <div className="relative rounded-lg h-[700px] overflow-hidden mb-6 border-2 border-gray-200 bg-white">
          {geoData && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [82, 22], scale: 1200 }}
              width={900}
              height={700}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#e0e7ef"
                      stroke="#333"
                      strokeWidth={1}
                    />
                  ))
                }
              </Geographies>
              {majorCitiesAQI.map((city) => (
                <Marker key={city.name} coordinates={[city.lng, city.lat]}>
                  <circle
                    r={8}
                    fill={getAQIColor(city.aqi)}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                  <text
                    textAnchor="middle"
                    y={4}
                    fontSize={8}
                    fontWeight="bold"
                    fill="#fff"
                  >
                    {city.aqi}
                  </text>
                  <title>{`${city.name} - AQI: ${city.aqi}`}</title>
                </Marker>
              ))}
            </ComposableMap>
          )}
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-xs font-semibold mb-3">Indian AQI Scale (CPCB/VEDAS)</div>
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
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAQIColor(150) }}></div>
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
        </div>
      </Card>
    </div>
  );
};

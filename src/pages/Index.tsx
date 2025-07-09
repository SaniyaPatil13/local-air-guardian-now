
import { useState, useEffect } from "react";
import { AQICard } from "@/components/AQICard";
import { AQIMap } from "@/components/AQIMap";
import { HealthRecommendations } from "@/components/HealthRecommendations";
import { TrendChart } from "@/components/TrendChart";
import { LocationSearch } from "@/components/LocationSearch";
import { AlertBanner } from "@/components/AlertBanner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Thermometer, Droplets, Eye } from "lucide-react";

// Mock data structure - will be replaced with real API calls
const mockCurrentAQI = {
  location: "San Francisco, CA",
  aqi: 75,
  category: "Moderate",
  primaryPollutant: "PM2.5",
  timestamp: new Date().toISOString(),
  coordinates: { lat: 37.7749, lng: -122.4194 },
  weather: {
    temperature: 68,
    humidity: 65,
    windSpeed: 8,
    visibility: 10
  },
  pollutants: {
    pm25: 22.1,
    pm10: 35.4,
    o3: 68.2,
    no2: 28.7,
    so2: 5.1,
    co: 0.8
  }
};

const mockHistoricalData = [
  { date: "2024-07-01", aqi: 45 },
  { date: "2024-07-02", aqi: 52 },
  { date: "2024-07-03", aqi: 68 },
  { date: "2024-07-04", aqi: 75 },
  { date: "2024-07-05", aqi: 82 },
  { date: "2024-07-06", aqi: 71 },
  { date: "2024-07-07", aqi: 65 },
  { date: "2024-07-08", aqi: 58 },
  { date: "2024-07-09", aqi: 75 }
];

const Index = () => {
  const [currentData, setCurrentData] = useState(mockCurrentAQI);
  const [historicalData, setHistoricalData] = useState(mockHistoricalData);
  const [selectedLocation, setSelectedLocation] = useState("San Francisco, CA");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => ({
        ...prev,
        aqi: Math.max(0, Math.min(500, prev.aqi + (Math.random() - 0.5) * 10)),
        timestamp: new Date().toISOString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    // In real app, this would trigger API calls for new location
    console.log(`Fetching data for: ${location}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AirGuardian
              </h1>
              <p className="text-sm text-gray-600">Real-time Air Quality Intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <LocationSearch onLocationChange={handleLocationChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {currentData.aqi > 100 && (
        <AlertBanner 
          level="warning" 
          message="Air quality is unhealthy for sensitive groups. Consider limiting outdoor activities."
        />
      )}

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Current AQI Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AQICard data={currentData} />
          </div>
          <div>
            <HealthRecommendations aqi={currentData.aqi} category={currentData.category} />
          </div>
        </div>

        {/* Weather Context */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Wind className="h-5 w-5 mr-2 text-blue-500" />
            Weather Context
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">Temperature:</span>
              <span className="font-medium">{currentData.weather.temperature}°F</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Humidity:</span>
              <span className="font-medium">{currentData.weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Wind:</span>
              <span className="font-medium">{currentData.weather.windSpeed} mph</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">Visibility:</span>
              <span className="font-medium">{currentData.weather.visibility} mi</span>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="pollutants">Pollutant Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="mt-6">
            <AQIMap currentLocation={currentData} />
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <TrendChart data={historicalData} />
          </TabsContent>
          
          <TabsContent value="pollutants" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pollutant Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentData.pollutants).map(([pollutant, value]) => (
                  <div key={pollutant} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      {pollutant.replace(/(\d+)/, '$1.')}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {value} <span className="text-sm text-gray-500">μg/m³</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;


import { useState, useEffect } from "react";
import { AQICard } from "@/components/AQICard";
import { IndiaAQIMap } from "@/components/IndiaAQIMap";
import { HealthRecommendations } from "@/components/HealthRecommendations";
import { TrendChart } from "@/components/TrendChart";
import { ForecastChart } from "@/components/ForecastChart";
import { LocationSearch } from "@/components/LocationSearch";
import { AlertBanner } from "@/components/AlertBanner";
import { PollutionSourceMap } from "@/components/PollutionSourceMap";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Thermometer, Droplets, Eye, Activity, MapPin, TrendingUp, AlertTriangle } from "lucide-react";

// Mock location-based CPCB data
const getLocationData = (location: string) => {
  const locationMappings = {
    "Delhi, India": {
      location: "Delhi, India",
      aqi: 165,
      category: "Unhealthy",
      primaryPollutant: "PM2.5",
      coordinates: { lat: 28.6139, lng: 77.2090 },
      weather: {
        temperature: 28,
        humidity: 72,
        windSpeed: 12,
        visibility: 6
      },
      pollutants: {
        pm25: 85.2,
        pm10: 120.4,
        o3: 42.1,
        no2: 68.7,
        so2: 15.3,
        co: 1.8
      },
      cpcbStation: "Delhi - Anand Vihar",
      state: "Delhi",
      district: "Central Delhi"
    },
    "Mumbai, Maharashtra": {
      location: "Mumbai, Maharashtra",
      aqi: 142,
      category: "Moderate",
      primaryPollutant: "PM2.5",
      coordinates: { lat: 19.0760, lng: 72.8777 },
      weather: {
        temperature: 32,
        humidity: 78,
        windSpeed: 15,
        visibility: 8
      },
      pollutants: {
        pm25: 65.8,
        pm10: 95.2,
        o3: 38.5,
        no2: 52.3,
        so2: 12.1,
        co: 1.2
      },
      cpcbStation: "Mumbai - Bandra Kurla",
      state: "Maharashtra",
      district: "Mumbai Suburban"
    },
    "Bangalore, Karnataka": {
      location: "Bangalore, Karnataka",
      aqi: 98,
      category: "Satisfactory",
      primaryPollutant: "PM10",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      weather: {
        temperature: 26,
        humidity: 65,
        windSpeed: 8,
        visibility: 10
      },
      pollutants: {
        pm25: 42.3,
        pm10: 78.5,
        o3: 35.2,
        no2: 45.8,
        so2: 8.9,
        co: 0.9
      },
      cpcbStation: "Bangalore - BTM Layout",
      state: "Karnataka",
      district: "Bangalore Urban"
    }
  };

  return locationMappings[location] || locationMappings["Delhi, India"];
};

const generateHistoricalData = (location: string) => {
  const baseAQI = getLocationData(location).aqi;
  return Array.from({ length: 9 }, (_, i) => ({
    date: new Date(Date.now() - (8 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    aqi: Math.max(20, baseAQI + (Math.random() - 0.5) * 60)
  }));
};

const generateForecastData = (location: string) => {
  const baseAQI = getLocationData(location).aqi;
  return Array.from({ length: 3 }, (_, i) => ({
    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    aqi: Math.max(20, baseAQI + (Math.random() - 0.5) * 40),
    confidence: Math.max(60, 90 - i * 10)
  }));
};

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState("Delhi, India");
  const [currentData, setCurrentData] = useState(getLocationData("Delhi, India"));
  const [historicalData, setHistoricalData] = useState(generateHistoricalData("Delhi, India"));
  const [forecastData, setForecastData] = useState(generateForecastData("Delhi, India"));
  const [showNotifications, setShowNotifications] = useState(true);

  // Update data when location changes
  useEffect(() => {
    const newData = getLocationData(selectedLocation);
    setCurrentData({
      ...newData,
      timestamp: new Date().toISOString()
    });
    setHistoricalData(generateHistoricalData(selectedLocation));
    setForecastData(generateForecastData(selectedLocation));
  }, [selectedLocation]);

  // Simulate real-time CPCB updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => ({
        ...prev,
        aqi: Math.max(0, Math.min(500, prev.aqi + (Math.random() - 0.5) * 10)),
        timestamp: new Date().toISOString(),
        pollutants: {
          ...prev.pollutants,
          pm25: Math.max(0, prev.pollutants.pm25 + (Math.random() - 0.5) * 5),
          pm10: Math.max(0, prev.pollutants.pm10 + (Math.random() - 0.5) * 8)
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLocationChange = (location: string) => {
    console.log(`Fetching CPCB data for: ${location}`);
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                AirGuardian India
              </h1>
              <p className="text-sm text-gray-600">Real-time CPCB Air Quality Intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <LocationSearch onLocationChange={handleLocationChange} />
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">CPCB Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banners */}
      {currentData.aqi > 150 && showNotifications && (
        <AlertBanner 
          level="error" 
          message={`Unhealthy air quality detected in ${currentData.district}. Limit outdoor activities and use air purifiers.`}
        />
      )}

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Current AQI Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <AQICard data={currentData} />
        </div>

        {/* Weather Context & CPCB Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wind className="h-5 w-5 mr-2 text-blue-500" />
              Weather Context
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600">Temperature:</span>
                <span className="font-medium">{currentData.weather.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Humidity:</span>
                <span className="font-medium">{currentData.weather.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Wind:</span>
                <span className="font-medium">{currentData.weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600">Visibility:</span>
                <span className="font-medium">{currentData.weather.visibility} km</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              CPCB Station Info
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Station:</span>
                <span className="font-medium ml-2">{currentData.cpcbStation}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">State:</span>
                <span className="font-medium ml-2">{currentData.state}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">District:</span>
                <span className="font-medium ml-2">{currentData.district}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="font-medium ml-2">
                  {new Date(currentData.timestamp).toLocaleTimeString('en-IN')}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="india-map" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="india-map">India Map</TabsTrigger>
            <TabsTrigger value="trends">Historical Data</TabsTrigger>
            <TabsTrigger value="forecast">3-Day Forecast</TabsTrigger>
            <TabsTrigger value="health">Health Advisory</TabsTrigger>
            <TabsTrigger value="pollution-sources">Pollution Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="india-map" className="mt-6">
            <IndiaAQIMap currentLocation={currentData} />
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <TrendChart data={historicalData} />
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-6">
            <ForecastChart data={forecastData} />
          </TabsContent>
          
          <TabsContent value="health" className="mt-6">
            <HealthRecommendations aqi={currentData.aqi} category={currentData.category} />
          </TabsContent>
          
          <TabsContent value="pollution-sources" className="mt-6">
            <PollutionSourceMap />
          </TabsContent>
        </Tabs>

        {/* Pollutant Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-500" />
            Pollutant Breakdown (CPCB Standards)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(currentData.pollutants).map(([pollutant, value]) => {
              const numValue = Number(value);
              const isHigh = pollutant === 'pm25' ? numValue > 60 : pollutant === 'pm10' ? numValue > 100 : numValue > 40;
              return (
                <div key={pollutant} className={`${isHigh ? 'bg-red-50 border-red-200' : 'bg-gray-50'} rounded-lg p-4 border`}>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">
                    {pollutant.replace(/(\d+)/, '$1.')}
                  </div>
                  <div className={`text-2xl font-bold ${isHigh ? 'text-red-600' : 'text-gray-900'}`}>
                    {numValue.toFixed(1)} <span className="text-sm text-gray-500">μg/m³</span>
                  </div>
                  {isHigh && (
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-xs text-red-600">Above safe limit</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Indian NAAQS Standards</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>PM2.5: 60 μg/m³ (24-hour average)</p>
              <p>PM10: 100 μg/m³ (24-hour average)</p>
              <p>NO₂: 80 μg/m³ (24-hour average)</p>
              <p>SO₂: 80 μg/m³ (24-hour average)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;

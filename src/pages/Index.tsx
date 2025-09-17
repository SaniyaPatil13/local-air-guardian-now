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
import { Wind, Thermometer, Droplets, Eye, Activity, MapPin, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { cpcbApi, CPCBStation } from "@/services/cpcbApi";
import { locationService } from "@/services/locationService";

interface AQIData {
  location: string;
  aqi: number;
  category: string;
  primaryPollutant: string;
  coordinates: { lat: number; lng: number };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    visibility: number;
  };
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  cpcbStation: string;
  state: string;
  district: string;
  timestamp: string;
}

const generateHistoricalData = (baseAQI: number) =>
  Array.from({ length: 24 }, (_, i) => ({
    date: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString().split('T')[0],
    time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    aqi: Math.max(0, Math.min(500, baseAQI + (Math.random() - 0.5) * 20)),
    pm25: Math.max(0, baseAQI * 0.6 + (Math.random() - 0.5) * 10),
    pm10: Math.max(0, baseAQI * 0.8 + (Math.random() - 0.5) * 15)
  }));

const generateForecastData = (baseAQI: number) =>
  Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    aqi: Math.max(0, Math.min(500, baseAQI + (Math.random() - 0.5) * 30)),
    confidence: Math.max(60, 90 - i * 10)
  }));

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState("Delhi, India");
  const [currentData, setCurrentData] = useState<AQIData | null>(null);
  const [historicalData, setHistoricalData] = useState(generateHistoricalData(165));
  const [forecastData, setForecastData] = useState(generateForecastData(165));
  const [showNotifications, setShowNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRealTimeData, setIsRealTimeData] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Load initial data
  useEffect(() => {
    loadLocationData("Delhi, India");
  }, []);

  // Set initial mock data if loading takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!currentData) {
        console.log('Loading timeout, setting fallback data');
        const fallbackData: AQIData = {
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
          district: "Central Delhi",
          timestamp: new Date().toISOString()
        };
        setCurrentData(fallbackData);
        setHistoricalData(generateHistoricalData(165));
        setForecastData(generateForecastData(165));
        setIsRealTimeData(false);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [currentData]);

  const loadLocationData = async (location: string, coordinates?: { lat: number; lng: number }) => {
    setIsLoading(true);
    try {
      let station: CPCBStation | null = null;

      if (coordinates) {
        // Find nearest station to coordinates
        station = await cpcbApi.findNearestStation(coordinates.lat, coordinates.lng);
        setCurrentCoordinates(coordinates);
      } else {
        // Search by city name
        const stations = await cpcbApi.searchStationsByCity(location);
        station = stations[0] || null;
        if (station) {
          setCurrentCoordinates({ lat: station.latitude, lng: station.longitude });
        }
      }

      if (station) {
        // If user provided coordinates (from a locality suggestion or current location),
        // prefer showing the user's selected locality text for display
        const displayLocation = coordinates ? location : `${station.city}, ${station.state}`;
        const aqiData: AQIData = {
          location: displayLocation,
          aqi: station.aqi,
          category: station.category,
          primaryPollutant: station.primaryPollutant,
          coordinates: { lat: station.latitude, lng: station.longitude },
          weather: {
            temperature: Math.round(20 + Math.random() * 15), // Mock weather data
            humidity: Math.round(50 + Math.random() * 30),
            windSpeed: Math.round(5 + Math.random() * 15),
            visibility: Math.round(5 + Math.random() * 10)
          },
          pollutants: station.pollutants,
          cpcbStation: station.name,
          state: station.state,
          district: station.city,
          timestamp: station.lastUpdate
        };

        setCurrentData(aqiData);
        setHistoricalData(generateHistoricalData(station.aqi));
        setForecastData(generateForecastData(station.aqi));
        setIsRealTimeData(true);
        console.log(`Loaded real CPCB data for ${station.name}: AQI ${station.aqi}`);
      } else {
        // Fallback to mock data if no station found
        console.warn(`No CPCB station found for ${location}, using mock data`);
        const fallbackData: AQIData = {
          location: location,
          aqi: 120 + Math.random() * 80, // Random AQI between 120-200
          category: "Moderate",
          primaryPollutant: "PM2.5",
          coordinates: coordinates || { lat: 28.6139, lng: 77.2090 },
          weather: {
            temperature: Math.round(20 + Math.random() * 15),
            humidity: Math.round(50 + Math.random() * 30),
            windSpeed: Math.round(5 + Math.random() * 15),
            visibility: Math.round(5 + Math.random() * 10)
          },
          pollutants: {
            pm25: 50 + Math.random() * 50,
            pm10: 70 + Math.random() * 60,
            o3: 30 + Math.random() * 20,
            no2: 40 + Math.random() * 30,
            so2: 10 + Math.random() * 10,
            co: 1 + Math.random() * 2
          },
          cpcbStation: `${location} - Mock Station`,
          state: location.split(',')[1]?.trim() || 'Unknown',
          district: location.split(',')[0]?.trim() || 'Unknown',
          timestamp: new Date().toISOString()
        };
        setCurrentData(fallbackData);
        setHistoricalData(generateHistoricalData(fallbackData.aqi));
        setForecastData(generateForecastData(fallbackData.aqi));
        setIsRealTimeData(false);
      }
    } catch (error) {
      console.error("Error loading location data:", error);
      // Set fallback data on error
      const fallbackData: AQIData = {
        location: location,
        aqi: 120 + Math.random() * 80,
        category: "Moderate",
        primaryPollutant: "PM2.5",
        coordinates: coordinates || { lat: 28.6139, lng: 77.2090 },
        weather: {
          temperature: Math.round(20 + Math.random() * 15),
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 15),
          visibility: Math.round(5 + Math.random() * 10)
        },
        pollutants: {
          pm25: 50 + Math.random() * 50,
          pm10: 70 + Math.random() * 60,
          o3: 30 + Math.random() * 20,
          no2: 40 + Math.random() * 30,
          so2: 10 + Math.random() * 10,
          co: 1 + Math.random() * 2
        },
        cpcbStation: `${location} - Mock Station`,
        state: location.split(',')[1]?.trim() || 'Unknown',
        district: location.split(',')[0]?.trim() || 'Unknown',
        timestamp: new Date().toISOString()
      };
      setCurrentData(fallbackData);
      setHistoricalData(generateHistoricalData(fallbackData.aqi));
      setForecastData(generateForecastData(fallbackData.aqi));
      setIsRealTimeData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Update data when location changes
  useEffect(() => {
    if (selectedLocation) {
      loadLocationData(selectedLocation, currentCoordinates || undefined);
    }
  }, [selectedLocation]);

  // Simulate real-time updates for current data
  useEffect(() => {
    if (!currentData || !isRealTimeData) return;

    const interval = setInterval(() => {
      setCurrentData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          aqi: Math.max(0, Math.min(500, prev.aqi + (Math.random() - 0.5) * 10)),
          timestamp: new Date().toISOString(),
          pollutants: {
            ...prev.pollutants,
            pm25: Math.max(0, prev.pollutants.pm25 + (Math.random() - 0.5) * 5),
            pm10: Math.max(0, prev.pollutants.pm10 + (Math.random() - 0.5) * 8)
          }
        };
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [currentData, isRealTimeData]);

  const handleLocationChange = (location: string, coordinates?: { lat: number; lng: number }) => {
    console.log(`Fetching CPCB data for: ${location}`, coordinates);
    setSelectedLocation(location);
    if (coordinates) {
      setCurrentCoordinates(coordinates);
    }
  };

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading air quality data...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-gray-600">
                {isRealTimeData ? "Real-time CPCB Air Quality Intelligence" : "Air Quality Monitoring (Demo Mode)"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LocationSearch onLocationChange={handleLocationChange} />
              <div className="flex items-center space-x-2 text-sm">
                <Activity className={`h-4 w-4 ${isRealTimeData ? 'text-green-500' : 'text-orange-500'}`} />
                <span className={`font-medium ${isRealTimeData ? 'text-green-600' : 'text-orange-600'}`}>
                  {isRealTimeData ? 'CPCB Live' : 'Demo Data'}
                </span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AQICard data={currentData} />
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Station Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Station:</span>
                  <span className="font-medium">{currentData.cpcbStation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span className="font-medium">{currentData.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">District:</span>
                  <span className="font-medium">{currentData.district}</span>
                </div>
                {currentData.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium text-xs">
                      {new Date(currentData.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
                Weather
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span>{currentData.weather.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{currentData.weather.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-green-500" />
                  <span>{currentData.weather.windSpeed} km/h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span>{currentData.weather.visibility} km</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="map">India Map</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="sources">Pollution Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <IndiaAQIMap currentLocation={currentData} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  24-Hour AQI Trend
                </h3>
                <TrendChart data={historicalData} />
              </Card>
              <HealthRecommendations aqi={currentData.aqi} category={currentData.category} />
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">7-Day AQI Forecast</h3>
              <ForecastChart data={forecastData} />
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <PollutionSourceMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
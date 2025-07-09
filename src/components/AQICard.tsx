
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp } from "lucide-react";

interface AQIData {
  location: string;
  aqi: number;
  category: string;
  primaryPollutant: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
}

interface AQICardProps {
  data: AQIData;
}

export const AQICard = ({ data }: AQICardProps) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "from-green-400 to-green-600";
    if (aqi <= 100) return "from-yellow-400 to-yellow-600";
    if (aqi <= 150) return "from-orange-400 to-orange-600";
    if (aqi <= 200) return "from-red-400 to-red-600";
    if (aqi <= 300) return "from-purple-400 to-purple-600";
    return "from-red-700 to-red-900";
  };

  const getAQITextColor = (aqi: number) => {
    if (aqi <= 100) return "text-gray-800";
    return "text-white";
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "good": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "unhealthy for sensitive groups": return "bg-orange-500";
      case "unhealthy": return "bg-red-500";
      case "very unhealthy": return "bg-purple-500";
      case "hazardous": return "bg-red-700";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`bg-gradient-to-br ${getAQIColor(data.aqi)} p-6`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className={`h-4 w-4 ${getAQITextColor(data.aqi)}`} />
              <span className={`text-sm ${getAQITextColor(data.aqi)} opacity-90`}>
                {data.location}
              </span>
            </div>
            <div className={`text-6xl font-bold ${getAQITextColor(data.aqi)} mb-2`}>
              {Math.round(data.aqi)}
            </div>
            <Badge className={`${getCategoryColor(data.category)} text-white border-0`}>
              {data.category}
            </Badge>
          </div>
          <div className="text-right">
            <div className={`text-sm ${getAQITextColor(data.aqi)} opacity-75 mb-1`}>
              Primary Pollutant
            </div>
            <div className={`text-lg font-semibold ${getAQITextColor(data.aqi)}`}>
              {data.primaryPollutant}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className={`h-4 w-4 ${getAQITextColor(data.aqi)} opacity-75`} />
            <span className={`text-sm ${getAQITextColor(data.aqi)} opacity-75`}>
              Updated {new Date(data.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${getAQITextColor(data.aqi)} opacity-75`} />
            <span className={`text-sm ${getAQITextColor(data.aqi)} opacity-75`}>
              Live
            </span>
          </div>
        </div>
      </div>
      
      {/* AQI Scale Reference */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Good</span>
          <span>Moderate</span>
          <span>Unhealthy</span>
          <span>Hazardous</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden mt-1">
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-red-500"></div>
          <div className="flex-1 bg-purple-500"></div>
          <div className="flex-1 bg-red-700"></div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300+</span>
        </div>
      </div>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, AlertTriangle, Activity, Home, Baby } from "lucide-react";

interface HealthRecommendationsProps {
  aqi: number;
  category: string;
}

export const HealthRecommendations = ({ aqi, category }: HealthRecommendationsProps) => {
  const getRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        general: "Air quality is satisfactory. Perfect for outdoor activities!",
        sensitive: "Enjoy outdoor activities without restrictions.",
        activities: [
          { icon: Activity, text: "Running and jogging recommended", level: "safe" },
          { icon: Home, text: "Windows can be kept open", level: "safe" },
          { icon: Baby, text: "Safe for children to play outside", level: "safe" }
        ],
        color: "green"
      };
    } else if (aqi <= 100) {
      return {
        general: "Air quality is acceptable for most people.",
        sensitive: "Sensitive individuals may experience minor issues.",
        activities: [
          { icon: Activity, text: "Light outdoor exercise is fine", level: "caution" },
          { icon: Home, text: "Consider air purifiers indoors", level: "info" },
          { icon: Baby, text: "Monitor sensitive children", level: "caution" }
        ],
        color: "yellow"
      };
    } else if (aqi <= 150) {
      return {
        general: "Unhealthy for sensitive groups.",
        sensitive: "Sensitive people should limit outdoor activities.",
        activities: [
          { icon: Activity, text: "Reduce intense outdoor exercise", level: "warning" },
          { icon: Home, text: "Use air purifiers, close windows", level: "warning" },
          { icon: Baby, text: "Keep children indoors when possible", level: "warning" }
        ],
        color: "orange"
      };
    } else if (aqi <= 200) {
      return {
        general: "Unhealthy air quality affects everyone.",
        sensitive: "Everyone should limit outdoor activities.",
        activities: [
          { icon: Activity, text: "Avoid outdoor exercise", level: "danger" },
          { icon: Home, text: "Stay indoors, use air purification", level: "danger" },
          { icon: Baby, text: "Keep children and elderly indoors", level: "danger" }
        ],
        color: "red"
      };
    } else {
      return {
        general: "Very unhealthy to hazardous air quality.",
        sensitive: "Emergency conditions - avoid all outdoor activities.",
        activities: [
          { icon: Activity, text: "No outdoor activities recommended", level: "danger" },
          { icon: Home, text: "Seal windows, use high-grade filters", level: "danger" },
          { icon: Baby, text: "Everyone should remain indoors", level: "danger" }
        ],
        color: "purple"
      };
    }
  };

  const recommendations = getRecommendations(aqi);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "safe": return <Shield className="h-4 w-4 text-green-500" />;
      case "caution": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "danger": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Heart className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "safe": return "bg-green-100 text-green-800";
      case "info": return "bg-blue-100 text-blue-800";
      case "caution": return "bg-yellow-100 text-yellow-800";
      case "warning": return "bg-orange-100 text-orange-800";
      case "danger": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className={`h-5 w-5 text-${recommendations.color}-500`} />
        <h3 className="text-lg font-semibold">Health Recommendations</h3>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-800 mb-1">General Population</p>
          <p className="text-sm text-gray-600">{recommendations.general}</p>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">Sensitive Groups</p>
          <p className="text-sm text-blue-600">{recommendations.sensitive}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Activity Guidelines</h4>
          {recommendations.activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2 mt-0.5">
                {getLevelIcon(activity.level)}
                <activity.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.text}</p>
                <Badge className={`text-xs mt-1 ${getLevelBadgeColor(activity.level)}`}>
                  {activity.level}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
          <p className="text-xs text-gray-600 text-center">
            💡 Recommendations update automatically based on current air quality conditions
          </p>
        </div>
      </div>
    </Card>
  );
};

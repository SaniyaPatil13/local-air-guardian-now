
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AlertBannerProps {
  level: "info" | "warning" | "error";
  message: string;
}

export const AlertBanner = ({ level, message }: AlertBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getBannerStyles = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "warning":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIconColor = (level: string) => {
    switch (level) {
      case "info":
        return "text-blue-500";
      case "warning":
        return "text-orange-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return <Badge className="bg-blue-500 text-white">Info</Badge>;
      case "warning":
        return <Badge className="bg-orange-500 text-white">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-500 text-white">Alert</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Notice</Badge>;
    }
  };

  return (
    <div className={`border-l-4 p-4 ${getBannerStyles(level)} border-l-current`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className={`h-5 w-5 ${getIconColor(level)}`} />
          <div className="flex items-center space-x-2">
            {getLevelBadge(level)}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 p-0 hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

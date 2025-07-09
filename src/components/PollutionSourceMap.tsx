
import { Card } from "@/components/ui/card";
import { Factory, Car, Flame, Wind, MapPin, AlertTriangle, Truck, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock pollution source data for Indian context
const pollutionSources = [
  {
    id: 1,
    name: "Industrial Zone - Gurgaon",
    type: "industrial",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    severity: "high",
    pollutants: ["PM2.5", "SO2", "NO2"],
    contribution: 35,
    description: "Heavy industrial activities and manufacturing units"
  },
  {
    id: 2,
    name: "Delhi Traffic Corridor",
    type: "vehicular",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    severity: "very-high",
    pollutants: ["NO2", "CO", "PM2.5"],
    contribution: 45,
    description: "High density vehicular emissions on major highways"
  },
  {
    id: 3,
    name: "Stubble Burning - Punjab",
    type: "agricultural",
    coordinates: { lat: 30.7333, lng: 76.7794 },
    severity: "extreme",
    pollutants: ["PM2.5", "PM10"],
    contribution: 60,
    description: "Seasonal crop residue burning (Oct-Nov)"
  },
  {
    id: 4,
    name: "Power Plant - Dadri",
    type: "power",
    coordinates: { lat: 28.5706, lng: 77.5730 },
    severity: "high",
    pollutants: ["SO2", "PM10", "NO2"],
    contribution: 25,
    description: "Coal-fired thermal power generation"
  },
  {
    id: 5,
    name: "Construction Sites - Noida",
    type: "construction",
    coordinates: { lat: 28.5355, lng: 77.3910 },
    severity: "moderate",
    pollutants: ["PM10", "PM2.5"],
    contribution: 20,
    description: "Large-scale construction and dust generation"
  },
  {
    id: 6,
    name: "Landfill - Ghazipur",
    type: "waste",
    coordinates: { lat: 28.6508, lng: 77.3152 },
    severity: "high",
    pollutants: ["CH4", "PM2.5", "H2S"],
    contribution: 15,
    description: "Waste burning and methane emissions"
  }
];

export const PollutionSourceMap = () => {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'industrial': return <Factory className="h-4 w-4" />;
      case 'vehicular': return <Car className="h-4 w-4" />;
      case 'agricultural': return <Flame className="h-4 w-4" />;
      case 'power': return <Building className="h-4 w-4" />;
      case 'construction': return <Truck className="h-4 w-4" />;
      case 'waste': return <AlertTriangle className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very-high': return 'bg-red-500';
      case 'extreme': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-800 bg-green-100';
      case 'moderate': return 'text-yellow-800 bg-yellow-100';
      case 'high': return 'text-orange-800 bg-orange-100';
      case 'very-high': return 'text-red-800 bg-red-100';
      case 'extreme': return 'text-red-900 bg-red-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const totalContribution = pollutionSources.reduce((sum, source) => sum + source.contribution, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Factory className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-sm text-gray-600">Industrial Sources</div>
              <div className="text-xl font-bold">
                {pollutionSources.filter(s => s.type === 'industrial' || s.type === 'power').length}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600">Traffic Hotspots</div>
              <div className="text-xl font-bold">
                {pollutionSources.filter(s => s.type === 'vehicular').length}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-sm text-gray-600">Seasonal Sources</div>
              <div className="text-xl font-bold">
                {pollutionSources.filter(s => s.type === 'agricultural').length}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-sm text-gray-600">Critical Zones</div>
              <div className="text-xl font-bold">
                {pollutionSources.filter(s => s.severity === 'extreme' || s.severity === 'very-high').length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Pollution Source Heatmap</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Wind className="h-4 w-4" />
            <span>NCR Region Focus</span>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="relative bg-gradient-to-br from-red-100 to-orange-100 rounded-lg h-96 overflow-hidden mb-6">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gray-200"
                 style={{
                   backgroundImage: `
                     radial-gradient(circle at 30% 40%, rgba(239, 68, 68, 0.2) 0%, transparent 50%),
                     radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.2) 0%, transparent 50%),
                     radial-gradient(circle at 50% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)
                   `,
                   backgroundSize: '200px 200px, 150px 150px, 180px 180px'
                 }}>
            </div>
          </div>

          {/* Pollution Sources */}
          {pollutionSources.map((source, index) => (
            <div 
              key={source.id}
              className="absolute cursor-pointer group"
              style={{
                top: `${15 + (index * 12)}%`,
                left: `${20 + (index * 10) + Math.random() * 20}%`
              }}
            >
              <div className="relative">
                {/* Pulsing effect for high severity */}
                {(source.severity === 'extreme' || source.severity === 'very-high') && (
                  <div className={`absolute inset-0 ${getSeverityColor(source.severity)} rounded-full animate-ping opacity-30`}></div>
                )}
                
                <div className={`w-8 h-8 ${getSeverityColor(source.severity)} rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 relative z-10`}>
                  {getSourceIcon(source.type)}
                </div>
                
                {/* Tooltip */}
                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 w-48">
                  <div className="font-semibold">{source.name}</div>
                  <div className="text-gray-600 capitalize">{source.type} Source</div>
                  <div className="mt-1">
                    <Badge className={`text-xs ${getSeverityTextColor(source.severity)}`}>
                      {source.severity.replace('-', ' ')} severity
                    </Badge>
                  </div>
                  <div className="mt-1 text-gray-500">
                    Contribution: {source.contribution}%
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-semibold mb-2">Source Types</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Factory className="h-3 w-3 text-purple-600" />
                <span className="text-xs">Industrial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="h-3 w-3 text-blue-600" />
                <span className="text-xs">Vehicular</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="h-3 w-3 text-orange-600" />
                <span className="text-xs">Agricultural</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-3 w-3 text-gray-600" />
                <span className="text-xs">Power/Construction</span>
              </div>
            </div>
          </div>

          {/* Severity Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-semibold mb-2">Severity Scale</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Moderate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Very High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-700 rounded-full animate-pulse"></div>
                <span className="text-xs">Extreme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Source Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Pollution Source Analysis</h4>
          {pollutionSources
            .sort((a, b) => b.contribution - a.contribution)
            .map((source) => (
            <div key={source.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 ${getSeverityColor(source.severity)} rounded-full flex items-center justify-center text-white`}>
                    {getSourceIcon(source.type)}
                  </div>
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="text-sm text-gray-600">{source.description}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`text-xs ${getSeverityTextColor(source.severity)}`}>
                        {source.severity.replace('-', ' ')}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Pollutants: {source.pollutants.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{source.contribution}%</div>
                  <div className="text-xs text-gray-500">Contribution</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seasonal Alert */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-orange-800">Seasonal Alert</span>
          </div>
          <p className="text-sm text-orange-700">
            Stubble burning season (October-November) significantly impacts air quality in NCR region. 
            Expect AQI levels to spike during this period due to agricultural burning in Punjab and Haryana.
          </p>
        </div>
      </Card>
    </div>
  );
};

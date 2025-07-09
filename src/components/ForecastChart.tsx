
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, Brain, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ForecastData {
  date: string;
  aqi: number;
  confidence: number;
}

interface ForecastChartProps {
  data: ForecastData[];
}

export const ForecastChart = ({ data }: ForecastChartProps) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981"; // green
    if (aqi <= 100) return "#f59e0b"; // yellow
    if (aqi <= 150) return "#f97316"; // orange
    if (aqi <= 200) return "#ef4444"; // red
    if (aqi <= 300) return "#8b5cf6"; // purple
    return "#dc2626"; // dark red
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    if (aqi <= 300) return "Poor";
    if (aqi <= 400) return "Very Poor";
    return "Severe";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    if (date.toDateString() === dayAfter.toDateString()) return "Day After";
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const aqi = payload[0].value;
      const confidence = payload[0].payload.confidence;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-lg font-bold" style={{ color: getAQIColor(aqi) }}>
            AQI: {aqi}
          </p>
          <p className="text-xs text-gray-600">
            {getAQICategory(aqi)}
          </p>
          <div className="flex items-center mt-2">
            <Brain className="h-3 w-3 text-blue-500 mr-1" />
            <span className="text-xs text-blue-600">Confidence: {confidence}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const avgForecastAQI = Math.round(data.reduce((sum, item) => sum + item.aqi, 0) / data.length);
  const avgConfidence = Math.round(data.reduce((sum, item) => sum + item.confidence, 0) / data.length);
  const worstDay = data.reduce((max, item) => item.aqi > max.aqi ? item : max, data[0]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">3-Day Air Quality Forecast</h3>
          <Badge className="bg-purple-100 text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Next 3 Days</span>
          </div>
        </div>
      </div>

      {/* Forecast Alert */}
      {worstDay.aqi > 150 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-orange-800">Forecast Alert</span>
          </div>
          <p className="text-sm text-orange-700">
            Poor air quality expected on {formatDate(worstDay.date)} with AQI reaching {worstDay.aqi}. 
            Plan indoor activities and prepare protective measures.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Average Forecast</div>
          <div className="text-2xl font-bold" style={{ color: getAQIColor(avgForecastAQI) }}>
            {avgForecastAQI}
          </div>
          <div className="text-xs text-gray-500">{getAQICategory(avgForecastAQI)}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Prediction Confidence</div>
          <div className={`text-2xl font-bold ${avgConfidence > 80 ? 'text-green-600' : avgConfidence > 60 ? 'text-yellow-600' : 'text-orange-600'}`}>
            {avgConfidence}%
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Brain className="h-3 w-3 mr-1" />
            ML Model
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Worst Day</div>
          <div className="text-lg font-bold" style={{ color: getAQIColor(worstDay.aqi) }}>
            {formatDate(worstDay.date)}
          </div>
          <div className="text-xs" style={{ color: getAQIColor(worstDay.aqi) }}>
            AQI {worstDay.aqi}
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for AQI categories */}
            <ReferenceLine y={50} stroke="#10b981" strokeDasharray="2 2" opacity={0.5} />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="2 2" opacity={0.5} />
            <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="2 2" opacity={0.5} />
            
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#forecastGradient)"
            />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Forecast Details */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Daily Forecast Details</h4>
        {data.map((day) => (
          <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">{formatDate(day.date)}</div>
              <div className="text-sm text-gray-600">
                {getAQICategory(day.aqi)} • {day.confidence}% confidence
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: getAQIColor(day.aqi) }}>
                {day.aqi}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Brain className="h-3 w-3 mr-1" />
                AI Prediction
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Model Information */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="h-4 w-4 text-purple-600" />
          <span className="font-semibold text-purple-800">AI Forecasting Model</span>
        </div>
        <p className="text-sm text-gray-700">
          Predictions based on historical AQI patterns, meteorological data, seasonal trends, and satellite imagery. 
          Model trained on 3+ years of CPCB data with {avgConfidence}% average accuracy.
        </p>
        <div className="mt-2 text-xs text-gray-600">
          Factors: Weather patterns • Seasonal trends • Historical data • Pollution sources • Wind patterns
        </div>
      </div>
    </Card>
  );
};

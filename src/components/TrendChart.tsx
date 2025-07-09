
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar } from "lucide-react";

interface TrendData {
  date: string;
  aqi: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981"; // green
    if (aqi <= 100) return "#f59e0b"; // yellow
    if (aqi <= 150) return "#f97316"; // orange
    if (aqi <= 200) return "#ef4444"; // red
    if (aqi <= 300) return "#8b5cf6"; // purple
    return "#dc2626"; // dark red
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const aqi = payload[0].value;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-lg font-bold" style={{ color: getAQIColor(aqi) }}>
            AQI: {aqi}
          </p>
          <p className="text-xs text-gray-600">
            {aqi <= 50 ? 'Good' : 
             aqi <= 100 ? 'Moderate' : 
             aqi <= 150 ? 'Unhealthy for Sensitive' : 
             aqi <= 200 ? 'Unhealthy' : 
             aqi <= 300 ? 'Very Unhealthy' : 'Hazardous'}
          </p>
        </div>
      );
    }
    return null;
  };

  const averageAQI = Math.round(data.reduce((sum, item) => sum + item.aqi, 0) / data.length);
  const trend = data[data.length - 1].aqi - data[0].aqi;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Air Quality Trends</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Last 9 Days</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Average AQI</div>
          <div className="text-2xl font-bold" style={{ color: getAQIColor(averageAQI) }}>
            {averageAQI}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Current AQI</div>
          <div className="text-2xl font-bold" style={{ color: getAQIColor(data[data.length - 1].aqi) }}>
            {data[data.length - 1].aqi}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">7-Day Trend</div>
          <div className={`text-2xl font-bold ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
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
              domain={[0, 'dataMax + 20']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#aqiGradient)"
            />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AQI Reference Bands */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 mb-2">AQI Reference Levels</div>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div className="flex-1 bg-green-500 flex items-center justify-center text-white text-xs font-medium">Good</div>
          <div className="flex-1 bg-yellow-500 flex items-center justify-center text-white text-xs font-medium">Moderate</div>
          <div className="flex-1 bg-orange-500 flex items-center justify-center text-white text-xs font-medium">Unhealthy</div>
          <div className="flex-1 bg-red-500 flex items-center justify-center text-white text-xs font-medium">Very Unhealthy</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200+</span>
        </div>
      </div>
    </Card>
  );
};

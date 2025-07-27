import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subHours, startOfDay, endOfDay } from 'date-fns';

interface GlucoseReading {
  timestamp: string;
  glucose: number;
  trend: 'rising' | 'falling' | 'stable';
  notes?: string;
}

interface CGMChartProps {
  timeRange?: 'day' | 'week' | 'month';
  showTrends?: boolean;
  height?: number;
}

const CGMChart: React.FC<CGMChartProps> = ({ 
  timeRange = 'day', 
  showTrends = true,
  height = 300 
}) => {
  const [glucoseData, setGlucoseData] = useState<GlucoseReading[]>([]);
  const [currentGlucose, setCurrentGlucose] = useState<number>(95);
  const [currentTrend, setCurrentTrend] = useState<'rising' | 'falling' | 'stable'>('stable');
  const [timeInRange, setTimeInRange] = useState<number>(78);

  useEffect(() => {
    // Generate mock CGM data based on time range
    const mockData = generateMockCGMData(timeRange);
    setGlucoseData(mockData);
    
    // Set current reading (latest value)
    if (mockData.length > 0) {
      const latest = mockData[mockData.length - 1];
      setCurrentGlucose(latest.glucose);
      setCurrentTrend(latest.trend);
    }
  }, [timeRange]);

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return { status: 'low', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (glucose > 180) return { status: 'high', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { status: 'normal', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const status = getGlucoseStatus(currentGlucose);

  // Prepare chart data
  const chartData = {
    labels: glucoseData.map(reading => 
      timeRange === 'day' 
        ? format(new Date(reading.timestamp), 'HH:mm')
        : timeRange === 'week'
          ? format(new Date(reading.timestamp), 'EEE HH:mm')
          : format(new Date(reading.timestamp), 'MMM d')
    ),
    datasets: [
      {
        label: 'Blood Glucose (mg/dL)',
        data: glucoseData.map(reading => reading.glucose),
        borderColor: 'rgba(59, 130, 246, 1)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: glucoseData.map(reading => {
          if (reading.glucose < 70) return 'rgba(239, 68, 68, 1)'; // red for low
          if (reading.glucose > 180) return 'rgba(249, 115, 22, 1)'; // orange for high
          return 'rgba(34, 197, 94, 1)'; // green for normal
        }),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 5,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const status = value < 70 ? 'Low' : value > 180 ? 'High' : 'Normal';
            return `${value} mg/dL (${status})`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 60,
        max: 200,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          callback: function(value: any) {
            return value + ' mg/dL';
          }
        },
        // Add reference lines
        afterDraw: function(chart: any) {
          const ctx = chart.ctx;
          const yScale = chart.scales.y;
          
          // Target range lines (70-180 mg/dL)
          ctx.save();
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)'; // green
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          
          // Lower target line (70)
          const y70 = yScale.getPixelForValue(70);
          ctx.beginPath();
          ctx.moveTo(chart.chartArea.left, y70);
          ctx.lineTo(chart.chartArea.right, y70);
          ctx.stroke();
          
          // Upper target line (180)
          const y180 = yScale.getPixelForValue(180);
          ctx.beginPath();
          ctx.moveTo(chart.chartArea.left, y180);
          ctx.lineTo(chart.chartArea.right, y180);
          ctx.stroke();
          
          ctx.restore();
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          maxTicksLimit: timeRange === 'day' ? 8 : 10
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Continuous Glucose Monitor
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {timeRange} view
            </p>
          </div>
        </div>
        
        {showTrends && (
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
              {getTrendIcon(currentTrend)}
              <span className="ml-1">{currentGlucose} mg/dL</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current reading
            </p>
          </div>
        )}
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
          <p className={`text-xl font-bold ${status.color}`}>
            {currentGlucose}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">mg/dL</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Time in Range</p>
          <p className="text-xl font-bold text-green-500">
            {timeInRange}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">70-180 mg/dL</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Glucose</p>
          <p className="text-xl font-bold text-blue-500">
            {Math.round(glucoseData.reduce((sum, r) => sum + r.glucose, 0) / glucoseData.length) || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">mg/dL</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Reference Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Info className="w-3 h-3 mr-1" />
          <span>Target range: 70-180 mg/dL</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <span>Low (&lt;70)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>Normal (70-180)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
            <span>High (&gt;180)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Generate mock CGM data
function generateMockCGMData(timeRange: 'day' | 'week' | 'month'): GlucoseReading[] {
  const now = new Date();
  const data: GlucoseReading[] = [];
  
  let intervals: number;
  let intervalMinutes: number;
  
  switch (timeRange) {
    case 'day':
      intervals = 96; // Every 15 minutes for 24 hours
      intervalMinutes = 15;
      break;
    case 'week':
      intervals = 168; // Every hour for 7 days
      intervalMinutes = 60;
      break;
    case 'month':
      intervals = 120; // Every 6 hours for 30 days
      intervalMinutes = 360;
      break;
  }
  
  for (let i = intervals; i >= 0; i--) {
    const timestamp = subHours(now, (i * intervalMinutes) / 60);
    
    // Generate realistic glucose patterns
    const hour = timestamp.getHours();
    let baseGlucose = 95;
    
    // Meal spikes
    if (hour >= 7 && hour <= 9) baseGlucose += 25; // Breakfast
    if (hour >= 12 && hour <= 14) baseGlucose += 20; // Lunch
    if (hour >= 18 && hour <= 20) baseGlucose += 22; // Dinner
    
    // Dawn phenomenon
    if (hour >= 4 && hour <= 6) baseGlucose += 10;
    
    // Add some randomness
    const glucose = Math.max(65, Math.min(200, baseGlucose + (Math.random() - 0.5) * 20));
    
    // Determine trend
    let trend: 'rising' | 'falling' | 'stable' = 'stable';
    if (i > 0) {
      const prevGlucose = data.length > 0 ? data[data.length - 1].glucose : glucose;
      const diff = glucose - prevGlucose;
      if (diff > 5) trend = 'rising';
      else if (diff < -5) trend = 'falling';
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      glucose: Math.round(glucose),
      trend
    });
  }
  
  return data;
}

export default CGMChart;
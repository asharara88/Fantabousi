import React from 'react';
import { Activity, TrendingUp, Droplets, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import CGMChart from '../components/health/CGMChart';
import BloodGlucoseTrendSheet from '../components/health/BloodGlucoseTrendSheet';

const MetabolismPage: React.FC = () => {
  // Mock metabolic health data
  const metabolicMetrics = {
    averageGlucose: 98,
    timeInRange: 78,
    glucoseVariability: 12,
    insulinSensitivity: 85
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Metabolic Health</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your glucose levels and metabolic indicators</p>
        </div>

        {/* Metabolic Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Glucose</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metabolicMetrics.averageGlucose}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">mg/dL</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time in Range</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metabolicMetrics.timeInRange}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">70-180 mg/dL</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Droplets className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Variability</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metabolicMetrics.glucoseVariability}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CV</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Insulin Sensitivity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metabolicMetrics.insulinSensitivity}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
          </Card>
        </div>

        {/* CGM Real-time Chart */}
        <div className="mb-8">
          <CGMChart 
            timeRange="day"
            showTrends={true}
            height={320}
          />
        </div>

        {/* Blood Glucose Trend Sheet */}
        <div className="mb-8">
          <BloodGlucoseTrendSheet />
        </div>

        {/* Metabolic Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metabolic Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Patterns</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Stable fasting glucose levels
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Post-meal spikes within normal range
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Good overnight glucose stability
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Consider timing carbohydrates around workouts</li>
                <li>• Monitor post-dinner glucose responses</li>
                <li>• Maintain consistent meal timing</li>
                <li>• Continue current exercise routine</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MetabolismPage;
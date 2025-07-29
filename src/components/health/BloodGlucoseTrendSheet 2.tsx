/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrendingUp, TrendingDown, Minus, Calendar, Clock, Target, AlertTriangle } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';

interface GlucoseEntry {
  date: string;
  time: string;
  glucose: number;
  context: 'fasting' | 'pre-meal' | 'post-meal' | 'bedtime' | 'random';
  notes?: string;
}

interface DailyStats {
  date: string;
  average: number;
  min: number;
  max: number;
  timeInRange: number;
  readings: number;
}

interface BloodGlucoseTrendSheetProps {
  weekStartDate?: Date;
}

const BloodGlucoseTrendSheet: React.FC<BloodGlucoseTrendSheetProps> = ({ 
  weekStartDate = new Date() 
}) => {
  const [weekData, setWeekData] = useState<DailyStats[]>([]);
  const [detailedEntries, setDetailedEntries] = useState<GlucoseEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(weekStartDate));

  useEffect(() => {
    generateWeekData();
  }, [currentWeek]);

  const generateWeekData = () => {
    const weekStats: DailyStats[] = [];
    const allEntries: GlucoseEntry[] = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeek, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Generate daily glucose entries
      const dailyEntries = generateDailyEntries(date);
      allEntries.push(...dailyEntries);
      
      // Calculate daily statistics
      const glucoseValues = dailyEntries.map(e => e.glucose);
      const average = glucoseValues.reduce((sum, val) => sum + val, 0) / glucoseValues.length;
      const min = Math.min(...glucoseValues);
      const max = Math.max(...glucoseValues);
      const inRange = glucoseValues.filter(val => val >= 70 && val <= 180).length;
      const timeInRange = (inRange / glucoseValues.length) * 100;

      weekStats.push({
        date: dateStr,
        average: Math.round(average),
        min,
        max,
        timeInRange: Math.round(timeInRange),
        readings: glucoseValues.length
      });
    }

    setWeekData(weekStats);
    setDetailedEntries(allEntries);
  };

  const generateDailyEntries = (date: Date): GlucoseEntry[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entries: GlucoseEntry[] = [];
    
    // Fasting glucose (7 AM)
    entries.push({
      date: dateStr,
      time: '07:00',
      glucose: Math.round(85 + (Math.random() - 0.5) * 20),
      context: 'fasting'
    });

    // Pre-breakfast (7:30 AM)
    entries.push({
      date: dateStr,
      time: '07:30',
      glucose: Math.round(90 + (Math.random() - 0.5) * 15),
      context: 'pre-meal'
    });

    // Post-breakfast (9:00 AM)
    entries.push({
      date: dateStr,
      time: '09:00',
      glucose: Math.round(125 + (Math.random() - 0.5) * 30),
      context: 'post-meal'
    });

    // Pre-lunch (12:00 PM)
    entries.push({
      date: dateStr,
      time: '12:00',
      glucose: Math.round(95 + (Math.random() - 0.5) * 20),
      context: 'pre-meal'
    });

    // Post-lunch (2:00 PM)
    entries.push({
      date: dateStr,
      time: '14:00',
      glucose: Math.round(130 + (Math.random() - 0.5) * 35),
      context: 'post-meal'
    });

    // Pre-dinner (6:00 PM)
    entries.push({
      date: dateStr,
      time: '18:00',
      glucose: Math.round(100 + (Math.random() - 0.5) * 25),
      context: 'pre-meal'
    });

    // Post-dinner (8:00 PM)
    entries.push({
      date: dateStr,
      time: '20:00',
      glucose: Math.round(135 + (Math.random() - 0.5) * 40),
      context: 'post-meal'
    });

    // Bedtime (10:00 PM)
    entries.push({
      date: dateStr,
      time: '22:00',
      glucose: Math.round(110 + (Math.random() - 0.5) * 25),
      context: 'bedtime'
    });

    return entries;
  };

  const getGlucoseStatusColor = (glucose: number) => {
    if (glucose < 70) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (glucose > 180) return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
    if (glucose > 140) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-green-500 bg-green-50 dark:bg-green-900/20';
  };

  const getContextLabel = (context: string) => {
    const labels = {
      'fasting': 'Fasting',
      'pre-meal': 'Pre-meal',
      'post-meal': 'Post-meal',
      'bedtime': 'Bedtime',
      'random': 'Random'
    };
    return labels[context] || context;
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'fasting':
        return <Clock className="w-3 h-3" />;
      case 'pre-meal':
      case 'post-meal':
        return <Target className="w-3 h-3" />;
      case 'bedtime':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = addDays(currentWeek, direction === 'next' ? 7 : -7);
    setCurrentWeek(newWeek);
    setSelectedDate(null);
  };

  const getSelectedDayEntries = () => {
    if (!selectedDate) return [];
    return detailedEntries.filter(entry => entry.date === selectedDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Blood Glucose Trend Sheet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Week of {format(currentWeek, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              →
            </Button>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-7 gap-2">
          {weekData.map((day, index) => {
            const date = addDays(currentWeek, index);
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate === day.date;
            
            return (
              <motion.button
                key={day.date}
                onClick={() => setSelectedDate(isSelected ? null : day.date)}
                className={`p-3 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${isToday ? 'ring-2 ring-primary/30' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {format(date, 'EEE')}
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {format(date, 'd')}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className={`text-xs font-medium px-2 py-0.5 rounded ${getGlucoseStatusColor(day.average)}`}>
                      {day.average} mg/dL
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {day.timeInRange}% in range
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Weekly Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weekly Average</p>
          <p className="text-2xl font-bold text-blue-500">
            {Math.round(weekData.reduce((sum, day) => sum + day.average, 0) / weekData.length) || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">mg/dL</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time in Range</p>
          <p className="text-2xl font-bold text-green-500">
            {Math.round(weekData.reduce((sum, day) => sum + day.timeInRange, 0) / weekData.length) || 0}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">70-180 mg/dL</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Highest Reading</p>
          <p className="text-2xl font-bold text-orange-500">
            {Math.max(...weekData.map(day => day.max)) || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">mg/dL</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Readings</p>
          <p className="text-2xl font-bold text-purple-500">
            {weekData.reduce((sum, day) => sum + day.readings, 0)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">this week</p>
        </Card>
      </div>

      {/* Detailed Day View */}
      {selectedDate && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Detailed View - {format(new Date(selectedDate), 'EEEE, MMM d, yyyy')}
          </h4>
          
          <div className="space-y-3">
            {getSelectedDayEntries().map((entry, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  {getContextIcon(entry.context)}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getContextLabel(entry.context)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.time}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGlucoseStatusColor(entry.glucose)}`}>
                    {entry.glucose} mg/dL
                  </span>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Reference Information */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Blood Glucose Reference Ranges
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
              <div>
                <p><strong>Normal ranges:</strong></p>
                <ul className="mt-1 space-y-1">
                  <li>• Fasting: 70-100 mg/dL</li>
                  <li>• Post-meal (2hr): &lt;140 mg/dL</li>
                  <li>• Bedtime: 100-140 mg/dL</li>
                </ul>
              </div>
              <div>
                <p><strong>Target ranges:</strong></p>
                <ul className="mt-1 space-y-1">
                  <li>• Time in Range: &gt;70%</li>
                  <li>• Time below 70: &lt;4%</li>
                  <li>• Time above 180: &lt;25%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BloodGlucoseTrendSheet;
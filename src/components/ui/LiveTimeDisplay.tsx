import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LiveTimeDisplayProps {
  className?: string;
  showBedtimeCountdown?: boolean;
  bedtimeHour?: number; // 23 for 11 PM
  variant?: 'default' | 'compact' | 'full';
}

const LiveTimeDisplay: React.FC<LiveTimeDisplayProps> = ({
  className,
  showBedtimeCountdown = true,
  bedtimeHour = 23, // 11 PM
  variant = 'default'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bedtimeCountdown, setBedtimeCountdown] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isNextDay: boolean;
  } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      if (showBedtimeCountdown) {
        const bedtime = new Date();
        bedtime.setHours(bedtimeHour, 0, 0, 0);
        
        // If bedtime has passed today, set it for tomorrow
        const isNextDay = now > bedtime;
        if (isNextDay) {
          bedtime.setDate(bedtime.getDate() + 1);
        }
        
        const timeDiff = bedtime.getTime() - now.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setBedtimeCountdown({ hours, minutes, seconds, isNextDay });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [showBedtimeCountdown, bedtimeHour]);

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (time: Date) => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 5) return 'Rest well';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 22) return 'Good evening';
    return 'Wind down time';
  };

  const getTimeOfDayIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 22 || hour < 6) return <Moon className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  if (variant === 'compact') {
    return (
      <motion.div 
        className={cn(
          "flex items-center space-x-3 px-4 py-2",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "rounded-2xl shadow-lg",
          className
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          {getTimeOfDayIcon()}
          <span className="font-mono text-sm tracking-wider">
            {formatTime(currentTime)}
          </span>
        </div>
        
        {showBedtimeCountdown && bedtimeCountdown && (
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Moon className="w-3 h-3" />
            <span className="font-mono text-xs">
              {bedtimeCountdown.hours}h {bedtimeCountdown.minutes}m
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div 
        className={cn(
          "p-8 bg-gradient-to-br from-white/20 via-white/10 to-transparent",
          "backdrop-blur-2xl border border-white/30",
          "rounded-3xl shadow-2xl relative overflow-hidden",
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />
        
        <div className="relative z-10 space-y-6">
          {/* Greeting */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {getTimeOfDayIcon()}
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {getTimeOfDayGreeting()}, Ahmed!
            </span>
          </motion.div>

          {/* Current Time */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="font-mono text-4xl font-light text-gray-900 dark:text-gray-100 tracking-wider">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(currentTime)}</span>
            </div>
          </motion.div>

          {/* Bedtime Countdown */}
          {showBedtimeCountdown && bedtimeCountdown && (
            <motion.div 
              className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Time to bedtime
                  </span>
                </div>
                <div className="font-mono text-lg text-indigo-800 dark:text-indigo-200">
                  {bedtimeCountdown.hours.toString().padStart(2, '0')}:
                  {bedtimeCountdown.minutes.toString().padStart(2, '0')}:
                  {bedtimeCountdown.seconds.toString().padStart(2, '0')}
                </div>
              </div>
              {bedtimeCountdown.isNextDay && (
                <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                  Tomorrow's bedtime
                </div>
              )}
            </motion.div>
          )}

          {/* Motivational Note */}
          <motion.div 
            className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              🎯 Another day, another win!
            </span>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div 
      className={cn(
        "p-6 bg-white/15 backdrop-blur-xl border border-white/25",
        "rounded-2xl shadow-xl relative overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-purple-500/3 rounded-2xl" />
      
      <div className="relative z-10 space-y-4">
        {/* Greeting and Time */}
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {getTimeOfDayIcon()}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getTimeOfDayGreeting()}
            </span>
          </motion.div>
          
          <motion.div 
            className="font-mono text-xl font-light text-gray-900 dark:text-gray-100 tracking-wide"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {formatTime(currentTime)}
          </motion.div>
        </div>

        {/* Date */}
        <motion.div 
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(currentTime)}</span>
        </motion.div>

        {/* Bedtime Countdown */}
        {showBedtimeCountdown && bedtimeCountdown && (
          <motion.div 
            className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm text-indigo-700 dark:text-indigo-300">
                Bedtime countdown
              </span>
            </div>
            <div className="font-mono text-sm text-indigo-800 dark:text-indigo-200">
              {bedtimeCountdown.hours}h {bedtimeCountdown.minutes}m {bedtimeCountdown.seconds}s
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LiveTimeDisplay;

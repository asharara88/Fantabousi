/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Doughnut } from 'react-chartjs-2';
import ProgressRing from './ProgressRing';

interface StatisticsGridProps {
  nutritionData: {
    calories: { consumed: number; goal: number };
    macros: { protein: number; carbs: number; fat: number };
    water: { consumed: number; goal: number };
  };
  sleepData: {
    hours: number;
    quality: number;
    deepSleep: number;
    remSleep: number;
  };
}

const StatisticsGrid: React.FC<StatisticsGridProps> = ({ nutritionData, sleepData }) => {
  // Nutrition chart data
  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          nutritionData.macros.protein * 4, // 4 calories per gram
          nutritionData.macros.carbs * 4,   // 4 calories per gram
          nutritionData.macros.fat * 9      // 9 calories per gram
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(16, 185, 129, 0.8)', // green-500
          'rgba(239, 68, 68, 0.8)'   // red-500
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15
      }
    ]
  };

  // Sleep chart data
  const sleepChartData = {
    labels: ['Deep Sleep', 'REM Sleep', 'Light Sleep'],
    datasets: [
      {
        data: [
          sleepData.deepSleep,
          sleepData.remSleep,
          sleepData.hours - sleepData.deepSleep - sleepData.remSleep
        ],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)', // indigo-600
          'rgba(139, 92, 246, 0.8)', // violet-500
          'rgba(165, 180, 252, 0.8)' // indigo-300
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(165, 180, 252, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / sum) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        },
        onClick: (e: any, legendItem: any, legend: any) => {
          const index = legendItem.index;
          const ci = legend.chart;
          
          // Toggle visibility
          if (ci.getDatasetMeta(0).data[index].hidden) {
            ci.getDatasetMeta(0).data[index].hidden = false;
          } else {
            ci.getDatasetMeta(0).data[index].hidden = true;
          }
          ci.update();
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000
    }
  };

  // Calculate percentages
  const caloriePercentage = Math.min(100, Math.round((nutritionData.calories.consumed / nutritionData.calories.goal) * 100));
  const waterPercentage = Math.min(100, Math.round((nutritionData.water.consumed / nutritionData.water.goal) * 100));
  const sleepQualityPercentage = Math.min(100, sleepData.quality);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Calories Card */}
      <Card className="p-5 h-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Calories</h3>
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <ProgressRing progress={caloriePercentage} color="rgba(59, 130, 246, 1)">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{caloriePercentage}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">of goal</p>
              </div>
            </ProgressRing>
          </motion.div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">{nutritionData.calories.consumed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Consumed</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">{nutritionData.calories.goal}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Goal</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">{nutritionData.calories.goal - nutritionData.calories.consumed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
          </div>
        </div>
      </Card>

      {/* Macros Card */}
      <Card className="p-5 h-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Macronutrients</h3>
        <div className="h-48 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
            className="w-full h-full"
            whileHover={{ scale: 1.03 }}
          >
            <Doughnut data={macroChartData} options={chartOptions} />
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
            <p className="font-medium text-gray-900 dark:text-white">{nutritionData.macros.protein}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
            <p className="font-medium text-gray-900 dark:text-white">{nutritionData.macros.carbs}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fat</p>
            <p className="font-medium text-gray-900 dark:text-white">{nutritionData.macros.fat}g</p>
          </div>
        </div>
      </Card>

      {/* Sleep Card */}
      <Card className="p-5 h-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sleep Analysis</h3>
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{sleepData.hours}h</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sleep</p>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <ProgressRing 
              progress={sleepQualityPercentage} 
              size={80} 
              strokeWidth={6}
              color="rgba(79, 70, 229, 1)"
            >
              <p className="text-sm font-bold">{sleepQualityPercentage}%</p>
            </ProgressRing>
          </motion.div>
        </div>
        <div className="h-32 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
            className="w-full h-full"
            whileHover={{ scale: 1.03 }}
          >
            <Doughnut data={sleepChartData} options={chartOptions} />
          </motion.div>
        </div>
      </Card>

      {/* Water Intake Card */}
      <Card className="p-5 md:col-span-2 lg:col-span-1 h-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Water Intake</h3>
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
          >
            <ProgressRing progress={waterPercentage} color="rgba(14, 165, 233, 1)">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{nutritionData.water.consumed}L</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">of {nutritionData.water.goal}L</p>
              </div>
            </ProgressRing>
          </motion.div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
          <motion.div 
            className="bg-sky-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${waterPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0L</span>
          <span>{nutritionData.water.goal}L</span>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsGrid;
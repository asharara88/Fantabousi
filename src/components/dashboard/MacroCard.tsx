import React from 'react';

interface MacroCardProps {
  protein: number;
  carbs: number;
  fat: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
}

const MacroCard: React.FC<MacroCardProps> = ({ 
  protein,
  carbs,
  fat,
  goalProtein,
  goalCarbs,
  goalFat
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">Macronutrients</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-600 dark:text-indigo-400">Protein</span>
          <span className="font-bold">{protein}g <span className="text-gray-400">/ {goalProtein}g</span></span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-cyan-600 dark:text-cyan-400">Carbs</span>
          <span className="font-bold">{carbs}g <span className="text-gray-400">/ {goalCarbs}g</span></span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-pink-600 dark:text-pink-400">Fat</span>
          <span className="font-bold">{fat}g <span className="text-gray-400">/ {goalFat}g</span></span>
        </div>
      </div>
    </div>
  );
};

export default MacroCard;
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Sparkles, Clock, Target, Zap, Play, RefreshCw } from 'lucide-react';
import { aiWorkoutPlannerApi, WorkoutPlan, Exercise } from '../../api/aiWorkoutPlannerApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface AIWorkoutGeneratorProps {
  onWorkoutGenerated?: (workout: WorkoutPlan) => void;
}

const AIWorkoutGenerator: React.FC<AIWorkoutGeneratorProps> = ({ onWorkoutGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [preferences, setPreferences] = useState({
    goal: 'muscle_building',
    experience: 'intermediate',
    duration: 45,
    equipment: [] as string[],
    targetMuscles: [] as string[]
  });

  const goals = [
    { value: 'muscle_building', label: 'Muscle Building' },
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'flexibility', label: 'Flexibility' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const equipment = [
    'dumbbells', 'barbell', 'resistance_bands', 'pull_up_bar', 
    'kettlebell', 'bodyweight', 'cable_machine', 'treadmill'
  ];

  const _muscleGroups = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 
    'quads', 'hamstrings', 'glutes', 'calves', 'abs'
  ];

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    try {
      const workout = await aiWorkoutPlannerApi.generateWorkoutPlan(preferences);
      if (workout) {
        setGeneratedWorkout(workout);
        onWorkoutGenerated?.(workout);
      }
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Workout Generator</h3>
          <p className="text-gray-600 dark:text-gray-400">Generate personalized workouts based on your goals</p>
        </div>
      </div>

      {/* Preferences Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Goal
          </label>
          <select
            value={preferences.goal}
            onChange={(e) => setPreferences(prev => ({ ...prev, goal: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {goals.map(goal => (
              <option key={goal.value} value={goal.value}>{goal.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Experience Level
          </label>
          <select
            value={preferences.experience}
            onChange={(e) => setPreferences(prev => ({ ...prev, experience: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="15"
            max="120"
            value={preferences.duration}
            onChange={(e) => setPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Equipment
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {equipment.map(item => (
              <label key={item} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={preferences.equipment.includes(item)}
                  onChange={(e) => {
                    const newEquipment = e.target.checked
                      ? [...preferences.equipment, item]
                      : preferences.equipment.filter(eq => eq !== item);
                    setPreferences(prev => ({ ...prev, equipment: newEquipment }));
                  }}
                  className="mr-2 rounded"
                />
                {item.replace('_', ' ')}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateWorkout}
        disabled={isGenerating}
        className="w-full mb-6"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Generating AI Workout...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Workout
          </>
        )}
      </Button>

      {/* Generated Workout Display */}
      {generatedWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {generatedWorkout.name}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {generatedWorkout.duration} min
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                {generatedWorkout.difficulty}
              </div>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {generatedWorkout.description}
          </p>

          {/* Target Muscles */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Target Muscles</h5>
            <div className="flex flex-wrap gap-2">
              {generatedWorkout.targetMuscles.map(muscle => (
                <span
                  key={muscle}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Exercises</h5>
            <div className="space-y-3">
              {generatedWorkout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id || index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </h6>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {exercise.description}
                  </p>
                  {exercise.muscleGroups && (
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscleGroups.map(muscle => (
                        <span
                          key={muscle}
                          className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <Button variant="outline" className="flex-1">
              <Target className="w-4 h-4 mr-2" />
              View Muscle Targeting
            </Button>
            <Button className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default AIWorkoutGenerator;
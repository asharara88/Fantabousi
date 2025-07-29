/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Target, Activity, RefreshCw } from 'lucide-react';
import { muscleGroupApi, MuscleGroupVisualization as MuscleGroupVisualizationType, RecoveryState } from '../../api/muscleGroupApi';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface MuscleGroupVisualizationProps {
  exerciseName?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  recoveryStates?: RecoveryState[];
  mode: 'exercise' | 'recovery';
  height?: number;
}

const MuscleGroupVisualization: React.FC<MuscleGroupVisualizationProps> = ({
  exerciseName,
  primaryMuscles = [],
  secondaryMuscles = [],
  recoveryStates = [],
  mode,
  height = 400
}) => {
  const [visualization, setVisualization] = useState<MuscleGroupVisualizationType | null>(null);
  const [recoveryImages, setRecoveryImages] = useState<any[]>([]);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'exercise' && (primaryMuscles.length > 0 || secondaryMuscles.length > 0)) {
      loadExerciseVisualization();
    } else if (mode === 'recovery' && recoveryStates.length > 0) {
      loadRecoveryVisualization();
    }
  }, [primaryMuscles, secondaryMuscles, recoveryStates, mode]);

  const loadExerciseVisualization = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get base image
      const base = await muscleGroupApi.getBaseImage(false);
      setBaseImage(base);

      // Get muscle group visualization
      const vis = await muscleGroupApi.getExerciseMuscleVisualization(
        primaryMuscles,
        secondaryMuscles
      );
      setVisualization(vis);
    } catch (err) {
      console.error('Error loading exercise visualization:', err);
      setError('Failed to load muscle group visualization');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecoveryVisualization = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get base image
      const base = await muscleGroupApi.getBaseImage(false);
      setBaseImage(base);

      // Get recovery visualization
      const images = await muscleGroupApi.getRecoveryVisualization(recoveryStates);
      setRecoveryImages(images);
    } catch (err) {
      console.error('Error loading recovery visualization:', err);
      setError('Failed to load recovery visualization');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (mode === 'exercise') {
      loadExerciseVisualization();
    } else {
      loadRecoveryVisualization();
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 text-center" style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading muscle visualization...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center" style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-primary/10 mr-3">
            {mode === 'exercise' ? (
              <Target className="w-5 h-5 text-primary" />
            ) : (
              <Activity className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'exercise' ? 'Target Muscles' : 'Recovery Status'}
            </h3>
            {exerciseName && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{exerciseName}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          aria-label="Refresh visualization"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Muscle Group Visualization */}
      <div className="relative" style={{ height: height - 120 }}>
        {baseImage && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={baseImage}
              alt="Human body outline"
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        )}

        {/* Exercise Mode - Primary and Secondary Muscles */}
        {mode === 'exercise' && visualization && (
          <>
            {/* Primary muscles (red) */}
            {visualization.primary.map((muscle, index) => (
              <motion.div
                key={`primary-${muscle.muscleGroup}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <img
                  src={muscle.imageUrl}
                  alt={`${muscle.muscleGroup} (primary)`}
                  className="max-h-full max-w-full object-contain"
                />
              </motion.div>
            ))}

            {/* Secondary muscles (orange) */}
            {visualization.secondary.map((muscle, index) => (
              <motion.div
                key={`secondary-${muscle.muscleGroup}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <img
                  src={muscle.imageUrl}
                  alt={`${muscle.muscleGroup} (secondary)`}
                  className="max-h-full max-w-full object-contain"
                />
              </motion.div>
            ))}
          </>
        )}

        {/* Recovery Mode - Recovery State Colors */}
        {mode === 'recovery' && recoveryImages.map((muscle, index) => (
          <motion.div
            key={`recovery-${muscle.muscleGroup}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img
              src={muscle.imageUrl}
              alt={`${muscle.muscleGroup} recovery`}
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {mode === 'exercise' ? (
          <div className="flex flex-wrap gap-4 text-sm">
            {primaryMuscles.length > 0 && (
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>Primary: {primaryMuscles.join(', ')}</span>
              </div>
            )}
            {secondaryMuscles.length > 0 && (
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                <span>Secondary: {secondaryMuscles.join(', ')}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Excellent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span>Poor</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Needs Rest</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MuscleGroupVisualization;
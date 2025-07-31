import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, BookOpen, Brain, Heart, Activity, Moon, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EvidenceBasedHealthOptimizationProps {
  expanded?: boolean;
}

const EvidenceBasedHealthOptimization: React.FC<EvidenceBasedHealthOptimizationProps> = ({ 
  expanded = false 
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(expanded);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-all duration-300">
      <div className="mobile-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Biowell Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-400 dark:from-blue-500 dark:to-blue-300">
              Evidence-Based Health Optimization
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Using scientifically proven methods to improve your health and wellness
            </p>
            {!isExpanded && (
              <Button 
                onClick={() => setIsExpanded(true)} 
                className="mt-6"
              >
                Learn More
              </Button>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    What is Evidence-Based Health Optimization?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Evidence-based health optimization means using scientifically proven methods to improve your health. 
                    It focuses on strategies that have been tested and validated through research, helping you make 
                    decisions that are more likely to be effective for long-term health.
                  </p>

                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Key Principles:
                  </h4>
            
                  <div className="space-y-6">
                    {/* Scientific Backing */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => toggleSection('scientific')}
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">Scientific Backing</h5>
                        </div>
                        <div>
                          {expandedSection === 'scientific' ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                
                <AnimatePresence>
                  {expandedSection === 'scientific' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          All health recommendations are based on solid research. Whether it's about sleep, nutrition, 
                          fitness, or supplements, each method is grounded in evidence from clinical studies.
                        </p>
                        
                        <h4>Scientific Process Behind Recommendations</h4>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          We base our recommendations on the latest research, which is constantly evolving. Premium users 
                          receive updates on the latest scientific research relevant to their personal health profile, 
                          ensuring their recommendations stay current with cutting-edge discoveries.
                        </p>
                        
                        <h4>Tiered Evidence System for Dietary Supplements</h4>
                        
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-start">
                            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-green-800 text-xs font-bold">A</span>
                            </span>
                            <span><strong>Green Tier</strong>: Proven to work - backed by solid research and widely recommended by experts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-yellow-800 text-xs font-bold">B</span>
                            </span>
                            <span><strong>Yellow Tier</strong>: Promising results - some good studies available, but more research needed</span>
                          </li>
                          <li className="flex items-start">
                            <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-orange-800 text-xs font-bold">C</span>
                            </span>
                            <span><strong>Orange Tier</strong>: Early research - limited studies so far, but shows potential</span>
                          </li>
                        </ul>
                        
                        <p className="text-gray-700 dark:text-gray-300">
                          We draw from reputable sources like peer-reviewed journals and clinical trials to ensure that 
                          you're getting information that works and is backed by science.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                    {/* Whole-Person Health */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => toggleSection('whole-person')}
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
                            <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">Whole-Person Health</h5>
                        </div>
                        <div>
                          {expandedSection === 'whole-person' ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                
                <AnimatePresence>
                  {expandedSection === 'whole-person' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <p className="text-gray-700 dark:text-gray-300">
                          Health optimization isn't just about one area—it looks at your overall well-being. 
                          Improving sleep, eating well, staying active, and managing stress all work together 
                          to enhance your health. We consider the interconnections between different aspects of 
                          your health to create a comprehensive approach to wellness.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                    {/* Personalized Approach */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => toggleSection('personalized')}
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
                            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">Personalized Approach</h5>
                        </div>
                        <div>
                          {expandedSection === 'personalized' ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                
                <AnimatePresence>
                  {expandedSection === 'personalized' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <p className="text-gray-700 dark:text-gray-300">
                          Everyone is different. What works for one person may not work for another. 
                          That's why we tailor health strategies based on individual needs, data, and goals. 
                          Our AI-powered system analyzes your unique profile, health metrics, and preferences 
                          to create recommendations that are specifically designed for you.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
                </Card>

                <Card className="p-8 mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Research Behind Health Practices:
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3 mt-1">
                        <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">Sleep</h5>
                        <p className="text-gray-700 dark:text-gray-300">
                          Poor sleep is linked to various health issues, but better sleep quality improves your overall well-being.
                          Research shows that consistent, quality sleep supports immune function, cognitive performance, and metabolic health.
                        </p>
                      </div>
                    </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3 mt-1">
                  <Utensils className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Nutrition</h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    A healthy diet reduces the risk of diseases like heart disease and diabetes.
                    Studies consistently show that diets rich in whole foods, lean proteins, and healthy fats
                    support longevity and reduce inflammation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 mr-3 mt-1">
                  <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Fitness</h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Regular exercise is proven to improve your cardiovascular health and muscle strength.
                    Even moderate physical activity has been shown to reduce all-cause mortality and
                    improve mental health outcomes.
                  </p>
                </div>
              </div>
            </div>
                </Card>

                <Card className="p-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Simple Tips to Optimize Your Health:
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">Sleep Better</h5>
                        <p className="text-gray-700 dark:text-gray-300">
                          Stick to a sleep schedule, reduce screen time before bed, and make your bedroom comfortable.
                        </p>
                      </div>
                    </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Eat Healthy</h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Focus on a balanced diet with fruits, vegetables, lean proteins, and healthy fats.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Stay Active</h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Include both aerobic exercise and strength training in your routine for better fitness.
                  </p>
                </div>
              </div>
            </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      How Metrics Help:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      Metrics like BMI, sleep scores, and fitness levels track your progress and help you see how well 
                      you're optimizing your health. By monitoring these, you can make smarter, data-driven decisions 
                      to improve your well-being.
                    </p>
              
                    <div className="flex justify-center">
                      <Button>
                        Start Your Health Optimization Journey
                      </Button>
                    </div>
                  </div>
                </Card>
                
                {isExpanded && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={() => setIsExpanded(false)}
                      variant="outline"
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default EvidenceBasedHealthOptimization;
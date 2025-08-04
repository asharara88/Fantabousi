/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { Clock, Sun, Moon, Zap, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CircadianHealthInsights = () => (
  <Card className="p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
        <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Circadian Health Insights</h2>
    </div>
    <div className="space-y-3">
      <div className="flex items-start">
        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
        <p className="text-gray-700 dark:text-gray-300">Get morning sunlight for at least 15 minutes to regulate your circadian rhythm.</p>
      </div>
      <div className="flex items-start">
        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
        <p className="text-gray-700 dark:text-gray-300">Practice consistent sleep and wake times to strengthen your biological clock.</p>
      </div>
      <div className="flex items-start">
        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
        <p className="text-gray-700 dark:text-gray-300">Limit eating window (e.g., 8am-6pm) for better metabolic health and fasting benefits.</p>
      </div>
      <div className="flex items-start">
        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
        <p className="text-gray-700 dark:text-gray-300">Avoid bright screens after 9pm to support natural melatonin production.</p>
      </div>
    </div>
  </Card>
);

const StaticCircadianClock = () => (
  <Card className="p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Daily Rhythm</h3>
    </div>
    <div className="text-center py-8">
      <div className="w-64 h-64 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
        <div className="text-center">
          <Clock className="w-16 h-16 mx-auto text-primary mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Static Circadian Clock</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Upgrade for dynamic insights</p>
        </div>
      </div>
    </div>
  </Card>
);

const UpgradeToPremiumCTA = () => (
  <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-3">
        <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Unlock Your Full Bioclock!</h4>
    </div>
    <p className="text-gray-700 dark:text-gray-300 mb-4">
      Upgrade to Premium to analyze your biological age, upload lab results, and integrate advanced health devices.
    </p>
    <Button className="w-full">
      <Sparkles className="w-4 h-4 mr-2" />
      Upgrade Now
    </Button>
  </Card>
);

const DynamicBioclockDashboard = () => (
  <Card className="p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
        <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Personalized Bioclock</h2>
    </div>
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300">
        Upload lab results, connect your CGM/metabolism device, and see your biological age vs. chronological age!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Lab Results Analysis</h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">Upload your latest blood work for personalized insights</p>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Device Integration</h4>
          <p className="text-sm text-green-800 dark:text-green-400">Connect CGM and metabolism tracking devices</p>
        </div>
        
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Biological Age</h4>
          <p className="text-sm text-purple-800 dark:text-purple-400">See how your body age compares to your actual age</p>
        </div>
        
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-2">Optimization Plans</h4>
          <p className="text-sm text-orange-800 dark:text-orange-400">Get personalized recommendations to improve your health span</p>
        </div>
      </div>
    </div>
  </Card>
);

export default function BioclockPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Check if user has admin privileges (treating admin as premium for demo)
          const { data, error } = await supabase
            .from("user_profile_signin")
            .select("is_admin")
            .eq("id", user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            // Fallback to basic role if profile fetch fails
            setProfile({ role: "basic" });
          } else {
            // Map is_admin to role (admin = premium, regular user = basic)
            setProfile({ role: data?.is_admin ? "premium" : "basic" });
          }
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setProfile({ role: "basic" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;

  // BASIC USERS
  if (profile?.role === "basic") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="mobile-container max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bioclock™</h1>
            <p className="text-gray-600 dark:text-gray-400">Your circadian health and biological age insights</p>
          </div>
          
          <CircadianHealthInsights />
          <StaticCircadianClock />
          <UpgradeToPremiumCTA />
        </div>
      </div>
    );
  }

  // PREMIUM USERS
  if (profile?.role === "premium") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="mobile-container max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bioclock™ Premium</h1>
            <p className="text-gray-600 dark:text-gray-400">Advanced circadian health and biological age analysis</p>
          </div>
          
          <CircadianHealthInsights />
          <DynamicBioclockDashboard />
        </div>
      </div>
    );
  }

  // Fallback (unknown role)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Access Issue</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load profile. Please contact support.</p>
        <Button variant="outline">Contact Support</Button>
      </Card>
    </div>
  );
}
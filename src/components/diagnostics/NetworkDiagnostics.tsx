import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw, Globe } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface NetworkDiagnostic {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

const NetworkDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<NetworkDiagnostic[]>([
    { test: 'Internet Connection', status: 'pending', message: 'Testing...' },
    { test: 'Supabase URL Reachability', status: 'pending', message: 'Testing...' },
    { test: 'Supabase Auth Endpoint', status: 'pending', message: 'Testing...' },
    { test: 'Environment Variables', status: 'pending', message: 'Testing...' },
    { test: 'CORS Configuration', status: 'pending', message: 'Testing...' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateDiagnostic = (index: number, update: Partial<NetworkDiagnostic>) => {
    setDiagnostics(prev => prev.map((diag, i) => 
      i === index ? { ...diag, ...update } : diag
    ));
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      // Test 1: Internet Connection
      updateDiagnostic(0, { status: 'pending', message: 'Checking internet connection...' });
      try {
        await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          mode: 'no-cors' 
        });
        updateDiagnostic(0, { 
          status: 'success', 
          message: 'Internet connection is working',
          details: 'Successfully reached external server'
        });
      } catch (error) {
        updateDiagnostic(0, { 
          status: 'error', 
          message: 'No internet connection detected',
          details: String(error)
        });
      }

      // Test 2: Environment Variables
      updateDiagnostic(3, { status: 'pending', message: 'Checking environment variables...' });
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        updateDiagnostic(3, { 
          status: 'error', 
          message: 'Environment variables missing',
          details: `URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`
        });
      } else {
        updateDiagnostic(3, { 
          status: 'success', 
          message: 'Environment variables found',
          details: `URL: ${supabaseUrl.substring(0, 30)}...`
        });
      }

      // Test 3: Supabase URL Reachability
      updateDiagnostic(1, { status: 'pending', message: 'Testing Supabase URL...' });
      if (supabaseUrl) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'HEAD',
            headers: {
              'apikey': supabaseKey || '',
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok || response.status === 200) {
            updateDiagnostic(1, { 
              status: 'success', 
              message: 'Supabase URL is reachable',
              details: `Status: ${response.status}`
            });
          } else {
            updateDiagnostic(1, { 
              status: 'error', 
              message: `Supabase URL returned status ${response.status}`,
              details: response.statusText
            });
          }
        } catch (error) {
          updateDiagnostic(1, { 
            status: 'error', 
            message: 'Cannot reach Supabase URL',
            details: String(error)
          });
        }
      }

      // Test 4: Supabase Auth Endpoint
      updateDiagnostic(2, { status: 'pending', message: 'Testing Supabase Auth...' });
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          // Try to get current session (should not fail even if no user)
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            updateDiagnostic(2, { 
              status: 'error', 
              message: 'Supabase Auth error',
              details: error.message
            });
          } else {
            updateDiagnostic(2, { 
              status: 'success', 
              message: 'Supabase Auth is working',
              details: `Session: ${data.session ? 'Active' : 'None'}`
            });
          }
        } catch (error) {
          updateDiagnostic(2, { 
            status: 'error', 
            message: 'Supabase Auth initialization failed',
            details: String(error)
          });
        }
      }

      // Test 5: CORS Configuration
      updateDiagnostic(4, { status: 'pending', message: 'Testing CORS...' });
      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(`${supabaseUrl}/auth/v1/signup`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'test123'
            })
          });
          
          // We expect this to fail with validation error, but if CORS is working, we should get a response
          updateDiagnostic(4, { 
            status: 'success', 
            message: 'CORS is configured correctly',
            details: `Got response from auth endpoint`
          });
        } catch (error) {
          if (String(error).includes('CORS')) {
            updateDiagnostic(4, { 
              status: 'error', 
              message: 'CORS configuration issue',
              details: String(error)
            });
          } else {
            updateDiagnostic(4, { 
              status: 'success', 
              message: 'CORS appears to be working',
              details: 'Network request succeeded (non-CORS error)'
            });
          }
        }
      }

    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: NetworkDiagnostic['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: NetworkDiagnostic['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'pending':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  const overallStatus = diagnostics.every(d => d.status === 'success') ? 'success' :
                      diagnostics.some(d => d.status === 'error') ? 'error' : 'pending';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div 
        className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            {overallStatus === 'success' ? (
              <Wifi className="w-8 h-8 text-green-500" />
            ) : overallStatus === 'error' ? (
              <WifiOff className="w-8 h-8 text-red-500" />
            ) : (
              <Globe className="w-8 h-8 text-blue-500" />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Network Diagnostics
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Diagnosing authentication connection issues
              </p>
            </div>
          </div>
          
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors duration-200 disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              'Rerun Tests'
            )}
          </button>
        </div>

        {/* Diagnostic Results */}
        <div className="space-y-4">
          {diagnostics.map((diagnostic, index) => (
            <motion.div
              key={diagnostic.test}
              className={`p-4 rounded-xl border ${getStatusColor(diagnostic.status)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {diagnostic.test}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {diagnostic.message}
                  </p>
                  {diagnostic.details && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {diagnostic.details}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Troubleshooting Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Ensure you have a stable internet connection</li>
            <li>• Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly</li>
            <li>• Verify your Supabase project is active and not paused</li>
            <li>• Try refreshing the page or clearing browser cache</li>
            <li>• Check browser console for additional error details</li>
            <li>• Verify Supabase project URL in the dashboard</li>
          </ul>
        </div>

        {/* Environment Info */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Environment Info</h4>
          <div className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-1">
            <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</div>
            <div>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</div>
            <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
            <div>Timestamp: {new Date().toISOString()}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NetworkDiagnostics;

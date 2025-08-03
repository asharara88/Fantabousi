import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { AdaptiveBackdrop } from '../components/ui/AdaptiveBackdrop';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdaptiveBackdrop>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold text-text mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-muted mb-8">
              Welcome to Biowell! Your subscription is now active and you can start your personalized health journey.
            </p>
            
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/subscription-dashboard')}
              >
                Manage Subscription
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdaptiveBackdrop>
  );
};

export default PaymentSuccessPage;

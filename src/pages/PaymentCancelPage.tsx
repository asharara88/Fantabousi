import React from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { AdaptiveBackdrop } from '../components/ui/AdaptiveBackdrop';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
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
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold text-text mb-4">
              Payment Canceled
            </h1>
            
            <p className="text-muted mb-8">
              No worries! Your payment was canceled and no charges were made. You can try again anytime.
            </p>
            
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/pricing')}
              >
                Back to Pricing
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdaptiveBackdrop>
  );
};

export default PaymentCancelPage;

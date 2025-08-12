import React from 'react';
import { Card } from '../ui/Card';
import { Watch, RefreshCw, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface WearableDevice {
  id: string;
  name: string;
  type: string;
  lastSynced: string;
  batteryLevel?: number;
  connected: boolean;
  image?: string;
}

interface WearableDeviceCardProps {
  device: WearableDevice;
  onSync: (id: string) => void;
  isSyncing: boolean;
}

const WearableDeviceCard: React.FC<WearableDeviceCardProps> = ({ device, onSync, isSyncing }) => {
  const getBatteryColor = (level?: number) => {
    if (!level) return 'bg-gray-200 dark:bg-gray-700';
    if (level < 20) return 'bg-red-500';
    if (level < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Watch className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connected Device</h3>
        </div>
        {device.connected && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Connected
          </span>
        )}
      </div>
      
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
          {device.image ? (
            <img src={device.image} alt={device.name} className="w-12 h-12 object-contain" />
          ) : (
            <Watch className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{device.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{device.type}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Last synced: {device.lastSynced}
          </p>
        </div>
      </div>
      
      {device.batteryLevel !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Battery</span>
            <span className="font-medium text-gray-900 dark:text-white">{device.batteryLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full ${getBatteryColor(device.batteryLevel)}`}
              initial={{ width: 0 }}
              animate={{ width: `${device.batteryLevel}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button
          onClick={() => onSync(device.id)}
          disabled={isSyncing}
          className="flex-1"
          variant="outline"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
        <Button
          as="a"
          href={device.type === 'Apple Health' ? 'https://support.apple.com/en-us/HT204665' : `https://${device.type.toLowerCase()}.com/settings`}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default WearableDeviceCard;
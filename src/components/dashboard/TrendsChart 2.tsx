/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface TrendsChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
      tension?: number;
      type?: 'line' | 'bar';
      yAxisID?: string;
    }[];
  };
  height?: number;
  chartType?: 'line' | 'bar' | 'mixed';
  interactive?: boolean;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ 
  title, 
  data, 
  height = 300, 
  chartType = 'line',
  interactive = true
}) => {
  const [activeDataset, setActiveDataset] = React.useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = React.useState<{datasetIndex: number, index: number} | null>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
         onClick: interactive ? (e: any, legendItem: any) => {
           setActiveDataset(activeDataset === legendItem.datasetIndex ? null : legendItem.datasetIndex);
         } : undefined,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            size: 13
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 5,
        usePointStyle: true,
        animation: {
          duration: 150
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat().format(context.parsed.y);
            }
            return label;
          }
        },
        callbacks: {
          labelPointStyle: function() {
            return {
              pointStyle: 'circle',
              rotation: 0
            };
          },
          title: function(tooltipItems: any) {
            return tooltipItems[0].label;
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
      onHover: (event: any, elements: any) => {
        if (elements && elements.length) {
          const element = elements[0];
          setHoveredPoint({
            datasetIndex: element.datasetIndex,
            index: element.index
          });
        } else {
          setHoveredPoint(null);
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      y1: {
        position: 'right' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    },
    elements: {
      point: {
        radius: (context: any) => {
          const datasetIndex = context.datasetIndex;
          const index = context.dataIndex;
          
          if (hoveredPoint && 
              hoveredPoint.datasetIndex === datasetIndex && 
              hoveredPoint.index === index) {
            return 6;
          }
          
          if (activeDataset !== null && activeDataset !== datasetIndex) {
            return 0;
          }
          
          return 4;
        },
        hoverRadius: 7,
        borderWidth: 2,
        backgroundColor: (context: any) => {
          const datasetIndex = context.datasetIndex;
          if (activeDataset !== null && activeDataset !== datasetIndex) {
            return 'transparent';
          }
          return context.dataset.backgroundColor;
        }
      },
      line: {
        tension: 0.4,
        borderWidth: (context: any) => {
          const datasetIndex = context.datasetIndex;
          if (activeDataset !== null && activeDataset !== datasetIndex) {
            return 1;
          }
          return 3;
        },
        borderColor: (context: any) => {
          const datasetIndex = context.datasetIndex;
          if (activeDataset !== null && activeDataset !== datasetIndex) {
            return context.dataset.borderColor.replace('1)', '0.3)');
          }
          return context.dataset.borderColor;
        }
      },
      bar: {
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: (context: any) => {
          const datasetIndex = context.datasetIndex;
          if (activeDataset !== null && activeDataset !== datasetIndex) {
            return context.dataset.backgroundColor.replace('0.8)', '0.3)');
          }
          return context.dataset.backgroundColor;
        }
      }
    }
  };

  // Apply dataset visibility based on active dataset
  const processedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      hidden: activeDataset !== null && activeDataset !== index ? false : undefined,
      opacity: activeDataset !== null && activeDataset !== index ? 0.3 : 1
    }))
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return <Bar data={processedData} options={options} />;
    } else if (chartType === 'mixed') {
      // For mixed charts, we need to specify the type for each dataset
      return <Line data={processedData} options={options} />;
    } else {
      return <Line data={processedData} options={options} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-5 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
        <motion.div 
          style={{ height: `${height}px` }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderChart()}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default TrendsChart;
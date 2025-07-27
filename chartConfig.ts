import { 
  Chart,
  ArcElement, 
  Tooltip, 
  Legend, 
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
} from 'chart.js';

// Register Chart.js components once globally
Chart.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
);

export default Chart;
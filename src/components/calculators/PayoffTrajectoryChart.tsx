import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartDataset
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface TrajectoryPoint {
  month: number;
  balance: number;
}

export interface PayoffTrajectoryChartProps {
  snowballHistory?: TrajectoryPoint[];
  avalancheHistory?: TrajectoryPoint[];
  btHistory?: TrajectoryPoint[];
  loanHistory?: TrajectoryPoint[];
}

export const PayoffTrajectoryChart: React.FC<PayoffTrajectoryChartProps> = ({
  snowballHistory = [],
  avalancheHistory = [],
  btHistory = [],
  loanHistory = []
}) => {
  // 1. Determine maximum month duration across all active strategies
  const maxMonths = Math.max(
    snowballHistory.length,
    avalancheHistory.length,
    btHistory.length,
    loanHistory.length,
    1
  );

  // 2. Generate unified X-axis labels (Mo 1, Mo 2, ...)
  const labels = Array.from({ length: maxMonths }, (_, i) => `Mo ${i + 1}`);

  // Helper to pad trajectory arrays so short curves drop to $0 cleanly
  const normalizeData = (historyArr: TrajectoryPoint[]) => {
    return Array.from({ length: maxMonths }, (_, i) => {
      if (i < historyArr.length) {
        return historyArr[i].balance;
      }
      return 0; // Balance remains $0 after payoff
    });
  };

  // 3. Assemble Chart.js Datasets
  const datasets: ChartDataset<'line'>[] = [
    {
      label: 'Debt Snowball',
      data: normalizeData(snowballHistory),
      borderColor: '#2563eb', // Blue
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 2,
      tension: 0.2,
      pointRadius: 0
    },
    {
      label: 'Debt Avalanche',
      data: normalizeData(avalancheHistory),
      borderColor: '#16a34a', // Green
      backgroundColor: 'rgba(22, 163, 74, 0.1)',
      borderWidth: 2,
      tension: 0.2,
      pointRadius: 0
    }
  ];

  if (btHistory.length > 0) {
    datasets.push({
      label: '0% APR Balance Transfer',
      data: normalizeData(btHistory),
      borderColor: '#d97706', // Amber
      backgroundColor: 'rgba(217, 119, 6, 0.1)',
      borderDash: [6, 4], // Dashed line to indicate promo rate
      borderWidth: 2.5,
      tension: 0.2,
      pointRadius: 0
    });
  }

  if (loanHistory.length > 0) {
    datasets.push({
      label: 'Consolidation Loan',
      data: normalizeData(loanHistory),
      borderColor: '#9333ea', // Purple
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderWidth: 2,
      tension: 0.2,
      pointRadius: 0
    });
  }

  const chartData = { labels, datasets };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = typeof context.raw === 'number' ? context.raw : 0;
            return `${context.dataset.label}: $${val.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Payoff Horizon (Months)' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Remaining Balance ($)' },
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '350px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PayoffTrajectoryChart;

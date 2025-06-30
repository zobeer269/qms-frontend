// src/components/BarChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// تسجيل المكونات اللازمة للرسم البياني الشريطي
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly NCR Reports',
    },
  },
};

function BarChart({ chartData }) {
  return <Bar options={options} data={chartData} />;
}

export default BarChart;
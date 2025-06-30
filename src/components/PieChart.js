// src/components/PieChart.js

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// يجب تسجيل المكونات التي سنستخدمها من المكتبة
ChartJS.register(ArcElement, Tooltip, Legend);

// هذا المكون بسيط جدًا، يستقبل بيانات الرسم البياني ويعرضها
function PieChart({ chartData }) {
  return <Pie data={chartData} />;
}

export default PieChart;
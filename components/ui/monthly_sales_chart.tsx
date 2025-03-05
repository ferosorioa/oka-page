// app/insights/MonthlySalesChart.tsx
'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type MonthlySalesChartProps = {
  data: {
    month: string;
    totalSales: number;
  }[];
};

export default function MonthlySalesChart({ data }: MonthlySalesChartProps) {
  return (
    <div style={{ width: '400px', height: '300px' }}>
      <h3>Monthly Sales</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

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

function formatAbbreviatedNumber(value: number): string {
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return value.toFixed(0);
  }
}

export default function MonthlySalesChart({ data }: MonthlySalesChartProps) {
  return (
    <div style={{ width: '500px', height: '400px' }} className="p-4">
      <h3 className="text-lg font-bold">Monthly Sales</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatAbbreviatedNumber} />
          <Tooltip formatter={(value: number) => formatAbbreviatedNumber(value)} />
          <Legend />
          <Bar dataKey="totalSales" fill="#688078" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

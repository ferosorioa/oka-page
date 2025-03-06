// app/insights/IngresosPieChart.tsx
'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type IngresosPieChartProps = {
  data: { name: string; value: number }[];
};

const COLORS = ['#334a40', '#9db1aa', '#FF8042', '#00C49F'];

// Helper function to abbreviate numbers using K for thousands and M for millions.
const formatNumber = (value: number): string => {
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return value.toFixed(0);
  }
};

export default function IngresosPieChart({ data }: IngresosPieChartProps) {
  return (
    <div style={{ width: '500px', height: '400px' }} className="p-4">
      <h3 className="text-lg font-bold">B2B vs B2C Ingresos</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            // Custom label displays the abbreviated number.
            label={({ value }) => formatNumber(value as number)}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          {/* Tooltip displays the abbreviated number */}
          <Tooltip formatter={(value: number) => formatNumber(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

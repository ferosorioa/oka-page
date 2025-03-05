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

const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#00C49F'];

export default function IngresosPieChart({ data }: IngresosPieChartProps) {
  return (
    <div style={{ width: '400px', height: '300px' }}>
      <h3>B2B vs B2C Ingresos</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

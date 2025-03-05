// app/insights/KpiCards.tsx
'use client';

import React from 'react';

type KpiCardsProps = {
  totalSales: number;
  totalExpenses: number;
  totalIngresos: number;
};

export default function KpiCards({
  totalSales,
  totalExpenses,
  totalIngresos,
}: KpiCardsProps) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={cardStyle}>
        <h3>Total Sales</h3>
        <p style={valueStyle}>${totalSales.toFixed(2)}</p>
      </div>
      <div style={cardStyle}>
        <h3>Total Expenses</h3>
        <p style={valueStyle}>${totalExpenses.toFixed(2)}</p>
      </div>
      <div style={cardStyle}>
        <h3>Total Ingresos</h3>
        <p style={valueStyle}>${totalIngresos.toFixed(2)}</p>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  flex: '1',
  minWidth: '200px',
};

const valueStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

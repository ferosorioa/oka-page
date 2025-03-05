// app/insights/TopProductsTable.tsx
'use client';

import React from 'react';

type Product = {
  productName: string;
  totalSold: number;
};

type TopProductsTableProps = {
  products: Product[];
};

export default function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Top Selling Products</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={cellStyle}>Product</th>
            <th style={cellStyle}>Total Sold</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.productName} style={{ borderBottom: '1px solid #eee' }}>
              <td style={cellStyle}>{p.productName}</td>
              <td style={cellStyle}>{p.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'left',
};

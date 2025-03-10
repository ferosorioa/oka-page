// app/insights/KpiCards.tsx
"use client";

import React from "react";

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
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <div style={cardStyle} className="group hover:bg-muted">
        <h3 className="text-primary font-bold group-hover:text-white">
          Ventas totales
        </h3>
        <p style={valueStyle} className="group-hover:text-white">
          ${formatAbbreviatedNumber(totalSales)}
        </p>
      </div>
      <div style={cardStyle} className="group hover:bg-muted">
        <h3 className="text-primary font-bold group-hover:text-white">
          Gastos totales
        </h3>
        <p style={valueStyle} className="group-hover:text-white">
          ${formatAbbreviatedNumber(totalExpenses)}
        </p>
      </div>
      <div style={cardStyle} className="group hover:bg-muted">
        <h3 className="text-primary font-bold group-hover:text-white">
          Ingresos totales
        </h3>
        <p style={valueStyle} className="group-hover:text-white">
          ${formatAbbreviatedNumber(totalIngresos)}
        </p>
      </div>
    </div>
  );
}

function formatAbbreviatedNumber(value: number): string {
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return value.toFixed(2);
  }
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  flex: "1",
  minWidth: "200px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
};

"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/hooks/supabase";

interface IngresosOverviewData {
  totalIngresos: number;
  count: number;
}

const IngresosOverview: React.FC = () => {
  const [data, setData] = useState<IngresosOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngresos() {
      const { data, error } = await supabase.from("ingresos").select("monto");
      if (error) {
        console.error("Error fetching ingresos", error);
        setLoading(false);
        return;
      }
      if (data) {
        const totalIngresos = data.reduce(
          (sum, row) => sum + Number(row.monto),
          0
        );
        const count = data.length;
        setData({ totalIngresos, count });
      }
      setLoading(false);
    }
    fetchIngresos();
  }, []);

  if (loading) return <div>Cargando resumen de ingresos...</div>;
  if (!data) return <div>No hay datos de ingresos</div>;

  return (
    <div>
      <h2>Resumen de ingresos</h2>
      <p>Ingresos totales: ${data.totalIngresos.toFixed(2)}</p>
      <p>Número de ingresos: {data.count}</p>
    </div>
  );
};

export default IngresosOverview;

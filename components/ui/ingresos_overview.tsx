'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/hooks/supabase';

interface IngresosOverviewData {
  totalIngresos: number;
  count: number;
}

const IngresosOverview: React.FC = () => {
  const [data, setData] = useState<IngresosOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngresos() {
      const { data, error } = await supabase
        .from('ingresos')
        .select('monto');
      if (error) {
        console.error('Error fetching ingresos', error);
        setLoading(false);
        return;
      }
      if (data) {
        const totalIngresos = data.reduce((sum, row) => sum + Number(row.monto), 0);
        const count = data.length;
        setData({ totalIngresos, count });
      }
      setLoading(false);
    }
    fetchIngresos();
  }, []);

  if (loading) return <div>Loading Ingresos Overview...</div>;
  if (!data) return <div>No Ingresos Data</div>;

  return (
    <div>
      <h2>Ingresos Overview</h2>
      <p>Total Ingresos: ${data.totalIngresos.toFixed(2)}</p>
      <p>Number of Ingresos: {data.count}</p>
    </div>
  );
};

export default IngresosOverview;

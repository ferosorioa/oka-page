'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/hooks/supabase';

interface SalesOverviewData {
  totalSales: number;
  totalSalesCount: number;
  avgSale: number;
}


const SalesOverview: React.FC = () => {
  const [data, setData] = useState<SalesOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      const { data, error } = await supabase
        .from('ventas')
        .select('precio_total');
      if (error) {
        console.error('Error fetching sales', error);
        setLoading(false);
        return;
      }
      if (data) {
        const totalSalesCount = data.length;
        const totalSales = data.reduce((sum, row) => sum + Number(row.precio_total), 0);
        const avgSale = totalSalesCount > 0 ? totalSales / totalSalesCount : 0;
        setData({ totalSales, totalSalesCount, avgSale });
      }
      setLoading(false);
    }
    fetchSales();
  }, []);

  if (loading) return <div>Loading Sales Overview...</div>;
  if (!data) return <div>No Sales Data</div>;

  return (
    <div>
      <h2>Sales Overview</h2>
      <p>Total Sales Amount: ${data.totalSales.toFixed(2)}</p>
      <p>Total Number of Sales: {data.totalSalesCount}</p>
      <p>Average Sale: ${data.avgSale.toFixed(2)}</p>
    </div>
  );
};

export default SalesOverview;

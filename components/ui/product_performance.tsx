'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/hooks/supabase';

interface ProductSale {
  producto_id: string;
  totalQuantity: number;
}

const ProductPerformance: React.FC = () => {
  const [salesData, setSalesData] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductSales() {
      const { data, error } = await supabase
        .from('ventas_detalle')
        .select('producto_id, cantidad');
      if (error) {
        console.error('Error fetching product sales', error);
        setLoading(false);
        return;
      }
      if (data) {
        // Aggregate sales by producto_id
        const productMap: { [key: string]: number } = {};
        data.forEach((row: any) => {
          const pid = row.producto_id;
          const qty = Number(row.cantidad);
          productMap[pid] = (productMap[pid] || 0) + qty;
        });
        const result = Object.entries(productMap).map(([producto_id, totalQuantity]) => ({
          producto_id,
          totalQuantity,
        }));
        setSalesData(result);
      }
      setLoading(false);
    }
    fetchProductSales();
  }, []);

  if (loading) return <div>Loading Product Performance...</div>;
  if (!salesData.length) return <div>No Product Sales Data</div>;

  return (
    <div>
      <h2>Product Performance</h2>
      <ul>
        {salesData.map((sale) => (
          <li key={sale.producto_id}>
            Product ID: {sale.producto_id} – Total Quantity Sold: {sale.totalQuantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPerformance;

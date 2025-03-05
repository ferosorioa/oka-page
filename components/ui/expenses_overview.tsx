'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/hooks/supabase';

interface ExpenseOverviewData {
  totalExpense: number;
  count: number;
}

const ExpenseOverview: React.FC = () => {
  const [data, setData] = useState<ExpenseOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      const { data, error } = await supabase
        .from('egresos')
        .select('monto');
      if (error) {
        console.error('Error fetching expenses', error);
        setLoading(false);
        return;
      }
      if (data) {
        const totalExpense = data.reduce((sum, row) => sum + Number(row.monto), 0);
        const count = data.length;
        setData({ totalExpense, count });
      }
      setLoading(false);
    }
    fetchExpenses();
  }, []);

  if (loading) return <div>Loading Expense Overview...</div>;
  if (!data) return <div>No Expense Data</div>;

  return (
    <div>
      <h2>Expense Overview (B2B)</h2>
      <p>Total Expenses: ${data.totalExpense.toFixed(2)}</p>
      <p>Number of Expenses: {data.count}</p>
    </div>
  );
};

export default ExpenseOverview;

// tools/dbQueryTool.ts
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { supabase } from '@/hooks/supabase';

const allowedTables = [
  'clientes_b2b',
  'clientes_b2c',
  'contactos',
  'egresos',
  'ingresos',
  'oka_egresos',
  'oka_ingresos',
  'productos',
  'proveedores',
  'types_expense',
  'ubicaciones_compras',
  'ventas',
  'ventas_detalle'
];

export const dbQueryTool = tool(
  async (args: { table: string; filterColumn?: string; filterValue?: string }) => {
    const { table, filterColumn, filterValue } = args;
    if (!allowedTables.includes(table)) {
      return `Error: Table "${table}" is not allowed.`;
    }
    // Start building the query
    let query = supabase.from(table).select('*');
    if (filterColumn && filterValue) {
      query = query.ilike(filterColumn, `%${filterValue}%`);
    }
    const { data, error } = await query;
    if (error) {
      return `Error querying ${table}: ${error.message}`;
    }
    return JSON.stringify(data);
  },
  {
    name: 'query_database',
    description:
      'Queries the Supabase database. Provide a table name and, optionally, a column and filter value to search for matching records.',
    schema: z.object({
      table: z.string().describe('The table name to query'),
      filterColumn: z.string().optional().describe('Column to filter by'),
      filterValue: z.string().optional().describe('Value to filter by'),
    }),
  }
);

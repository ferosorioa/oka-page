"use client"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "@/components/ui/chart"

interface IncomeExpenseChartProps {
  data: any[]
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Ingresos" fill="#334a40" />
          <Bar dataKey="Gastos" fill="#9db1aa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "@/components/ui/chart"

interface SalesChartProps {
  data: any[]
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Bolsas" stroke="#334a40" />
          <Line type="monotone" dataKey="Otros" stroke="#9db1aa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

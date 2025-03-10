// app/insights/page.tsx (Server Component)
import React from 'react';
import { supabase } from '@/hooks/supabase'; // or wherever your server client is
import KpiCards from '@/components/ui/kpi_card';
import MonthlySalesChart from '@/components/ui/monthly_sales_chart';
import IngresosPieChart from '@/components/ui/ingresos_pie';
import TopProductsTable from '@/components/ui/top_products';
import Header from '@/components/ui/header';
import ChatAssistant from '@/components/ui/chat_assistant';

// Optional: Control revalidation (ISR).
// revalidate = 0 => no caching; fetch fresh on every request.
export const revalidate = 60 // revalidate data every 60s, for example

export default async function InsightsPage() {
  // -------------------------
  // 1. Fetch data from DB
  // -------------------------
  const { data: ventasData, error: ventasError } = await supabase.from("ventas").select("precio_total, fecha")
  if (ventasError) {
    console.error("Ventas error:", ventasError)
  }

  const { data: egresosData, error: egresosError } = await supabase.from("egresos").select("monto")
  if (egresosError) {
    console.error("Egresos error:", egresosError)
  }

  const { data: ingresosData, error: ingresosError } = await supabase
    .from("ingresos")
    .select("monto, cliente_tipo, fecha")
  if (ingresosError) {
    console.error("Ingresos error:", ingresosError)
  }

  // -------------------------
  // 2. Compute KPI totals
  // -------------------------
  // Total Sales
  let totalSales = 0
  ventasData?.forEach((v) => {
    totalSales += Number(v.precio_total)
  })

  // Total Expenses
  let totalExpenses = 0
  egresosData?.forEach((e) => {
    totalExpenses += Number(e.monto)
  })

  // Total Ingresos
  let totalIngresos = 0
  ingresosData?.forEach((i) => {
    totalIngresos += Number(i.monto)
  })

  // -------------------------
  // 3. Monthly Sales Data
  // -------------------------
  const monthlySalesMap: Record<string, number> = {}
  ventasData?.forEach((venta) => {
    if (!venta.fecha) return
    const date = new Date(venta.fecha)
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    monthlySalesMap[yearMonth] = (monthlySalesMap[yearMonth] || 0) + Number(venta.precio_total)
  })
  const monthlySalesData = Object.entries(monthlySalesMap).map(([month, total]) => ({
    month,
    totalSales: total,
  }))

  // -------------------------
  // 4. Ingresos: B2B vs B2C
  // -------------------------
  let b2bIngresos = 0
  let b2cIngresos = 0
  ingresosData?.forEach((ing) => {
    if (ing.cliente_tipo === "b2b") {
      b2bIngresos += Number(ing.monto)
    } else if (ing.cliente_tipo === "b2c") {
      b2cIngresos += Number(ing.monto)
    }
  })

  const ingresosPieData = [
    { name: "B2B", value: b2bIngresos },
    { name: "B2C", value: b2cIngresos },
  ]

  // -------------------------
  // 5. Top Products Example
  // -------------------------
  const { data: detalleData, error: detalleError } = await supabase
    .from("ventas_detalle")
    .select("producto_id, cantidad")
  if (detalleError) {
    console.error("Ventas detalle error:", detalleError)
  }

  const productTotals: Record<string, number> = {}
  detalleData?.forEach((d) => {
    productTotals[d.producto_id] = (productTotals[d.producto_id] || 0) + Number(d.cantidad)
  })

  const productIds = Object.keys(productTotals)
  const productMap: Record<string, string> = {}
  if (productIds.length) {
    const { data: productosData } = await supabase.from("productos").select("id, nombre").in("id", productIds)
    if (productosData) {
      productosData.forEach((p) => {
        productMap[p.id] = p.nombre
      })
    }
  }

  const topProducts = Object.entries(productTotals)
    .map(([pid, totalSold]) => ({
      productName: productMap[pid] || pid,
      totalSold,
    }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5)

  // -------------------------
  // 6. Render Page
  // -------------------------
  return (
    <div className="min-h-screen bg-[#fcf5f0]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-4 text-accent">Insights</h1>
        <KpiCards totalSales={totalSales} totalExpenses={totalExpenses} totalIngresos={totalIngresos} />

        <div className="mt-8 ">
          {/* Charts Section - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Monthly Sales Chart */}
            <div className="">
              <h2 className="text-3xl font-bold text-accent mb-2">Ventas mensuales</h2>
              <div className="p-4 rounded-lg border  h-[400px] md:h-[450px] overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <MonthlySalesChart data={monthlySalesData} />
                </div>
              </div>
            </div>

            {/* Ingresos Pie Chart */}
            <div>
              <h2 className="text-3xl font-bold text-accent mb-2">Desglose de ingresos</h2>
              <div className="p-4 rounded-lg border h-[400px] md:h-[450px] overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <IngresosPieChart data={ingresosPieData} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Products Table Section - Below Charts */}
          <div>
            <h2 className="text-3xl font-bold text-accent mb-2">Productos más vendidos</h2>
            <div className="p-4 rounded-lg border ">
              <TopProductsTable products={topProducts} />
            </div>
          </div>
        </div>
      </main>
      <ChatAssistant />

    </div>
  )
}

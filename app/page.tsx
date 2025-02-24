"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart } from "lucide-react"
import type { DateRange } from "react-day-picker"
import {
  Line,
  LineChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// Sample data with full dates
const fullData = [
  { date: new Date(2024, 0, 1), name: "Ene", Bolsas: 4000, Otros: 2400, Ingresos: 5000, Gastos: 3000 },
  { date: new Date(2024, 1, 1), name: "Feb", Bolsas: 3000, Otros: 1398, Ingresos: 4500, Gastos: 3200 },
  { date: new Date(2024, 2, 1), name: "Mar", Bolsas: 2000, Otros: 9800, Ingresos: 6000, Gastos: 3500 },
  { date: new Date(2024, 3, 1), name: "Abr", Bolsas: 2780, Otros: 3908, Ingresos: 5500, Gastos: 3800 },
  { date: new Date(2024, 4, 1), name: "May", Bolsas: 1890, Otros: 4800, Ingresos: 7000, Gastos: 4000 },
  { date: new Date(2024, 5, 1), name: "Jun", Bolsas: 2390, Otros: 3800, Ingresos: 6500, Gastos: 3700 },
  { date: new Date(2024, 6, 1), name: "Jul", Bolsas: 3490, Otros: 4300, Ingresos: 7500, Gastos: 4200 },
]

export default function EnhancedDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [filteredData, setFilteredData] = useState(fullData)
  const [kpis, setKpis] = useState({
    ventasTotales: 45670,
    margenBeneficio: 32,
    clientesNuevos: 24,
    tasaConversion: 3.8,
  })

  // Filter data based on date range
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const filtered = fullData.filter((item) => {
        const from = dateRange.from!
        const to = dateRange.to!
        return item.date >= from && item.date <= to
      })
      setFilteredData(filtered)

      // Update KPIs based on filtered data
      const totalVentas = filtered.reduce((sum, item) => sum + item.Bolsas + item.Otros, 0)
      const totalIngresos = filtered.reduce((sum, item) => sum + item.Ingresos, 0)
      const totalGastos = filtered.reduce((sum, item) => sum + item.Gastos, 0)

      setKpis({
        ventasTotales: totalVentas,
        margenBeneficio: Math.round(((totalIngresos - totalGastos) / totalIngresos) * 100),
        clientesNuevos: Math.round(totalVentas / 1000), // Simplified calculation for demo
        tasaConversion: Number(((totalVentas / 100000) * 100).toFixed(1)), // Simplified calculation for demo
      })
    }
  }, [dateRange])

  return (
    <div className="min-h-screen bg-[#fcf5f0]">
      <header className="bg-[#fcf5f0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-17%20at%2011.39.25%E2%80%AFa.m.-T61UgYkPwWHNlb2RxG93kd7YsQLgsG.png"
                alt="OKA Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-2xl font-semibold text-[#334a40]">OKA</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-[#334a40] hover:text-[#688078] transition-colors">
                Dashboard
              </Link>
              <Link href="/ventas" className="text-[#334a40] hover:text-[#688078] transition-colors">
                Portal de Ventas
              </Link>
              <Link href="/insights" className="text-[#334a40] hover:text-[#688078] transition-colors">
                Insights
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold text-[#334a40]">Dashboard</h1>
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-[#334a40]" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-[#344b41] p-4 rounded-lg">
            <h2 className="text-3xl handwritten text-white">Semaforo del día</h2>
          </div>
          <DateRangePicker onChange={setDateRange} />
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="bg-[#344b41] rounded-lg p-8 text-center text-white">
            <h3 className="text-lg mb-2">Días desde último pedido</h3>
            <span className="text-8xl font-bold">09</span>
          </div>

          <div className="md:col-span-3 bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-[#334a40]">Ventas por producto</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
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
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[#334a40]">Ingresos y Gastos por Mes</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
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
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-lg mb-2 text-[#334a40]">Ventas Totales</h3>
            <span className="text-4xl font-bold text-[#334a40]">${kpis.ventasTotales.toLocaleString()}</span>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-lg mb-2 text-[#334a40]">Margen de Beneficio</h3>
            <span className="text-4xl font-bold text-[#334a40]">{kpis.margenBeneficio}%</span>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-lg mb-2 text-[#334a40]">Clientes Nuevos</h3>
            <span className="text-4xl font-bold text-[#334a40]">{kpis.clientesNuevos}</span>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-lg mb-2 text-[#334a40]">Tasa de Conversión</h3>
            <span className="text-4xl font-bold text-[#334a40]">{kpis.tasaConversion}%</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md h-[500px] flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-[#334a40]">Producto más vendido</h3>
            <div className="flex-grow flex flex-col justify-between">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Monstera%20(1)-xXeqKVdd3K9lPUOvTJKsSLFNL8ddM7.webp"
                  alt="Bolsa Monstera"
                  width={200}
                  height={200}
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Especificaciones</h4>
                <p>Material: Nopal</p>
                <p>Color: Verde</p>
                <p>Canal de venta: En línea</p>
                <p>Costo: $3100 MXN</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 grid md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-xl h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20Plant%20Haven.jpg-thYdgnNg6AgynPdgCZ2hbDRYeuIPXw.jpeg"
                alt="Venta background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <h2 className="text-3xl font-semibold text-white">Venta</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-fit">
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva Venta</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Producto</Label>
                        <Input placeholder="Nombre del producto" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio</Label>
                        <Input type="number" placeholder="$0.00" />
                      </div>
                      <Button className="w-full">Guardar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20Plant.jpg-KKxx2GNfpGePPvdZXy6cHijomom04P.jpeg"
                alt="Ingreso background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <h2 className="text-3xl font-semibold text-white">Ingreso</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-fit">
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Ingreso</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input type="number" placeholder="$0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea placeholder="Descripción del ingreso..." />
                      </div>
                      <Button className="w-full">Guardar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Modern%20Desert%20A-Frame.jpg-DcesCEVC9TJ179zeMHtDJWFKrlvjFc.jpeg"
                alt="Egreso background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <h2 className="text-3xl font-semibold text-white">Egreso</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-fit">
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Egreso</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input type="number" placeholder="$0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea placeholder="Descripción del egreso..." />
                      </div>
                      <Button className="w-full">Guardar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


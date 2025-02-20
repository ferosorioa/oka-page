"use client"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"

// Sample data for the chart
const data = [
  { name: "Ene", Bolsas: 4000, Otros: 2400 },
  { name: "Feb", Bolsas: 3000, Otros: 1398 },
  { name: "Mar", Bolsas: 2000, Otros: 9800 },
  { name: "Abr", Bolsas: 2780, Otros: 3908 },
  { name: "May", Bolsas: 1890, Otros: 4800 },
  { name: "Jun", Bolsas: 2390, Otros: 3800 },
  { name: "Jul", Bolsas: 3490, Otros: 4300 },
]

export default function DashboardPage() {
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
        <div className="bg-[#344b41] p-4 rounded-lg mb-8">
          <h2 className="text-3xl handwritten text-white">Semaforo del día</h2>
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


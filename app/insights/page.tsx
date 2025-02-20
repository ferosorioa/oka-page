"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart } from "lucide-react"

interface Movement {
  tipo: string
  cantidad: string
  fecha: string
  comentarios: string
}

export default function InsightsPage() {
  const [movements] = useState<Movement[]>([
    {
      tipo: "Ingreso",
      cantidad: "$1000",
      fecha: "20-02-2024",
      comentarios: "--------",
    },
    {
      tipo: "Egreso",
      cantidad: "$1000",
      fecha: "18-02-2024",
      comentarios: "Pago a terceros",
    },
    {
      tipo: "Egreso",
      cantidad: "$1000",
      fecha: "16-02-2024",
      comentarios: "------",
    },
    {
      tipo: "Ingreso",
      cantidad: "$1000",
      fecha: "15-02-2024",
      comentarios: "Venta de Bolsa",
    },
  ])

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
              <Link href="/dashboard" className="text-[#334a40] hover:text-[#688078] transition-colors">
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
            <h1 className="text-3xl font-semibold text-[#334a40]">Insights</h1>
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-[#334a40]" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Ingresos Card */}
          <div className="relative overflow-hidden rounded-xl h-64">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photographer%20Image.jpg-sDJognuYKhCWt0R130JVIbCY6NZBRl.jpeg"
              alt="Ingresos background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <h2 className="text-3xl font-semibold text-white">Ingresos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-fit">
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Ingreso</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input type="number" placeholder="$0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Comentarios</Label>
                      <Textarea placeholder="Agregar comentarios..." />
                    </div>
                    <Button className="w-full">Guardar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Egresos Card */}
          <div className="relative overflow-hidden rounded-xl h-64">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Refined%20Minimalist.jpg-yYxxXrTzjCzIRi4hhTVyeizl1SOpyM.jpeg"
              alt="Egresos background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <h2 className="text-3xl font-semibold text-white">Egresos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-fit">
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Egreso</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input type="number" placeholder="$0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Comentarios</Label>
                      <Textarea placeholder="Agregar comentarios..." />
                    </div>
                    <Button className="w-full">Guardar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Comentarios Card */}
          <div className="relative overflow-hidden rounded-xl h-64">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20Plant%20Haven.jpg-dUYH3gUyU68jRA0w67p3Qbsf2pKVx6.jpeg"
              alt="Comentarios background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <h2 className="text-3xl font-semibold text-white">Comentarios</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-fit">
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Comentario</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Comentario</Label>
                      <Textarea placeholder="Agregar comentario..." />
                    </div>
                    <Button className="w-full">Guardar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="bg-[#344b41] p-4 rounded-t-lg">
          <h2 className="text-3xl handwritten text-white">Movimientos Recientes</h2>
        </div>

        <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#9db1aa] text-[#334a40]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cantidad</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Comentarios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.map((movement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{movement.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{movement.cantidad}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{movement.fecha}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{movement.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}


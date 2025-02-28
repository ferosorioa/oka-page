"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart, Plus, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/ui/header"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating?: number
  ratingCount?: number
}

const products: Product[] = [
  {
    id: "ficus",
    name: "FICUS",
    price: 1950,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ficus%20from%20OKA%20Mexico-3sG5m44QZqQUTRinUcoSMWmw4icAZv.webp",
    category: "Bolsas",
    rating: 5,
    ratingCount: 1,
  },
  {
    id: "ficus-xl",
    name: "FICUS XL",
    price: 2499,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ficus%20XL-DDWEZcG3x7TsjcAV39vhFQwPeP6xLi.webp",
    category: "Bolsas",
    rating: 5,
    ratingCount: 2,
  },
  {
    id: "magnolia",
    name: "MAGNOLIA",
    price: 2499,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Magnolia%20OKA-TnWhoXOIRjRCQlibT0qQQ90drywqhT.webp",
    category: "Bolsas",
    rating: 5,
    ratingCount: 2,
  },
  {
    id: "monstera",
    name: "Monstera",
    price: 2800,
    originalPrice: 3100,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Monstera%20Cover%20Nov%209%202023-kGe78kPCatqPDVMpDoD8HpfG4i9U8e.webp",
    category: "Bolsas",
    rating: 5,
    ratingCount: 1,
  },
  {
    id: "cartera-nopal",
    name: "Cartera Nopal",
    price: 700,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tarjetero%20Nopalera-05pkXw32MnLp8utcUYScnAySgNMmWT.webp",
    category: "Accesorios",
  },
  {
    id: "portafolio-cactus",
    name: "Portafolio Cactus",
    price: 3100,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Zip%20Clutch%20Oct%2021-24-9QX81z0J8ObEkm3tArQhoVzLYQqqVZ.webp",
    category: "Accesorios",
  },
  {
    id: "backpack-pitaya",
    name: "Backpack Pitaya",
    price: 2890,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Backpack%20Pitaya-RaXZ2989dyaoAoUZA1v1mkkSddTNsJ.webp",
    category: "Pa' los viajeros",
  },
  {
    id: "llavero-nopal",
    name: "Llavero Nopal",
    price: 180,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Llavero%20Nopal-QbAm7U9055H5tyEl9AEK9bdneVFBgM.webp",
    category: "Accesorios",
  },
  {
    id: "weekender-cactus",
    name: "Weekender Cactus",
    price: 3500,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Portapasaporte%20OKA%20Mexico-Ru5vVv16y9vv7MeLmQSR3VOFq1JxWN.webp",
    category: "Pa' los viajeros",
  },
  {
    id: "tag-maleta",
    name: "Tag de Maleta",
    price: 350,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tag%20de%20Maleta-uN4eqiFT6HmEgsXWCXbWo53JGgN07d.webp",
    category: "Pa' los viajeros",
  },
  {
    id: "tarjetero-tunera",
    name: "Tarjetero Tunera",
    price: 450,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tarjetero%20Tunera-fP8LapqPGSI0mT6j6r9OCLMK5qOVSr.webp",
    category: "Accesorios",
  },
  // Ropa category
  {
    id: "camiseta-nopal",
    name: "Camiseta Nopal",
    price: 450,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recycled%20PET%20Shirt-IUOP6MXQMh0OcsGvo6mvMXeaGo2lTX.webp",
    category: "Ropa",
  },
  {
    id: "sudadera-cactus",
    name: "Sudadera Cactus",
    price: 850,
    image: "/placeholder.svg?height=400&width=400",
    category: "Ropa",
  },
  {
    id: "gorra-oka",
    name: "Gorra OKA",
    price: 350,
    image: "/placeholder.svg?height=400&width=400",
    category: "Ropa",
  },
  {
    id: "calcetines-nopal",
    name: "Calcetines Nopal",
    price: 150,
    image: "/placeholder.svg?height=400&width=400",
    category: "Ropa",
  },
]

interface CartItem extends Product {
  quantity: number
}

export default function SalesPortal() {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [localProducts, setLocalProducts] = useState<Product[]>(products)

  const categories = ["Bolsas", "Accesorios", "Pa' los viajeros", "Ropa"]

  const filteredProducts =
    selectedCategory === "all"
      ? localProducts
      : localProducts.filter((product) => product.category === selectedCategory)



  return (
    <div className="min-h-screen bg-[#fcf5f0]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            Todos
          </Button>
          <Button
            variant={selectedCategory === "Bolsas" ? "default" : "outline"}
            onClick={() => setSelectedCategory("Bolsas")}
          >
            Bolsas
          </Button>
          <Button
            variant={selectedCategory === "Accesorios" ? "default" : "outline"}
            onClick={() => setSelectedCategory("Accesorios")}
          >
            Accesorios
          </Button>
          <Button
            variant={selectedCategory === "Pa' los viajeros" ? "default" : "outline"}
            onClick={() => setSelectedCategory("Pa' los viajeros")}
          >
            Pa&apos; los viajeros
          </Button>
          <Button
            variant={selectedCategory === "Ropa" ? "default" : "outline"}
            onClick={() => setSelectedCategory("Ropa")}
          >
            Ropa
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                      Oferta
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Agregar Venta</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Venta - {product.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nombre de Cliente
                          </Label>
                          <Input id="name" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Cobro
                          </Label>
                          <Input id="amount" type="number" className="col-span-3" defaultValue={product.price} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantity" className="text-right">
                            Cantidad
                          </Label>
                          <Input id="quantity" type="number" className="col-span-3" defaultValue="1" />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          toast({
                            description: "Venta agregada exitosamente",
                          })
                        }}
                      >
                        Confirmar Venta
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


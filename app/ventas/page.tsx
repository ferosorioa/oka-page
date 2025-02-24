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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newProduct: Product = {
      id: Math.random().toString(36).substring(7), // Simple random ID generation
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      image: "/placeholder.svg?height=400&width=400", // Default placeholder image
    }

    setLocalProducts((prev) => [...prev, newProduct])
    toast({
      description: "Producto agregado exitosamente",
    })
  }

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }))
  }

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0
    if (quantity > 0) {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id)
        if (existingItem) {
          return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
        }
        return [...prev, { ...product, quantity }]
      })
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }))
      toast({
        description: `${product.name} agregado al carrito`,
      })
    }
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input id="name" name="name" placeholder="Nombre del producto" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Precio
                    </Label>
                    <Input id="price" name="price" type="number" placeholder="0.00" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoría
                    </Label>
                    <Select name="category" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Imagen
                    </Label>
                    <div className="col-span-3">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">Subir imagen del producto</p>
                          </div>
                          <input id="image" type="file" accept="image/*" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="ml-auto">
                    Agregar Producto
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-[#334a40]" />
              <span className="text-lg font-semibold text-[#334a40]">{cartItemCount}</span>
            </div>
          </div>
        </div>
      </header>

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


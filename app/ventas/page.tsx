"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { completeSale } from "../actions"
import { ShoppingCart } from "lucide-react"

interface CartItem {
  category: string
  product: string
  quantity: number
  price?: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

interface Category {
  id: string
  name: string
  products: string[]
}

const categories: Category[] = [
  {
    id: "bolsas",
    name: "Bolsas",
    products: ["Ficus", "FicusXL", "Magnolia", "Monstera", "Forro Intercambiable Monstera"],
  },
  {
    id: "accesorios",
    name: "Accesorios",
    products: ["Llavero Nopal", "Cartera Nopal", "Tarjetero Nopalera", "Portapasaporte", "Tarjetero Tunera"],
  },
  { id: "viajeros", name: "Pa' los viajeros", products: ["Tag de maleta", "Portapasaporte"] },
  { id: "rebajas", name: "Rebajas", products: [] },
]

export default function SalesPortal() {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<string[]>([])

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory)
      setAvailableProducts(category?.products || [])
      setSelectedProduct("")
    } else {
      setAvailableProducts([])
    }
  }, [selectedCategory])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedProduct("")
  }

  const handleAddToCart = () => {
    if (selectedCategory && selectedProduct && quantity) {
      setCartItems([
        ...cartItems,
        {
          category: categories.find((c) => c.id === selectedCategory)?.name || selectedCategory,
          product: selectedProduct,
          quantity: Number.parseInt(quantity),
        },
      ])
      // Reset form
      setSelectedCategory("")
      setSelectedProduct("")
      setQuantity("1")

      toast({
        description: "Producto agregado al carrito",
      })
    }
  }

  const handleCompleteSale = async () => {
    if (customerInfo.name && customerInfo.email && customerInfo.phone && cartItems.length > 0) {
      try {
        setIsProcessing(true)

        const result = await completeSale({
          customerInfo,
          items: cartItems,
          total: 0, // Replace with actual total calculation
        })

        if (result.success) {
          toast({
            title: "¡Venta Completada!",
            description: `${result.message} ID: ${result.saleId}`,
          })

          // Reset everything
          setCartItems([])
          setCustomerInfo({ name: "", email: "", phone: "" })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message,
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al procesar la venta",
        })
      } finally {
        setIsProcessing(false)
      }
    }
  }

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
            <h1 className="text-3xl font-semibold text-[#334a40]">Portal de Ventas</h1>
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-[#334a40]" />
              <span className="ml-1 text-lg font-semibold text-[#334a40]">{cartItemCount}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl handwritten text-[#334a40] mb-6">Nueva Venta</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-[#9db1aa] text-[#334a40]">
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="bg-[#9db1aa] text-[#334a40]">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="bg-[#9db1aa] text-[#334a40]"
                />
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#334a40] hover:bg-[#344b41] text-white"
                disabled={!selectedCategory || !selectedProduct || !quantity}
              >
                Agregar al Carrito
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl handwritten text-[#334a40] mb-6">Información del Cliente</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  type="text"
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="bg-[#9db1aa] text-[#334a40]"
                  placeholder="Nombre del Cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electronico</Label>
                <Input
                  type="email"
                  id="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="bg-[#9db1aa] text-[#334a40]"
                  placeholder="example@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="bg-[#9db1aa] text-[#334a40]"
                  placeholder="0000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative md:col-span-1">
          <div className="absolute inset-0 bg-snake-plant opacity-50"></div>
          <div className="relative bg-white/90 rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-3xl handwritten text-[#334a40] mb-6">Resumen de Venta</h2>

            {cartItems.length > 0 ? (
              <div className="space-y-4 mb-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-[#fcf5f0] rounded">
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="text-sm text-[#688078]">
                        Cantidad: {item.quantity} - {item.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#688078] mb-4">No hay items en el carrito</p>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">$0.00</span>
              </div>

              <Button
                onClick={handleCompleteSale}
                className="w-full bg-[#334a40] hover:bg-[#344b41] text-white"
                disabled={
                  !customerInfo.name ||
                  !customerInfo.email ||
                  !customerInfo.phone ||
                  cartItems.length === 0 ||
                  isProcessing
                }
              >
                {isProcessing ? "Procesando..." : "Completar Venta"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Minus, ShoppingCart, Trash2, Package } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/hooks/supabase"

type Product = {
  id: string
  nombre: string
  precio: number
  image?: string
}

type CartItem = {
  product: Product
  quantity: number
}

export default function B2CSalesCheckout({ onNext }: { onNext: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    calculateTotal()
  }, [cartItems, calculateTotal])

  async function fetchProducts() {
    const { data, error } = await supabase.from("productos").select("id, nombre, precio, image")
    if (error) console.error("Error fetching products:", error)
    else setProducts(data as Product[])
  }

  function addToCart(product: Product) {
    setIsAddingToCart(product.id)

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id)

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        return [...prevItems, { product, quantity: 1 }]
      }
    })

    setTimeout(() => setIsAddingToCart(null), 300)
  }

  function removeFromCart(productId: string) {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === productId)

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        if (updatedItems[existingItemIndex].quantity > 1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1,
          }
        } else {
          updatedItems.splice(existingItemIndex, 1)
        }
        return updatedItems
      }
      return prevItems
    })
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 0) return

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === productId)

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        if (quantity === 0) {
          updatedItems.splice(existingItemIndex, 1)
        } else {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity,
          }
        }
        return updatedItems
      }
      return prevItems
    })
  }

  function calculateTotal() {
    const sum = cartItems.reduce((acc, item) => {
      return acc + item.product.precio * item.quantity
    }, 0)
    setTotal(sum)
  }

  function clearCart() {
    setCartItems([])
  }

  const filteredProducts = products.filter((product) => {
    return product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4">
      {/* Products Section */}
      <Card className="flex-1">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Badge variant="outline" className="px-3 py-1">
              <Package className="w-4 h-4 mr-1" />
              {products.length} items
            </Badge>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)] md:h-[500px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`overflow-hidden transition-all duration-200 ${isAddingToCart === product.id ? "scale-95 border-primary" : ""}`}
                >
                  <div className="aspect-square relative bg-muted">
                    <Image
                      src={product.image || `/placeholder.svg?height=200&width=200`}
                      alt={product.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-sm md:text-base line-clamp-2 mr-3 flex-1">{product.nombre}</h3>
                      <Badge variant="secondary" className="whitespace-nowrap flex-shrink-0">
                        ${product.precio.toFixed(2)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                      <div className="flex items-center">
                        {cartItems.find((item) => item.product.id === product.id) ? (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="mx-2 font-medium min-w-[1.5rem] text-center">
                              {cartItems.find((item) => item.product.id === product.id)?.quantity || 0}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => addToCart(product)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => addToCart(product)}>
                            Add
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs sm:text-sm whitespace-nowrap"
                        onClick={() => addToCart(product)}
                      >
                        <Plus className="h-3 w-3 mr-1.5" />
                        Quick add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="max-w-xs mt-2">Try adjusting your search to find what you're looking for.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Cart Section */}
      <Card className="w-full lg:w-96">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart
            </CardTitle>
            {cartItems.length > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="max-w-xs mt-2">Add products from the catalog to get started.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-450px)] md:h-[400px]">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-muted relative flex-shrink-0">
                      <Image
                        src={item.product.image || `/placeholder.svg?height=64&width=64`}
                        alt={item.product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.nombre}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          ${item.product.precio.toFixed(2)} × {item.quantity}
                        </span>
                        <span className="font-medium text-sm">${(item.product.precio * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <Input
                        type="number"
                        min="0"
                        className="w-10 h-7 text-center p-0 text-xs"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value) || 0)}
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-4 pt-6">
          <div className="w-full">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mt-2 text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={onNext} disabled={cartItems.length === 0}>
            Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


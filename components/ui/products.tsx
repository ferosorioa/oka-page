"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { supabase } from "@/hooks/supabase"

type Product = {
  id: string
  nombre: string
  descripcion: string
  precio: string
  costo: string
  stock: number
  created_at: string
  image: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    costo: "",
    stock: 0,
    image: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from("productos").select("*")
    if (error) {
      console.error("Error fetching products:", error)
    } else {
      setProducts(data || [])
    }
  }

  async function addProduct() {
    if (!newProduct.nombre || !newProduct.precio || !newProduct.costo || !newProduct.stock) {
      console.error("All fields are required")
      return
    }

    const { data, error } = await supabase.from("productos").insert([newProduct])

    if (error) {
      console.error("Error adding product:", error)
    } else {
      setNewProduct({ nombre: "", descripcion: "", precio: "", costo: "", stock: 0, image: "" })
      setIsDialogOpen(false)
      fetchProducts()
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return Number.parseFloat(a.precio) - Number.parseFloat(b.precio)
      case "price-desc":
        return Number.parseFloat(b.precio) - Number.parseFloat(a.precio)
      case "cost-asc":
        return Number.parseFloat(a.costo) - Number.parseFloat(b.costo)
      case "cost-desc":
        return Number.parseFloat(b.costo) - Number.parseFloat(a.costo)
      case "stock-asc":
        return a.stock - b.stock
      case "stock-desc":
        return b.stock - a.stock
      default:
        return 0
    }
  })

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4  bg-muted p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white">Productos</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Producto</Button>
      </div>
      <div className="mb-4 p-4">
        <label className="block text-sm font-medium mb-1">Buscar Productos</label>
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-white/80 backdrop-blur-sm shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex space-x-4 mb-4 p-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ordenar por</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">Seleccionar</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="cost-asc">Costo: Menor a Mayor</option>
            <option value="cost-desc">Costo: Mayor a Menor</option>
            <option value="stock-asc">Stock: Menor a Mayor</option>
            <option value="stock-desc">Stock: Mayor a Menor</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredProducts.map((product) => (
          <Card
          key={product.id}
          className="group border rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-muted hover:shadow-xl"
        >
          <CardHeader>
            <CardTitle className="text-primary group-hover:text-white transition-colors duration-300">
              {product.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.nombre}
              className="h-48 w-full object-contain mb-2 rounded-md"
            />
            <p className="text-gray-700 group-hover:text-white transition-colors duration-300">
              {product.descripcion}
            </p>
            <p className="font-semibold group-hover:text-white transition-colors duration-300">
              Precio: ${product.precio}
            </p>
            <p className="font-semibold group-hover:text-white transition-colors duration-300">
              Costo: ${product.costo}
            </p>
            <p className="font-semibold group-hover:text-white transition-colors duration-300">
              Stock: {product.stock}
            </p>
          </CardContent>
        </Card>
        
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <Input
              type="text"
              placeholder="Nombre"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Descripción</label>
            <Input
              type="text"
              placeholder="Descripción"
              value={newProduct.descripcion}
              onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Precio</label>
            <Input
              type="text"
              placeholder="Precio"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Costo</label>
            <Input
              type="text"
              placeholder="Costo"
              value={newProduct.costo}
              onChange={(e) => setNewProduct({ ...newProduct, costo: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Stock</label>
            <Input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Imagen URL</label>
            <Input
              type="text"
              placeholder="URL de la imagen"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={addProduct} className="w-full">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


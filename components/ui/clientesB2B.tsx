"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import ClienteB2BDetails from "@/components/ui/clienteB2BDetails"
import { ChevronRight } from "lucide-react"

import { supabase } from "@/hooks/supabase"

type ClienteB2B = {
  id: string
  empresa: string
  rfc: string
  contacto_principal: string
  website: string
  notas: string
}

export default function ClientesB2B() {
  const [clientes, setClientes] = useState<ClienteB2B[]>([])
  const [selectedCliente, setSelectedCliente] = useState<ClienteB2B | null>(null)
  const [newCliente, setNewCliente] = useState({
    empresa: "",
    rfc: "",
    contacto_principal: "",
    website: "",
    notas: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    const { data, error } = await supabase.from("clientes_b2b").select("*")
    if (error) {
      console.error("Error fetching clients:", error)
    } else {
      setClientes(data || [])
    }
  }

  async function addCliente() {
    if (!newCliente.empresa) {
      alert("El campo 'empresa' es obligatorio.")
      return
    }

    const { data, error } = await supabase.from("clientes_b2b").insert([newCliente])
    if (error) {
      console.error("Error adding client:", error)
    } else {
      setNewCliente({
        empresa: "",
        rfc: "",
        contacto_principal: "",
        website: "",
        notas: "",
      })
      setIsDialogOpen(false)
      fetchClientes()
    }
  }

  if (selectedCliente) {
    return (
      <ClienteB2BDetails
        cliente={selectedCliente}
        onBack={() => setSelectedCliente(null)}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 bg-muted p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white">Clientes B2B</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl hover:shadow-lg">Agregar Cliente</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {clientes.map((cliente) => (
          <Card
            key={cliente.id}
            className="max-w-sm w-full border rounded-xl shadow-lg hover:shadow-2xl hover:shadow-muted transition-shadow cursor-pointer bg-beige-50 flex flex-col h-full"
            onClick={() => setSelectedCliente(cliente)}
          >
            <CardHeader className="bg-primary p-4 rounded-t-xl">
              <CardTitle className="text-primary-foreground font-bold text-lg break-words">
                {cliente.empresa}
              </CardTitle>
            </CardHeader>

            {/* This flex-1 ensures the content fills remaining space, pushing the footer down */}
            <CardContent className="p-4 bg-beige-50 break-words flex-1">
              <div className="space-y-2 text-foreground">
                <p className="flex flex-wrap gap-1">
                  <span className="text-primary font-semibold">RFC:</span>
                  <span className="font-normal">{cliente.rfc}</span>
                </p>
                <p className="flex flex-wrap gap-1">
                  <span className="text-primary font-semibold">Contacto:</span>
                  <span className="font-normal">
                    {cliente.contacto_principal}
                  </span>
                </p>
                <p className="flex flex-wrap gap-1">
                  <span className="text-primary font-semibold">Website:</span>
                  <span className="font-normal overflow-scroll">{cliente.website}</span>
                </p>
                <p className="flex flex-wrap gap-1 bg-secondary p-3 rounded-xl">
                  <span className="text-primary font-semibold">Notas:</span>
                  <span className="font-normal text-primary">{cliente.notas}</span>
                </p>
              </div>
            </CardContent>

            {/* Footer pinned to the bottom because of flex layout */}
            <CardFooter className="bg-beige-50 p-4 flex justify-end items-center">
              <span className="text-md text-primary mr-1">Ver más</span>
              <ChevronRight className="h-5 w-5 text-primary" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cliente B2B</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium">Empresa</label>
            <Input
              type="text"
              placeholder="Empresa"
              value={newCliente.empresa}
              onChange={(e) =>
                setNewCliente({ ...newCliente, empresa: e.target.value })
              }
              className="mb-2"
            />
            <label className="block text-sm font-medium">RFC</label>
            <Input
              type="text"
              placeholder="RFC"
              value={newCliente.rfc}
              onChange={(e) =>
                setNewCliente({ ...newCliente, rfc: e.target.value })
              }
              className="mb-2"
            />
            <label className="block text-sm font-medium">
              Contacto Principal
            </label>
            <Input
              type="text"
              placeholder="Contacto Principal"
              value={newCliente.contacto_principal}
              onChange={(e) =>
                setNewCliente({
                  ...newCliente,
                  contacto_principal: e.target.value,
                })
              }
              className="mb-2"
            />
            <label className="block text-sm font-medium">Website</label>
            <Input
              type="text"
              placeholder="Website"
              value={newCliente.website}
              onChange={(e) =>
                setNewCliente({ ...newCliente, website: e.target.value })
              }
              className="mb-2"
            />
            <label className="block text-sm font-medium">Notas</label>
            <Input
              type="text"
              placeholder="Notas"
              value={newCliente.notas}
              onChange={(e) =>
                setNewCliente({ ...newCliente, notas: e.target.value })
              }
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={addCliente} className="w-full">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClienteB2BDetails from "@/components/ui/clienteB2BDetails";

import { supabase } from "@/hooks/supabase";


type ClienteB2B = {
  id: string;
  empresa: string;
  rfc: string;
  contacto_principal: string;
  website: string;
  notas: string;
};

export default function ClientesB2B() {
  const [clientes, setClientes] = useState<ClienteB2B[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClienteB2B | null>(null);
  const [newCliente, setNewCliente] = useState({
    empresa: "",
    rfc: "",
    contacto_principal: "",
    website: "",
    notas: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    const { data, error } = await supabase.from("clientes_b2b").select("*");
    if (error) {
      console.error("Error fetching clients:", error);
    } else {
      setClientes(data || []);
    }
  }

  async function addCliente() {
    if (!newCliente.empresa) {
      alert("El campo 'empresa' es obligatorio.");
      return;
    }

    const { data, error } = await supabase.from("clientes_b2b").insert([newCliente]);
    if (error) {
      console.error("Error adding client:", error);
    } else {
      setNewCliente({
        empresa: "",
        rfc: "",
        contacto_principal: "",
        website: "",
        notas: "",
      });
      setIsDialogOpen(false);
      fetchClientes();
    }
  }

  if (selectedCliente) {
    return <ClienteB2BDetails cliente={selectedCliente} onBack={() => setSelectedCliente(null)} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes B2B</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Cliente</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clientes.map((cliente) => (
          <Card key={cliente.id} className="border rounded-md shadow-lg hover:shadow-xl transition-shadow" onClick={() => setSelectedCliente(cliente)}>
            <CardHeader>
              <CardTitle>{cliente.empresa}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>RFC: {cliente.rfc}</p>
              <p>Contacto Principal: {cliente.contacto_principal}</p>
              <p>Website: {cliente.website}</p>
              <p>Notas: {cliente.notas}</p>
            </CardContent>
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
              onChange={(e) => setNewCliente({ ...newCliente, empresa: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">RFC</label>
            <Input
              type="text"
              placeholder="RFC"
              value={newCliente.rfc}
              onChange={(e) => setNewCliente({ ...newCliente, rfc: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Contacto Principal</label>
            <Input
              type="text"
              placeholder="Contacto Principal"
              value={newCliente.contacto_principal}
              onChange={(e) => setNewCliente({ ...newCliente, contacto_principal: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Website</label>
            <Input
              type="text"
              placeholder="Website"
              value={newCliente.website}
              onChange={(e) => setNewCliente({ ...newCliente, website: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Notas</label>
            <Input
              type="text"
              placeholder="Notas"
              value={newCliente.notas}
              onChange={(e) => setNewCliente({ ...newCliente, notas: e.target.value })}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={addCliente} className="w-full">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
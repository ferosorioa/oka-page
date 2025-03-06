"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { supabase } from "@/hooks/supabase";


type Proveedor = {
  id: string;
  name: string;
};

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [newProveedor, setNewProveedor] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProveedores();
  }, []);

  async function fetchProveedores() {
    const { data, error } = await supabase.from("proveedores").select("*");
    if (error) {
      console.error("Error fetching providers:", error);
    } else {
      setProveedores(data || []);
    }
  }

  async function addProveedor() {
    if (!newProveedor) {
      console.error("Name is required");
      return;
    }

    const { data, error } = await supabase.from("proveedores").insert([{ name: newProveedor }]);

    if (error) {
      console.error("Error adding provider:", error);
    } else {
      setNewProveedor("");
      setIsDialogOpen(false);
      fetchProveedores();
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4  bg-muted p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white">Proveedores</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Proveedor</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {proveedores.map((proveedor) => (
          <Card key={proveedor.id} className="border rounded-md shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-primary p-4">
            <CardTitle className="text-primary-foreground font-bold text-lg">{proveedor.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p>
              <span className="font-bold text-primary">Nombre:</span> {proveedor.name}
            </p>
            <p>
              <span className="font-bold text-primary">ID:</span> {proveedor.id}
            </p>
          </CardContent>
        </Card>
        
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre del Proveedor</label>
            <Input
              type="text"
              placeholder="Nombre"
              value={newProveedor}
              onChange={(e) => setNewProveedor(e.target.value)}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={addProveedor} className="w-full">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
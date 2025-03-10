"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

    const { data, error } = await supabase
      .from("proveedores")
      .insert([{ name: newProveedor }]);

    if (error) {
      console.error("Error adding provider:", error);
    } else {
      setNewProveedor("");
      setIsDialogOpen(false);
      fetchProveedores();
    }
  }

  // Define a consistent style for table cells.
  const cellStyle: React.CSSProperties = {
    padding: "0.5rem",
    textAlign: "left",
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4 bg-muted p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white">Proveedores</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl shadow-lg hover:shadow-[0_10px_15px_muted]">Agregar Proveedor</Button>
      </div>
      <div className="p-4">
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
        className="p-4"
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th
              className="px-4 py-2 bg-primary text-white"
              style={cellStyle}
            >
              Nombre
            </th>
            <th
              className="px-4 py-2 bg-primary text-white"
              style={cellStyle}
            >
              ID
            </th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr
              key={proveedor.id}
              style={{ borderBottom: "1px solid #eee" }}
              className="odd:bg-gray-100 even:bg-secondary"
            >
              <td style={cellStyle}>{proveedor.name}</td>
              <td style={cellStyle}>{proveedor.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Nombre del Proveedor
            </label>
            <Input
              type="text"
              placeholder="Nombre"
              value={newProveedor}
              onChange={(e) => setNewProveedor(e.target.value)}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={addProveedor} className="w-full">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

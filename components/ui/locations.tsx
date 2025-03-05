"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { State, City } from 'country-state-city';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/hooks/supabase";


type Location = {
  id: string;
  nombre: string;
  ciudad: string | null;
  estado: string | null;
  pais: string;
  created_at: string;
};

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState({
    nombre: "",
    ciudad: "",
    estado: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const estados = State.getStatesOfCountry("MX");
  const ciudades = newLocation.estado ? City.getCitiesOfState("MX", newLocation.estado) : [];

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const { data, error } = await supabase.from("ubicaciones_compras").select("*");
    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data || []);
    }
  }

  async function addLocation() {
    if (!newLocation.nombre || !newLocation.estado || !newLocation.ciudad) {
      console.error("All fields are required");
      return;
    }

    const { data, error } = await supabase.from("ubicaciones_compras").insert([
      { ...newLocation, pais: "México" }
    ]);

    if (error) {
      console.error("Error adding location:", error);
    } else {
      setNewLocation({ nombre: "", ciudad: "", estado: "" });
      setIsDialogOpen(false);
      fetchLocations();
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ubicaciones</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Ubicación</Button>
      </div>
      <ScrollArea className="h-[400px] border rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Ciudad</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">País</th>
              <th className="border px-4 py-2">Creado</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td className="border px-4 py-2">{location.nombre}</td>
                <td className="border px-4 py-2">{location.ciudad}</td>
                <td className="border px-4 py-2">{location.estado}</td>
                <td className="border px-4 py-2">{location.pais}</td>
                <td className="border px-4 py-2">{new Date(location.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Ubicación</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <Input
              type="text"
              placeholder="Nombre"
              value={newLocation.nombre}
              onChange={(e) => setNewLocation({ ...newLocation, nombre: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Estado</label>
            <select
              className="w-full border rounded-md p-2 mb-2"
              value={newLocation.estado}
              onChange={(e) => setNewLocation({ ...newLocation, estado: e.target.value })}
            >
              <option value="">Seleccionar estado</option>
              {estados.map((estado) => (
                <option key={estado.isoCode} value={estado.isoCode}>{estado.name}</option>
              ))}
            </select>
            <label className="block text-sm font-medium">Ciudad</label>
            <select
              className="w-full border rounded-md p-2 mb-2"
              value={newLocation.ciudad}
              onChange={(e) => setNewLocation({ ...newLocation, ciudad: e.target.value })}
              disabled={!newLocation.estado}
            >
              <option value="">Seleccionar ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.name} value={ciudad.name}>{ciudad.name}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button onClick={addLocation} className="w-full">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
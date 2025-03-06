"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { State, City } from "country-state-city";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newLocation, setNewLocation] = useState({
    nombre: "",
    ciudad: "",
    estado: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const estados = State.getStatesOfCountry("MX");
  const ciudades = newLocation.estado
    ? City.getCitiesOfState("MX", newLocation.estado)
    : [];

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = locations.filter(
      (location) =>
        location.nombre.toLowerCase().includes(lowercasedSearch) ||
        (location.ciudad &&
          location.ciudad.toLowerCase().includes(lowercasedSearch)) ||
        (location.estado &&
          location.estado.toLowerCase().includes(lowercasedSearch)) ||
        location.pais.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  async function fetchLocations() {
    const { data, error } = await supabase
      .from("ubicaciones_compras")
      .select("*");
    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data || []);
      setFilteredLocations(data || []);
    }
  }

  async function addLocation() {
    if (!newLocation.nombre || !newLocation.estado || !newLocation.ciudad) {
      console.error("All fields are required");
      return;
    }

    const { data, error } = await supabase
      .from("ubicaciones_compras")
      .insert([{ ...newLocation, pais: "México" }]);

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
      <div className="flex justify-between items-center mb-4  bg-muted p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold  text-white">Ubicaciones</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Ubicación</Button>
      </div>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Input
          type="text"
          placeholder="Buscar ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-white/80 backdrop-blur-sm shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <ScrollArea className="h-[400px] border rounded-md">
      <table className="w-full">
  <thead>
    <tr>
      <th className="px-4 py-2 bg-primary text-white">Nombre</th>
      <th className="px-4 py-2 bg-primary text-white">Ciudad</th>
      <th className="px-4 py-2 bg-primary text-white">Estado</th>
      <th className="px-4 py-2 bg-primary text-white">País</th>
      <th className="px-4 py-2 bg-primary text-white">Creado</th>
    </tr>
  </thead>
  <tbody>
    {filteredLocations.map((location) => (
      <tr key={location.id} className="odd:bg-gray-100 even:bg-secondary">
        <td className="px-4 py-2">{location.nombre}</td>
        <td className="px-4 py-2">{location.ciudad}</td>
        <td className="px-4 py-2">{location.estado}</td>
        <td className="px-4 py-2">{location.pais}</td>
        <td className="px-4 py-2">
          {new Date(location.created_at).toLocaleDateString()}
        </td>
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
              onChange={(e) =>
                setNewLocation({ ...newLocation, nombre: e.target.value })
              }
              className="mb-2"
            />
            <label className="block text-sm font-medium">Estado</label>
            <select
              className="w-full border rounded-md p-2 mb-2"
              value={newLocation.estado}
              onChange={(e) =>
                setNewLocation({ ...newLocation, estado: e.target.value })
              }
            >
              <option value="">Seleccionar estado</option>
              {estados.map((estado) => (
                <option key={estado.isoCode} value={estado.isoCode}>
                  {estado.name}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium">Ciudad</label>
            <select
              className="w-full border rounded-md p-2 mb-2"
              value={newLocation.ciudad}
              onChange={(e) =>
                setNewLocation({ ...newLocation, ciudad: e.target.value })
              }
              disabled={!newLocation.estado}
            >
              <option value="">Seleccionar ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.name} value={ciudad.name}>
                  {ciudad.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button onClick={addLocation} className="w-full">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

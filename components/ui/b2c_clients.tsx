"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, ChevronLeft } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { State, City } from 'country-state-city';
import { supabase } from "@/hooks/supabase";


type Client = {
  id?: string;
  nombre: string;
  telefono?: string | null;
  email: string;
  calle?: string | null;
  numero?: string | null;
  colonia?: string | null;
  delegacion?: string | null;
  ciudad?: string | null;
  estado?: string | null;
  cp?: string | null;
  rfc?: string | null;
};

type Location = {
  id: string;
  nombre: string;
};

export default function B2CClientCheckout({ cartItems, total, onComplete }: { cartItems: any, total: any, onComplete: any }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'created_at'>>({
    nombre: "",
    email: "",
    telefono: null,
    calle: null,
    numero: null,
    colonia: null,
    delegacion: null,
    ciudad: null,
    estado: null,
    cp: null,
    rfc: null,
  });

  const estados = State.getStatesOfCountry("MX");
  const ciudades = newClient.estado ? City.getCitiesOfState("MX", newClient.estado) : [];

  useEffect(() => {
    fetchClients();
    fetchLocations();
  }, []);

  async function fetchClients() {
    const { data, error } = await supabase.from("clientes_b2c").select("id, nombre, email");
    if (error) {
      console.error("Error fetching clients:", error);
    } else {
      setClients(data || []);
    }
  }

  async function fetchLocations() {
    const { data, error } = await supabase.from("ubicaciones_compras").select("id, nombre");
    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data || []);
    }
  }

  async function handleCreateClient() {
    if (!newClient.nombre || !newClient.email) {
      console.error("Name and email are required");
      return;
    }

    const { data, error } = await supabase.from("clientes_b2c").insert([newClient]).select();
    if (error) {
      console.error("Error creating client:", error);
    } else {
      setClients([...clients, ...data]);
      setSelectedClient(data[0]);
      setCreatingClient(false);
      setNewClient({
        nombre: "",
        email: "",
        telefono: null,
        calle: null,
        numero: null,
        colonia: null,
        delegacion: null,
        ciudad: null,
        estado: null,
        cp: null,
        rfc: null,
      });
    }
  }

  async function handleCompleteSale() {
    if (!selectedClient || !selectedLocation || cartItems.length === 0) return;

    const { data: venta, error: ventaError } = await supabase
      .from("ventas")
      .insert([
        { cliente_id: selectedClient.id, ubicacion_id: selectedLocation }
      ])
      .select();

    if (ventaError) {
      console.error("Error creating sale:", ventaError);
      return;
    }

    const ventaId = venta[0].id;

    const ventaDetalleData = cartItems.map((item: { product: { id: any; precio: any; }; quantity: any; }) => ({
      venta_id: ventaId,
      producto_id: item.product.id,
      cantidad: item.quantity,
      precio_unitario: item.product.precio,
    }));

    const { error: detalleError } = await supabase.from("ventas_detalle").insert(ventaDetalleData);

    if (detalleError) {
      console.error("Error creating sale details:", detalleError);
      return;
    }

    onComplete();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mx-auto p-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {creatingClient ? "Agregar Cliente" : "Seleccionar o Agregar Cliente"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creatingClient ? (
            <div className="space-y-4">
              <Button variant="outline" onClick={() => setCreatingClient(false)} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Volver
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Nombre del Cliente *</label>
                  <Input
                    type="text"
                    value={newClient.nombre}
                    onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Correo Electrónico *</label>
                  <Input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Teléfono</label>
                  <PhoneInput
                    country={'mx'}
                    value={newClient.telefono || ""}
                    onChange={(phone) => setNewClient({ ...newClient, telefono: phone })}
                    inputStyle={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Calle</label>
                  <Input
                    type="text"
                    value={newClient.calle || ""}
                    onChange={(e) => setNewClient({ ...newClient, calle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Número</label>
                  <Input
                    type="text"
                    value={newClient.numero || ""}
                    onChange={(e) => setNewClient({ ...newClient, numero: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Colonia</label>
                  <Input
                    type="text"
                    value={newClient.colonia || ""}
                    onChange={(e) => setNewClient({ ...newClient, colonia: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Delegación</label>
                  <Input
                    type="text"
                    value={newClient.delegacion || ""}
                    onChange={(e) => setNewClient({ ...newClient, delegacion: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Estado</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={newClient.estado || ""}
                    onChange={(e) => setNewClient({ ...newClient, estado: e.target.value })}
                  >
                    <option value="">Seleccionar estado</option>
                    {estados.map((estado) => (
                      <option key={estado.isoCode} value={estado.isoCode}>{estado.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Ciudad</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={newClient.ciudad || ""}
                    onChange={(e) => setNewClient({ ...newClient, ciudad: e.target.value })}
                    disabled={!newClient.estado}
                  >
                    <option value="">Seleccionar ciudad</option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.name} value={ciudad.name}>{ciudad.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Código Postal</label>
                  <Input
                    type="text"
                    value={newClient.cp || ""}
                    onChange={(e) => setNewClient({ ...newClient, cp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">RFC</label>
                  <Input
                    type="text"
                    value={newClient.rfc || ""}
                    onChange={(e) => setNewClient({ ...newClient, rfc: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateClient} className="w-full mt-4">
                Guardar Cliente
              </Button>
            </div>
          ) : (
            <>
              <div className="relative w-full mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar clientes..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <ScrollArea className="h-[300px] border rounded-md p-2">
                {clients
                  .filter((client) => client.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((client) => (
                    <div
                      key={client.id}
                      className={`p-2 cursor-pointer ${
                        selectedClient?.id === client.id ? "bg-primary text-white" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      {client.nombre}
                    </div>
                  ))}
              </ScrollArea>

              <Button onClick={() => setCreatingClient(true)} variant="outline" className="w-full mt-4" >
                <UserPlus className="mr-2" /> Agregar Nuevo Cliente
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full lg:w-96">
        <CardHeader>
          <CardTitle>Seleccionar Ubicación de Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="w-full border rounded-md p-2"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Seleccionar ubicación</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.nombre}</option>
            ))}
          </select>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCompleteSale} disabled={!selectedClient || !selectedLocation}>
            Completar Venta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

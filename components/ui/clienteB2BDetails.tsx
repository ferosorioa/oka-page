"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { supabase } from "@/hooks/supabase";


type Contact = {
  id: string;
  cliente_b2b_id: string;
  nombre: string;
  email: string;
  telefono: string;
  puesto: string;
};

type ClienteB2B = {
  id: string;
  empresa: string;
  rfc: string;
  contacto_principal: string;
  website: string;
  notas: string;
};

interface ClienteB2BDetailsProps {
  cliente: ClienteB2B;
  onBack: () => void;
}

export default function ClienteB2BDetails({ cliente, onBack }: ClienteB2BDetailsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    nombre: "",
    email: "",
    telefono: "",
    puesto: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    const { data, error } = await supabase.from("contactos").select("*").eq("cliente_b2b_id", cliente.id);
    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      setContacts(data || []);
    }
  }

  async function addContact() {
    if (!newContact.nombre || !newContact.email) {
      alert("Nombre y email son obligatorios.");
      return;
    }

    const { data, error } = await supabase.from("contactos").insert([{ ...newContact, cliente_b2b_id: cliente.id }]);
    if (error) {
      console.error("Error adding contact:", error);
    } else {
      setNewContact({
        nombre: "",
        email: "",
        telefono: "",
        puesto: "",
      });
      setIsDialogOpen(false);
      fetchContacts();
    }
  }

  return (
    <div className="p-4">
      <Button onClick={onBack} className="mb-4">Volver</Button>
      <h1 className="text-2xl font-bold text-primary">{cliente.empresa}</h1>
      <p>RFC: {cliente.rfc}</p>
      <p>Contacto Principal: {cliente.contacto_principal}</p>
      <p>Website: {cliente.website}</p>
      <p>Notas: {cliente.notas}</p>

      <h2 className="text-xl font-semibold mt-6">Contactos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="border rounded-md shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-muted p-4">
              <CardTitle className="text-white">{contact.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {contact.email}</p>
              <p>Teléfono: {contact.telefono}</p>
              <p>Puesto: {contact.puesto}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={() => setIsDialogOpen(true)} className="mt-4">Agregar Contacto</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Contacto</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <Input
              type="text"
              placeholder="Nombre"
              value={newContact.nombre}
              onChange={(e) => setNewContact({ ...newContact, nombre: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="mb-2"
            />
            <label className="block text-sm font-medium">Teléfono</label>
            <PhoneInput
              country={'us'}
              value={newContact.telefono}
              onChange={(phone) => setNewContact({ ...newContact, telefono: phone })}
              inputClass="mb-2"
            />
            <label className="block text-sm font-medium">Puesto</label>
            <Input
              type="text"
              placeholder="Puesto"
              value={newContact.puesto}
              onChange={(e) => setNewContact({ ...newContact, puesto: e.target.value })}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={addContact} className="w-full">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
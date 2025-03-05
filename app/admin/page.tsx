"use client"

import { useState } from "react"
import { Building2, Users, MapPin, ShoppingBag, Receipt, Menu, Truck } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Header from "@/components/ui/header"
import B2CSalesProcess from "@/components/ui/b2c"
import Locations from "@/components/ui/locations"
import Products from "@/components/ui/products"
import Expenses from "@/components/ui/expenses"
import Proveedores from "@/components/ui/proveedores"
import ClientesB2B from "@/components/ui/clientesB2B"


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<string>("b2b")
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  return (
    <div className="flex h-screen bg-[#f8f2ed]">
      <div className={`fixed h-full w-64 bg-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0`}>
        <SidebarProvider>
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </SidebarProvider>
      </div>
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        <div className="p-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <Header />
        <ContentSection activeSection={activeSection} />
      </div>
    </div>
  )
}

interface AppSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

// Replace your current AppSidebar function with this:
function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const menuItems = [
    { id: "b2b", label: "B2B", icon: Building2 },
    { id: "b2c", label: "Ventas B2C", icon: Users },
    { id: "locations", label: "Ubicaciones", icon: MapPin },
    { id: "products", label: "Productos", icon: ShoppingBag },
    { id: "expenses", label: "Gastos", icon: Receipt },
    { id: "providers", label: "Proveedores", icon: Truck },
  ]

  return (
    <Sidebar className="border-r border-border bg-white/80 backdrop-blur-md w-full h-full">
      <SidebarHeader className="border-b border-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#334a40]">Panel de Administrador</h2>
          <p className="text-sm text-[#334a40]">Maneja tu negocio</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full">
        <SidebarMenu className="w-full">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id} className="w-full">
              <SidebarMenuButton 
                onClick={() => setActiveSection(item.id)} 
                isActive={activeSection === item.id}
                className={`w-full ${activeSection === item.id ? 'bg-[#e8f0ed] text-[#334a40]' : 'hover:bg-[#f0f7f4]'}`}
              >
                <item.icon className="mr-2 h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-[#334a40]">Connected to database</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


interface ContentSectionProps {
  activeSection: string
}

function ContentSection({ activeSection }: ContentSectionProps) {
  if (activeSection === "b2c") {
    return <B2CSalesProcess />;
  }

  if (activeSection === "locations") {
    return <Locations />;
  }
  if (activeSection === "products") {
    return <Products />;
  }
  if (activeSection === "expenses") {
    return <Expenses />;
  }
  if (activeSection === "providers") {
    return <Proveedores />;
  }
  if (activeSection === "b2b") {
    return <ClientesB2B />;
  }

  // Existing section data for other views
  const sectionData = {
    b2b: { title: "Clientes B2B" },
    locations: { title: "Ubicaciones" },
    products: { title: "Productos" },
    expenses: { title: "Gastos" },
    providers: { title: "Proveedores" },
  };

  const data = sectionData[activeSection as keyof typeof sectionData];

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-[#334a40]">{data.title}</h1>
      <p className="text-muted-foreground">Manage and monitor your {data.title.toLowerCase()}</p>
    </div>
  );
}

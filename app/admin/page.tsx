"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Building2, Users, MapPin, ShoppingBag, Receipt, Bell, User, ChevronDown, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Header from "@/components/ui/header"
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    { id: "b2b", label: "B2B Clients", icon: Building2 },
    { id: "b2c", label: "B2C Clients", icon: Users },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "expenses", label: "Expenses", icon: Receipt },
  ]

  return (
    <Sidebar className="border-r border-border bg-white/80 backdrop-blur-md w-full h-full">
      <SidebarHeader className="border-b border-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#334a40]">Admin Panel</h2>
          <p className="text-sm text-[#334a40]">Manage your business</p>
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
  // Sample data for each section
  const sectionData = {
    b2b: {
      title: "B2B Clients",
      stats: [
        { title: "Total Clients", value: "124", change: "+12%" },
        { title: "Active Contracts", value: "87", change: "+5%" },
        { title: "Revenue", value: "$1.2M", change: "+18%" },
        { title: "Avg. Contract Value", value: "$14.5K", change: "+7%" },
      ],
      recentClients: [
        { name: "Acme Corporation", industry: "Manufacturing", value: "$45,000" },
        { name: "TechGiant Inc.", industry: "Technology", value: "$78,000" },
        { name: "EcoSolutions", industry: "Energy", value: "$32,000" },
        { name: "Global Logistics", industry: "Transportation", value: "$56,000" },
      ]
    },
    b2c: {
      title: "B2C Clients",
      stats: [
        { title: "Total Customers", value: "3,842", change: "+24%" },
        { title: "Active Subscriptions", value: "2,156", change: "+15%" },
        { title: "Monthly Revenue", value: "$86K", change: "+12%" },
        { title: "Avg. Order Value", value: "$42", change: "+3%" },
      ],
      recentClients: [
        { name: "John Smith", location: "New York", value: "$120" },
        { name: "Maria Garcia", location: "Los Angeles", value: "$95" },
        { name: "David Chen", location: "Chicago", value: "$210" },
        { name: "Sarah Johnson", location: "Miami", value: "$85" },
      ]
    },
    locations: {
      title: "Locations",
      stats: [
        { title: "Total Locations", value: "18", change: "+2" },
        { title: "Countries", value: "5", change: "+1" },
        { title: "Warehouses", value: "8", change: "0" },
        { title: "Retail Stores", value: "10", change: "+2" },
      ]
    },
    products: {
      title: "Products",
      stats: [
        { title: "Total Products", value: "256", change: "+12" },
        { title: "Categories", value: "14", change: "+2" },
        { title: "Out of Stock", value: "8", change: "-3" },
        { title: "New Arrivals", value: "24", change: "+24" },
      ]
    },
    expenses: {
      title: "Expenses",
      stats: [
        { title: "Monthly Expenses", value: "$124K", change: "+5%" },
        { title: "Operational", value: "$78K", change: "+3%" },
        { title: "Marketing", value: "$32K", change: "+12%" },
        { title: "R&D", value: "$14K", change: "-2%" },
      ]
    }
  }

  const data = sectionData[activeSection as keyof typeof sectionData]

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#334a40]">{data.title}</h1>
          <p className="text-muted-foreground">Manage and monitor your {data.title.toLowerCase()}</p>
        </div>
        <Button className="bg-[#334a40] hover:bg-[#4a6a5c] mt-2 sm:mt-0">
          {activeSection === 'b2b' || activeSection === 'b2c' ? 'Add Client' : 
           activeSection === 'locations' ? 'Add Location' :
           activeSection === 'products' ? 'Add Product' : 'Add Expense'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#334a40]">{stat.value}</div>
                <div className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-orange-600'}`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(activeSection === 'b2b' || activeSection === 'b2c') && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#334a40]">
              Recent {activeSection === 'b2b' ? 'Clients' : 'Customers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium">
                      {activeSection === 'b2b' ? 'Industry' : 'Location'}
                    </th>
                    <th className="py-3 px-4 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentClients?.map((client, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4">{client.name}</td>
                      <td className="py-3 px-4">
                        {activeSection === 'b2b' ? client.industry : client.location}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{client.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {(activeSection === 'locations' || activeSection === 'products' || activeSection === 'expenses') && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#334a40]">
              {activeSection === 'locations' ? 'Location Map' : 
               activeSection === 'products' ? 'Product Categories' : 'Expense Breakdown'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-md bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">
                {activeSection === 'locations' ? 'Location map visualization' : 
                 activeSection === 'products' ? 'Product categories chart' : 'Expense breakdown chart'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

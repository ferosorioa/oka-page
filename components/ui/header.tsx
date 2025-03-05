"use client"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  
  const handleAddProduct = () => {
    console.log("Agregar producto")
  }

  return (
    <header className="bg-[#fcf5f0] shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-17%20at%2011.39.25%E2%80%AFa.m.-T61UgYkPwWHNlb2RxG93kd7YsQLgsG.png"
            alt="OKA Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-2xl font-semibold text-[#334a40]">OKA</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-[#334a40] hover:text-[#688078] transition-colors">
            Dashboard
          </Link>
          <Link href="/insights" className="text-[#334a40] hover:text-[#688078] transition-colors">
            Insights
          </Link>
          <Link href="/admin" className="text-[#334a40] hover:text-[#688078] transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </div>
  </header>
)
}

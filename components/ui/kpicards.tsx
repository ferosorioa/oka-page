"use client"
interface KPIProps {
  kpis: {
    ventasTotales: number
    margenBeneficio: number
    clientesNuevos: number
    tasaConversion: number
  }
}

export default function KPICards({ kpis }: KPIProps) {
  return (
    <div className="grid md:grid-cols-4 gap-8 mb-8">
      {Object.entries(kpis).map(([key, value]) => (
        <div key={key} className="bg-white rounded-lg p-6 shadow-md text-center">
          <h3 className="text-lg mb-2 text-[#334a40]">{key.replace(/([A-Z])/g, " $1")}</h3>
          <span className="text-4xl font-bold text-[#334a40]">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
        </div>
      ))}
    </div>
  )
}

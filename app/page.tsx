"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, BarChart3, PieChart, TrendingUp } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { createClient } from "@supabase/supabase-js";
import {
  Line,
  LineChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "@/components/ui/chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Header from "@/components/ui/header";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our Supabase tables
type Ingreso = {
  id: string;
  canal: string;
  donde: string;
  producto: string;
  recibe: string;
  ingreso: number;
  metodo: string;
  cuenta: string;
  fecha: string;
  nota: string;
};

type Egreso = {
  id: string;
  tipo: string;
  concepto: string;
  actor: string;
  proveedor: string;
  monto: number;
  metodo: string;
  cuenta: string;
  fecha: string;
  notas: string;
};

// Type for our chart data
type ChartData = {
  date: Date;
  name: string;
  Ingresos: number;
  Gastos: number;
  Bolsas: number;
  Otros: number;
};

// Type for product data
type ProductData = {
  name: string;
  value: number;
  percentage: number;
};

// Type for channel data
type ChannelData = {
  name: string;
  value: number;
  percentage: number;
};

// Type for expense category data
type ExpenseCategoryData = {
  name: string;
  value: number;
  percentage: number;
};

// Colors for pie charts
const COLORS = [
  "#334a40",
  "#4a6c62",
  "#688078",
  "#9db1aa",
  "#c4d1cc",
  "#dce3e0",
  "#f0f3f2",
];

export default function EnhancedDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [uniqueProducts, setUniqueProducts] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseCategoryData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    (Ingreso | Egreso)[]
  >([]);
  const [kpis, setKpis] = useState({
    ventasTotales: 0,
    margenBeneficio: 0,
    clientesNuevos: 0,
    tasaConversion: 0,
    diasUltimoPedido: 0,
    productoMasVendido: {
      nombre: "",
      canal: "",
      ingreso: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Extract the year from dateRange or use default
      const selectedYear = dateRange?.from
        ? dateRange.from.getFullYear()
        : new Date().getFullYear() - 1; // Default to previous year if none selected

      // Create exact timestamp strings with time component set to start/end of day
      // This ensures we capture the entire day regardless of timezone
      const fromDate = `${selectedYear}-01-01T00:00:00.000Z`;
      const toDate = `${selectedYear}-12-31T23:59:59.999Z`;

      console.log(`Fetching data from ${fromDate} to ${toDate}`);

      try {
        // Fetch ingresos with explicit date formatting
        const { data: ingresosData, error: ingresosError } = await supabase
          .from("oka_ingresos")
          .select(
            `
            id,
            canal,
            donde,
            producto,
            recibe,
            ingreso,
            metodo,
            cuenta,
            fecha,
            nota
          `
          )
          .filter("fecha", "gte", fromDate)
          .filter(
            "fecha",
            "lt",
            `${Number(selectedYear) + 1}-01-01T00:00:00.000Z`
          )
          .order("fecha", { ascending: false });

        // Fetch egresos with explicit date formatting
        const { data: egresosData, error: egresosError } = await supabase
          .from("oka_egresos")
          .select(
            `
            id,
            tipo,
            concepto,
            actor,
            proveedor,
            monto,
            metodo,
            cuenta,
            fecha,
            notas
          `
          )
          .filter("fecha", "gte", fromDate)
          .filter(
            "fecha",
            "lt",
            `${Number(selectedYear) + 1}-01-01T00:00:00.000Z`
          )
          .order("fecha", { ascending: false });

        if (ingresosError) {
          console.error("Error fetching ingresos:", ingresosError);
          throw ingresosError;
        }

        if (egresosError) {
          console.error("Error fetching egresos:", egresosError);
          throw egresosError;
        }

        setIngresos(ingresosData || []);
        setEgresos(egresosData || []);

        // Combine and sort transactions
        const combinedTransactions = [
          ...(ingresosData || []).map((i) => ({ ...i, type: "ingreso" })),
          ...(egresosData || []).map((e) => ({ ...e, type: "egreso" })),
        ]
          .sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          )
          .slice(0, 5);

        setRecentTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  // Process data for charts and insights
  useEffect(() => {
    if (ingresos.length === 0 && egresos.length === 0) return;

    // Group data by month for chart visualization
    const monthlyData = new Map<
      string,
      {
        ingresos: number;
        egresos: number;
        bolsas: number;
        otros: number;
      }
    >();

    // Product breakdown
    const productTotals = new Map<string, number>();

    // Channel breakdown
    const channelTotals = new Map<string, number>();

    // Expense category breakdown
    const expenseCategoryTotals = new Map<string, number>();

    // Process ingresos

    // Process ingresos
    ingresos.forEach((ingreso) => {
      const date = new Date(ingreso.fecha);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, {
          ingresos: 0,
          egresos: 0,
          bolsas: 0,
          otros: 0,
        });
      }

      const currentData = monthlyData.get(monthYear)!;
      currentData.ingresos += ingreso.ingreso;

      // Classify products
      if (
        ingreso.producto.toLowerCase().includes("bolsa") ||
        ingreso.producto.toLowerCase().includes("ficus") ||
        ingreso.producto.toLowerCase().includes("xoka")
      ) {
        currentData.bolsas += ingreso.ingreso;
      } else {
        currentData.otros += ingreso.ingreso;
      }

      // Update product totals
      productTotals.set(
        ingreso.producto,
        (productTotals.get(ingreso.producto) || 0) + ingreso.ingreso
      );

      // Update channel totals
      channelTotals.set(
        ingreso.canal,
        (channelTotals.get(ingreso.canal) || 0) + ingreso.ingreso
      );

      monthlyData.set(monthYear, currentData);
    });

    // Process egresos
    egresos.forEach((egreso) => {
      const date = new Date(egreso.fecha);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, {
          ingresos: 0,
          egresos: 0,
          bolsas: 0,
          otros: 0,
        });
      }

      const currentData = monthlyData.get(monthYear)!;
      currentData.egresos += egreso.monto;

      // Update expense category totals
      expenseCategoryTotals.set(
        egreso.tipo,
        (expenseCategoryTotals.get(egreso.tipo) || 0) + egreso.monto
      );

      monthlyData.set(monthYear, currentData);
    });

    // Convert to chart data format
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const formattedData: ChartData[] = Array.from(monthlyData.entries())
      .map(([monthYear, data]) => {
        const [year, month] = monthYear.split("-").map(Number);
        return {
          date: new Date(year, month - 1, 1),
          name: `${monthNames[month - 1]} ${year}`, // Now includes the year
          Ingresos: data.ingresos,
          Gastos: data.egresos,
          Bolsas: data.bolsas,
          Otros: data.otros,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate totals for percentages
    const totalIngresos = ingresos.reduce((sum, item) => sum + item.ingreso, 0);
    const totalEgresos = egresos.reduce((sum, item) => sum + item.monto, 0);

    // Format product data for pie chart
    const formattedProductData: ProductData[] = Array.from(
      productTotals.entries()
    )
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / totalIngresos) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 products

    // If there are more than 6 products, add an "Otros" category
    if (productTotals.size > 6) {
      const otrosValue =
        totalIngresos -
        formattedProductData.reduce((sum, item) => sum + item.value, 0);
      formattedProductData.push({
        name: "Otros",
        value: otrosValue,
        percentage: Math.round((otrosValue / totalIngresos) * 100),
      });
    }

    // Format channel data for pie chart
    const formattedChannelData: ChannelData[] = Array.from(
      channelTotals.entries()
    )
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / totalIngresos) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    // Format expense category data for pie chart
    const formattedExpenseData: ExpenseCategoryData[] = Array.from(
      expenseCategoryTotals.entries()
    )
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / totalEgresos) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    setChartData(formattedData);
    console.log("Chart Data:", formattedData);
    setProductData(formattedProductData);
    setChannelData(formattedChannelData);
    setExpenseData(formattedExpenseData);

    // Calculate KPIs
    const margenBeneficio =
      totalIngresos > 0
        ? Math.round(((totalIngresos - totalEgresos) / totalIngresos) * 100)
        : 0;

    // Find most recent sale date
    const fechas = ingresos.map((ingreso) => new Date(ingreso.fecha).getTime());
    const ultimaFecha = fechas.length > 0 ? Math.max(...fechas) : Date.now();
    const diasUltimoPedido = Math.floor(
      (Date.now() - ultimaFecha) / (1000 * 60 * 60 * 24)
    );

    // Find best-selling product
    const productoVentas = new Map<string, number>();
    ingresos.forEach((ingreso) => {
      const producto = ingreso.producto;
      productoVentas.set(
        producto,
        (productoVentas.get(producto) || 0) + ingreso.ingreso
      );
    });

    let productoMasVendido = { nombre: "No hay datos", canal: "", ingreso: 0 };
    let maxVenta = 0;

    productoVentas.forEach((venta, producto) => {
      if (venta > maxVenta) {
        maxVenta = venta;
        const ingresoItem = ingresos.find((i) => i.producto === producto);
        productoMasVendido = {
          nombre: producto,
          canal: ingresoItem?.canal || "",
          ingreso: venta,
        };
      }
    });

    // Count unique customers (based on "donde" field as a simple approximation)
    const clientesUnicos = new Set(ingresos.map((item) => item.donde)).size;

    setKpis({
      ventasTotales: totalIngresos,
      margenBeneficio,
      clientesNuevos: clientesUnicos,
      tasaConversion:
        totalIngresos > 0
          ? Number(((clientesUnicos / ingresos.length) * 100).toFixed(1))
          : 0,
      diasUltimoPedido,
      productoMasVendido,
    });
  }, [ingresos, egresos]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#fcf5f0]">
      <Head>
        <title>Enhanced Dashboard</title>
        <link rel="icon" href="/images/S2C-Figma-Logo.png" type="image/png" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-[#344b41] p-4 rounded-lg">
            <h2 className="text-3xl handwritten text-white">
              Semaforo del día
            </h2>
          </div>
          <DateRangePicker onChange={setDateRange} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#334a40] border-r-transparent"></div>
            <p className="mt-4 text-[#334a40]">Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                  Ventas por producto
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="Bolsas" stroke="#334a40" />
                      <Line type="monotone" dataKey="Otros" stroke="#9db1aa" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-lg mb-2 text-[#334a40]">Ventas Totales</h3>
                <span className="text-4xl font-bold text-[#334a40]">
                  {formatCurrency(kpis.ventasTotales)}
                </span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-lg mb-2 text-[#334a40]">
                  Margen de Beneficio
                </h3>
                <span className="text-4xl font-bold text-[#334a40]">
                  {kpis.margenBeneficio}%
                </span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-lg mb-2 text-[#334a40]">Clientes Únicos</h3>
                <span className="text-4xl font-bold text-[#334a40]">
                  {kpis.clientesNuevos}
                </span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-lg mb-2 text-[#334a40]">
                  Tasa de Conversión
                </h3>
                <span className="text-4xl font-bold text-[#334a40]">
                  {kpis.tasaConversion}%
                </span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Visión General
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="flex items-center gap-2"
                >
                  <PieChart className="h-4 w-4" />
                  Productos y Canales
                </TabsTrigger>
                <TabsTrigger
                  value="expenses"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Gastos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                      Ingresos y Gastos por Mes
                    </h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                          <Bar dataKey="Ingresos" fill="#334a40" />
                          <Bar dataKey="Gastos" fill="#9db1aa" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                      Transacciones Recientes
                    </h3>
                    <div className="h-[350px] overflow-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-[#334a40]">
                          <tr>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Tipo</th>
                            <th className="px-4 py-2 text-left">Detalle</th>
                            <th className="px-4 py-2 text-right">Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions.map((transaction: any) => (
                            <tr key={transaction.id} className="border-b">
                              <td className="px-4 py-3">
                                {formatDate(transaction.fecha)}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    transaction.type === "ingreso"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {transaction.type === "ingreso"
                                    ? "Ingreso"
                                    : "Egreso"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {transaction.type === "ingreso"
                                  ? `${transaction.producto} - ${transaction.donde}`
                                  : `${transaction.concepto} - ${transaction.proveedor}`}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                <span
                                  className={
                                    transaction.type === "ingreso"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {transaction.type === "ingreso"
                                    ? formatCurrency(transaction.ingreso)
                                    : formatCurrency(transaction.monto)}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {recentTransactions.length === 0 && (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-4 py-3 text-center text-gray-500"
                              >
                                No hay transacciones disponibles
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                      Ventas por Producto
                    </h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={productData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percentage }) =>
                              `${name}: ${percentage}%`
                            }
                          >
                            {productData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                      Ventas por Canal
                    </h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percentage }) =>
                              `${name}: ${percentage}%`
                            }
                          >
                            {channelData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                    Detalle de Productos
                  </h3>
                  <div className="h-[300px] overflow-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-[#334a40]">
                        <tr>
                          <th className="px-4 py-2 text-left">Producto</th>
                          <th className="px-4 py-2 text-left">
                            Canal Principal
                          </th>
                          <th className="px-4 py-2 text-right">
                            Ventas Totales
                          </th>
                          <th className="px-4 py-2 text-right">% del Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.map((product) => {
                          const mainChannel = ingresos
                            .filter((i) => i.producto === product.name)
                            .reduce((acc, curr) => {
                              acc[curr.canal] =
                                (acc[curr.canal] || 0) + curr.ingreso;
                              return acc;
                            }, {} as Record<string, number>);

                          const mainChannelName =
                            Object.entries(mainChannel).sort(
                              (a, b) => b[1] - a[1]
                            )[0]?.[0] || "-";

                          return (
                            <tr key={product.name} className="border-b">
                              <td className="px-4 py-3 font-medium">
                                {product.name}
                              </td>
                              <td className="px-4 py-3">{mainChannelName}</td>
                              <td className="px-4 py-3 text-right">
                                {formatCurrency(product.value)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {product.percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="expenses">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                      Gastos por Categoría
                    </h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percentage }) =>
                              `${name}: ${percentage}%`
                            }
                          >
                            {expenseData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                      Detalle de Gastos
                    </h3>
                    <div className="h-[350px] overflow-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-[#334a40]">
                          <tr>
                            <th className="px-4 py-2 text-left">Categoría</th>
                            <th className="px-4 py-2 text-left">
                              Principales Proveedores
                            </th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-right">
                              % del Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseData.map((category) => {
                            const providers = egresos
                              .filter((e) => e.tipo === category.name)
                              .reduce((acc, curr) => {
                                acc[curr.proveedor] =
                                  (acc[curr.proveedor] || 0) + curr.monto;
                                return acc;
                              }, {} as Record<string, number>);

                            const topProviders = Object.entries(providers)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 2)
                              .map(([name]) => name)
                              .join(", ");

                            return (
                              <tr key={category.name} className="border-b">
                                <td className="px-4 py-3 font-medium">
                                  {category.name}
                                </td>
                                <td className="px-4 py-3">
                                  {topProviders || "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {formatCurrency(category.value)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {category.percentage}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md h-[500px] flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-[#334a40]">
                  Producto más vendido
                </h3>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-center mb-4 ">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Monstera%20(1)-xXeqKVdd3K9lPUOvTJKsSLFNL8ddM7.webp"
                      alt={kpis.productoMasVendido.nombre}
                      width={200}
                      height={200}
                      className="rounded-lg object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#334a40]">
                      {kpis.productoMasVendido.nombre}
                    </h4>
                    <p className=" text-[#334a40]">
                      Canal: {kpis.productoMasVendido.canal}
                    </p>
                    <p className=" text-[#334a40]">
                      Ventas totales:{" "}
                      {formatCurrency(kpis.productoMasVendido.ingreso)}
                    </p>
                    <p className=" text-[#334a40]">
                      Porcentaje de ventas:{" "}
                      {Math.round(
                        (kpis.productoMasVendido.ingreso / kpis.ventasTotales) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 grid md:grid-cols-3 gap-8">
                {/* Venta */}
                <div className="relative overflow-hidden rounded-xl h-[500px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20Plant%20Haven.jpg-thYdgnNg6AgynPdgCZ2hbDRYeuIPXw.jpeg"
                    alt="Venta background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <h2 className="text-3xl font-semibold text-white">Venta</h2>
                    <Link href="/admin">
                      <Button
                        variant="secondary"
                        className="w-fit rounded-xl shadow-lg"
                      >
                        Agregar
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Ingreso */}
                <div className="relative overflow-hidden rounded-xl h-[500px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20Plant.jpg-KKxx2GNfpGePPvdZXy6cHijomom04P.jpeg"
                    alt="Ingreso background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <h2 className="text-3xl font-semibold text-white">
                      Ingreso
                    </h2>
                    <Link href="/admin">
                      <Button
                        variant="secondary"
                        className="w-fit rounded-xl shadow-lg"
                      >
                        Agregar
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Egreso */}
                <div className="relative overflow-hidden rounded-xl h-[500px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Modern%20Desert%20A-Frame.jpg-DcesCEVC9TJ179zeMHtDJWFKrlvjFc.jpeg"
                    alt="Egreso background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <h2 className="text-3xl font-semibold text-white">
                      Egreso
                    </h2>
                    <Link href="/admin">
                      <Button
                        variant="secondary"
                        className="w-fit rounded-xl shadow-lg"
                      >
                        Agregar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

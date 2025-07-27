"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Users, Scissors, DollarSign, CalendarCheck, Loader2, AlertCircle } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker" // Assuming this component exists or will be created
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { DailyRevenue, RecentReserva } from "@/lib/database"

// Interfaces para los datos
interface GeneralStats {
  reservas_confirmadas: number
  reservas_pendientes: number
  total_clientes: number
  clientes_vip: number
  peluqueros_activos: number
  servicios_activos: number
}

interface RevenueStats {
  total_revenue: number
}

export default function AdminDashboardPage() {
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null)
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingRevenue, setLoadingRevenue] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dailyRevenueData, setDailyRevenueData] = useState<DailyRevenue[]>([])
  const [recentAppointments, setRecentAppointments] = useState<RecentReserva[]>([])
  const [loadingDailyRevenue, setLoadingDailyRevenue] = useState(false)
  const [loadingRecentAppointments, setLoadingRecentAppointments] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  // Cargar estadísticas generales
  useEffect(() => {
    const fetchGeneralStats = async () => {
      setLoadingStats(true)
      setError(null)
      try {
        const response = await fetch("/api/admin/stats")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: GeneralStats = await response.json()
        setGeneralStats(data)
      } catch (err) {
        console.error("Error fetching general stats:", err)
        setError("Error al cargar estadísticas generales.")
      } finally {
        setLoadingStats(false)
      }
    }
    fetchGeneralStats()
  }, [])

  // Cargar facturación por rango de fechas
  useEffect(() => {
    const fetchRevenue = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      setLoadingRevenue(true)
      setError(null)
      try {
        const from = format(dateRange.from, "yyyy-MM-dd")
        const to = format(dateRange.to, "yyyy-MM-dd")
        const response = await fetch(`/api/admin/stats?startDate=${from}&endDate=${to}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: RevenueStats = await response.json()
        setRevenueStats(data)
      } catch (err) {
        console.error("Error fetching revenue stats:", err)
        setError("Error al cargar la facturación.")
      } finally {
        setLoadingRevenue(false)
      }
    }
    fetchRevenue()
  }, [dateRange])

  useEffect(() => {
    const fetchDailyRevenue = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      setLoadingDailyRevenue(true)
      setError(null)
      try {
        const from = format(dateRange.from, "yyyy-MM-dd")
        const to = format(dateRange.to, "yyyy-MM-dd")
        const response = await fetch(`/api/admin/daily-revenue?startDate=${from}&endDate=${to}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: DailyRevenue[] = await response.json()
        setDailyRevenueData(data)
      } catch (err) {
        console.error("Error fetching daily revenue:", err)
        setError("Error al cargar la facturación diaria.")
      } finally {
        setLoadingDailyRevenue(false)
      }
    }
    fetchDailyRevenue()
  }, [dateRange])

  useEffect(() => {
    const fetchRecentAppointments = async () => {
      setLoadingRecentAppointments(true)
      setError(null)
      try {
        const response = await fetch("/api/admin/recent-appointments?limit=5") // Fetch last 5 appointments
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: RecentReserva[] = await response.json()
        setRecentAppointments(data)
      } catch (err) {
        console.error("Error fetching recent appointments:", err)
        setError("Error al cargar las últimas reservas.")
      } finally {
        setLoadingRecentAppointments(false)
      }
    }
    fetchRecentAppointments()
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard de Administración</h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* General Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Confirmadas</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
            ) : (
              <div className="text-2xl font-bold">{generalStats?.reservas_confirmadas ?? "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Próximas citas confirmadas</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
            ) : (
              <div className="text-2xl font-bold">{generalStats?.reservas_pendientes ?? "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Citas pendientes de confirmación</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
            ) : (
              <div className="text-2xl font-bold">{generalStats?.total_clientes ?? "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Clientes registrados en el sistema</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peluqueros Activos</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
            ) : (
              <div className="text-2xl font-bold">{generalStats?.peluqueros_activos ?? "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Estilistas disponibles</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
            ) : (
              <div className="text-2xl font-bold">{generalStats?.servicios_activos ?? "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Servicios ofrecidos actualmente</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Section */}
      <Card className="bg-admin-card shadow-sm border-admin-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facturación por Rango</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <DateRangePicker
              date={dateRange}
              setDate={setDateRange}
              locale={es} // Set locale to Spanish
            />
            {loadingRevenue && <Loader2 className="h-5 w-5 animate-spin text-admin-primary" />}
          </div>
          <div className="text-4xl font-bold">${revenueStats?.total_revenue?.toFixed(2) ?? "0.00"}</div>
          <p className="text-xs text-muted-foreground">
            Total de ingresos por reservas confirmadas en el rango seleccionado.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-admin-card shadow-sm border-admin-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facturación Diaria</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingDailyRevenue ? (
            <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
          ) : dailyRevenueData.length > 0 ? (
            <div className="h-48 w-full flex items-end justify-around gap-1">
              {dailyRevenueData.map((dataPoint) => (
                <div
                  key={dataPoint.fecha}
                  className="flex flex-col items-center justify-end h-full group"
                  style={{
                    height: `${(dataPoint.daily_revenue / Math.max(...dailyRevenueData.map((d) => d.daily_revenue))) * 100}%`,
                  }}
                >
                  <div
                    className="relative w-4 bg-admin-primary rounded-t-sm group-hover:bg-admin-primary/80 transition-colors duration-200"
                    style={{ height: "100%" }}
                  >
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs text-admin-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ${dataPoint.daily_revenue.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 rotate-45 origin-bottom-left whitespace-nowrap">
                    {format(new Date(dataPoint.fecha), "dd/MM", { locale: es })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay datos de facturación diaria para el rango seleccionado.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-admin-card shadow-sm border-admin-border md:col-span-2">
          <CardHeader>
            <CardTitle>Últimas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRecentAppointments ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-admin-primary" />
                <span className="ml-2 text-muted-foreground">Cargando últimas reservas...</span>
              </div>
            ) : recentAppointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Peluquero</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAppointments.map((reserva) => (
                    <TableRow key={reserva.id_reserva}>
                      <TableCell className="font-medium">{reserva.nombre_cliente}</TableCell>
                      <TableCell>{reserva.nombre_servicio}</TableCell>
                      <TableCell>{reserva.nombre_peluquero}</TableCell>
                      <TableCell>
                        {format(new Date(reserva.fecha_turno), "dd MMM", { locale: es })} {reserva.hora_inicio_turno}
                      </TableCell>
                      <TableCell className="text-right">${reserva.precio_final.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reserva.estado_reserva === "confirmado"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : reserva.estado_reserva === "pendiente"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {reserva.estado_reserva}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No hay reservas recientes.</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader>
            <CardTitle>Gestión de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aquí podrás ver y gestionar tus clientes.</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader>
            <CardTitle>Gestión de Peluqueros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Administra la información de tus estilistas.</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader>
            <CardTitle>Gestión de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Configura los servicios que ofreces.</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader>
            <CardTitle>Gestión de Horarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Define la disponibilidad de tus peluqueros.</p>
          </CardContent>
        </Card>
        <Card className="bg-admin-card shadow-sm border-admin-border">
          <CardHeader>
            <CardTitle>Gestión de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Visualiza y gestiona todas las citas.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

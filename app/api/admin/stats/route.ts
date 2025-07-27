import { NextResponse } from "next/server"
import { getEstadisticasGenerales, getRevenueByDateRange } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (startDate && endDate) {
      const revenue = await getRevenueByDateRange(startDate, endDate)
      return NextResponse.json({ total_revenue: revenue })
    } else {
      const stats = await getEstadisticasGenerales()
      return NextResponse.json(stats)
    }
  } catch (error) {
    console.error("Error en API de estadísticas de admin:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

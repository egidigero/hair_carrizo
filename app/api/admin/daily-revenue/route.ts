import { NextResponse } from "next/server"
import { getDailyRevenueByDateRange } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "startDate y endDate son requeridos" }, { status: 400 })
    }

    const dailyRevenue = await getDailyRevenueByDateRange(startDate, endDate)
    return NextResponse.json(dailyRevenue)
  } catch (error) {
    console.error("Error en API de facturación diaria:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

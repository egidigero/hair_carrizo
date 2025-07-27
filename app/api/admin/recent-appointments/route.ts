import { NextResponse } from "next/server"
import { getRecentReservas } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 5

    const recentAppointments = await getRecentReservas(limit)
    return NextResponse.json(recentAppointments)
  } catch (error) {
    console.error("Error en API de reservas recientes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getHorariosDisponibles } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const peluqueroId = searchParams.get("peluquero_id")
    const fecha = searchParams.get("fecha")
    const duracionMinutos = searchParams.get("duracion_minutos")

    if (!peluqueroId || !fecha || !duracionMinutos) {
      return NextResponse.json({ error: "Parámetros faltantes" }, { status: 400 })
    }

    const horarios = await getHorariosDisponibles(Number.parseInt(peluqueroId), fecha, Number.parseInt(duracionMinutos))

    return NextResponse.json(horarios)
  } catch (error) {
    console.error("Error en API de horarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getPeluquerosPorServicio, getPeluqueros } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const servicioId = searchParams.get("servicio_id")

    if (servicioId) {
      const peluqueros = await getPeluquerosPorServicio(Number.parseInt(servicioId))
      return NextResponse.json(peluqueros)
    } else {
      const peluqueros = await getPeluqueros()
      return NextResponse.json(peluqueros)
    }
  } catch (error) {
    console.error("Error en API de peluqueros:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

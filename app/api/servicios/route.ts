import { NextResponse } from "next/server"
import { getServicios, getServiciosPorCategoria } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const agrupado = searchParams.get("agrupado")

    if (agrupado === "true") {
      const serviciosPorCategoria = await getServiciosPorCategoria()
      return NextResponse.json(serviciosPorCategoria)
    } else {
      const servicios = await getServicios()
      return NextResponse.json(servicios)
    }
  } catch (error) {
    console.error("Error en API de servicios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

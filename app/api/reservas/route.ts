import { NextResponse } from "next/server"
import { crearReserva, getReservasPorFecha } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const reserva = await request.json()

    // Validaciones básicas
    if (!reserva.nombre_cliente?.trim() || !reserva.telefono_cliente?.trim()) {
      return NextResponse.json({ error: "Nombre y teléfono son obligatorios" }, { status: 400 })
    }

    if (!reserva.id_servicio || !reserva.id_peluquero || !reserva.fecha_turno || !reserva.hora_inicio_turno) {
      return NextResponse.json({ error: "Faltan datos de la reserva" }, { status: 400 })
    }

    const resultado = await crearReserva(reserva)

    if (resultado.success) {
      return NextResponse.json({
        success: true,
        id: resultado.id,
        message: `Reserva confirmada para ${reserva.nombre_cliente}`,
      })
    } else {
      return NextResponse.json({ error: resultado.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en API de reservas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha")

    if (!fecha) {
      return NextResponse.json({ error: "Fecha es requerida" }, { status: 400 })
    }

    const reservas = await getReservasPorFecha(fecha)
    return NextResponse.json(reservas)
  } catch (error) {
    console.error("Error en API de reservas GET:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

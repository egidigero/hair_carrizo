import { NextResponse } from "next/server"
import { getAllReservas } from "@/lib/database"

export async function GET() {
  try {
    const appointments = await getAllReservas()
    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error en API de reservas de admin:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

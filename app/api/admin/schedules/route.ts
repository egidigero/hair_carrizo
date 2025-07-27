import { NextResponse } from "next/server"
import { getAllHorarios } from "@/lib/database"

export async function GET() {
  try {
    const schedules = await getAllHorarios()
    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Error en API de horarios de admin:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

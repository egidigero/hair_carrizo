import { NextResponse } from "next/server"
import { getAllPeluqueros, createPeluquero, updatePeluquero, deletePeluquero } from "@/lib/database"
import type { Peluquero } from "@/lib/database"

export async function GET() {
  try {
    const stylists = await getAllPeluqueros()
    return NextResponse.json(stylists)
  } catch (error) {
    console.error("Error en API de peluqueros GET:", error)
    return NextResponse.json({ error: "Error interno del servidor al obtener peluqueros" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const stylistData: Omit<Peluquero, "id_peluquero" | "created_at" | "updated_at"> = await request.json()

    if (!stylistData.nombre_peluquero || !stylistData.especialidad_peluquero) {
      return NextResponse.json({ error: "Nombre y especialidad del peluquero son obligatorios" }, { status: 400 })
    }

    const newStylist = await createPeluquero(stylistData)
    return NextResponse.json(newStylist, { status: 201 })
  } catch (error) {
    console.error("Error en API de peluqueros POST:", error)
    return NextResponse.json({ error: "Error interno del servidor al crear peluquero" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...stylistData }: { id: number } & Partial<Omit<Peluquero, "id_peluquero" | "created_at">> =
      await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID del peluquero es obligatorio para actualizar" }, { status: 400 })
    }

    const updatedStylist = await updatePeluquero(id, stylistData)
    return NextResponse.json(updatedStylist)
  } catch (error) {
    console.error("Error en API de peluqueros PUT:", error)
    return NextResponse.json({ error: "Error interno del servidor al actualizar peluquero" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID del peluquero es obligatorio para eliminar" }, { status: 400 })
    }

    await deletePeluquero(id)
    return NextResponse.json({ message: "Peluquero eliminado (desactivado) exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en API de peluqueros DELETE:", error)
    return NextResponse.json({ error: "Error interno del servidor al eliminar peluquero" }, { status: 500 })
  }
}

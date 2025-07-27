import { NextResponse } from "next/server"
import {
  getAllServiciosAdmin,
  createServicio,
  updateServicio,
  deleteServicio,
  getCategoriasServicios,
} from "@/lib/database"
import type { Servicio } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "categories") {
      const categories = await getCategoriasServicios()
      return NextResponse.json(categories)
    } else {
      const services = await getAllServiciosAdmin()
      return NextResponse.json(services)
    }
  } catch (error) {
    console.error("Error en API de servicios GET:", error)
    return NextResponse.json({ error: "Error interno del servidor al obtener servicios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const serviceData: Omit<Servicio, "id_servicio" | "created_at" | "updated_at"> = await request.json()

    if (
      !serviceData.nombre_servicio ||
      !serviceData.categoria_servicio ||
      !serviceData.precio_servicio ||
      !serviceData.duracion_minutos
    ) {
      return NextResponse.json({ error: "Nombre, categoría, precio y duración son obligatorios" }, { status: 400 })
    }

    const newService = await createServicio(serviceData)
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error en API de servicios POST:", error)
    return NextResponse.json({ error: "Error interno del servidor al crear servicio" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...serviceData }: { id: number } & Partial<Omit<Servicio, "id_servicio" | "created_at">> =
      await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID del servicio es obligatorio para actualizar" }, { status: 400 })
    }

    const updatedService = await updateServicio(id, serviceData)
    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error en API de servicios PUT:", error)
    return NextResponse.json({ error: "Error interno del servidor al actualizar servicio" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID del servicio es obligatorio para eliminar" }, { status: 400 })
    }

    await deleteServicio(id)
    return NextResponse.json({ message: "Servicio eliminado (desactivado) exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en API de servicios DELETE:", error)
    return NextResponse.json({ error: "Error interno del servidor al eliminar servicio" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getAllClientes, createCliente, updateCliente, deleteCliente } from "@/lib/database"
import type { Cliente } from "@/lib/database"

export async function GET() {
  try {
    const clients = await getAllClientes()
    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error en API de clientes GET:", error)
    return NextResponse.json({ error: "Error interno del servidor al obtener clientes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const clientData: Omit<Cliente, "id_cliente" | "total_visitas" | "created_at" | "updated_at"> = await request.json()

    if (!clientData.nombre_cliente || !clientData.telefono_cliente) {
      return NextResponse.json({ error: "Nombre y teléfono del cliente son obligatorios" }, { status: 400 })
    }

    const newClient = await createCliente(clientData)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("Error en API de clientes POST:", error)
    return NextResponse.json({ error: "Error interno del servidor al crear cliente" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      ...clientData
    }: { id: number } & Partial<Omit<Cliente, "id_cliente" | "created_at" | "total_visitas">> = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID del cliente es obligatorio para actualizar" }, { status: 400 })
    }

    const updatedClient = await updateCliente(id, clientData)
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("Error en API de clientes PUT:", error)
    return NextResponse.json({ error: "Error interno del servidor al actualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID del cliente es obligatorio para eliminar" }, { status: 400 })
    }

    await deleteCliente(id)
    return NextResponse.json({ message: "Cliente eliminado (desactivado) exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en API de clientes DELETE:", error)
    return NextResponse.json({ error: "Error interno del servidor al eliminar cliente" }, { status: 500 })
  }
}

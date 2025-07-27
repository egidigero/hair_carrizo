"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "@/lib/database"

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Cliente | null>(null) // For editing
  const [formState, setFormState] = useState({
    nombre_cliente: "",
    telefono_cliente: "",
    email_cliente: "",
    cliente_vip: false,
    activo_cliente: true, // Default for new clients
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/clients")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Cliente[] = await response.json()
      setClients(data)
    } catch (err) {
      console.error("Error fetching clients:", err)
      setError("Error al cargar los clientes.")
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormState((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleOpenDialog = (client?: Cliente) => {
    if (client) {
      setCurrentClient(client)
      setFormState({
        nombre_cliente: client.nombre_cliente,
        telefono_cliente: client.telefono_cliente,
        email_cliente: client.email_cliente || "",
        cliente_vip: client.cliente_vip,
        activo_cliente: client.activo_cliente,
      })
    } else {
      setCurrentClient(null)
      setFormState({
        nombre_cliente: "",
        telefono_cliente: "",
        email_cliente: "",
        cliente_vip: false,
        activo_cliente: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setCurrentClient(null)
    setFormState({
      nombre_cliente: "",
      telefono_cliente: "",
      email_cliente: "",
      cliente_vip: false,
      activo_cliente: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let response
      if (currentClient) {
        // Update existing client
        response = await fetch("/api/admin/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentClient.id_cliente, ...formState }),
        })
      } else {
        // Create new client
        response = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el cliente.")
      }

      toast({
        title: "Éxito",
        description: `Cliente ${currentClient ? "actualizado" : "creado"} exitosamente.`,
      })
      fetchClients() // Refresh client list
      handleCloseDialog()
    } catch (err: any) {
      console.error("Error saving client:", err)
      setError(err.message || "Error al guardar el cliente.")
      toast({
        title: "Error",
        description: err.message || "No se pudo guardar el cliente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres desactivar este cliente? Esto lo ocultará de la lista.")) {
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar el cliente.")
      }

      toast({
        title: "Éxito",
        description: "Cliente desactivado exitosamente.",
      })
      fetchClients() // Refresh client list
    } catch (err: any) {
      console.error("Error deleting client:", err)
      setError(err.message || "Error al eliminar el cliente.")
      toast({
        title: "Error",
        description: err.message || "No se pudo desactivar el cliente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-admin-card shadow-sm border-admin-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Clientes</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-admin-primary" />
            <span className="ml-2 text-muted-foreground">Cargando clientes...</span>
          </div>
        ) : clients.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay clientes registrados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>VIP</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id_cliente}>
                  <TableCell className="font-medium">{client.nombre_cliente}</TableCell>
                  <TableCell>{client.telefono_cliente}</TableCell>
                  <TableCell>{client.email_cliente || "N/A"}</TableCell>
                  <TableCell>{client.total_visitas}</TableCell>
                  <TableCell>{client.cliente_vip ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(client)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id_cliente)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-admin-card">
          <DialogHeader>
            <DialogTitle>{currentClient ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre_cliente" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre_cliente"
                value={formState.nombre_cliente}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono_cliente" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono_cliente"
                value={formState.telefono_cliente}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email_cliente" className="text-right">
                Email
              </Label>
              <Input
                id="email_cliente"
                type="email"
                value={formState.email_cliente}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cliente_vip" className="text-right">
                VIP
              </Label>
              <Checkbox
                id="cliente_vip"
                checked={formState.cliente_vip}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, cliente_vip: checked === true }))}
                className="col-span-3"
              />
            </div>
            {currentClient && ( // Only show active status for existing clients
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activo_cliente" className="text-right">
                  Activo
                </Label>
                <Checkbox
                  id="activo_cliente"
                  checked={formState.activo_cliente}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, activo_cliente: checked === true }))}
                  className="col-span-3"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

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
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Peluquero } from "@/lib/database"
import Image from "next/image"

export default function AdminStylistsPage() {
  const [stylists, setStylists] = useState<Peluquero[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStylist, setCurrentStylist] = useState<Peluquero | null>(null) // For editing
  const [formState, setFormState] = useState({
    nombre_peluquero: "",
    especialidad_peluquero: "",
    descripcion_peluquero: "",
    anios_experiencia: 0,
    activo_peluquero: true,
    avatar_iniciales: "",
    avatar_url: "",
    telefono_peluquero: "",
    email_peluquero: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchStylists = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/stylists")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Peluquero[] = await response.json()
      setStylists(data)
    } catch (err) {
      console.error("Error fetching stylists:", err)
      setError("Error al cargar los peluqueros.")
      toast({
        title: "Error",
        description: "No se pudieron cargar los peluqueros.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStylists()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    setFormState((prev) => ({
      ...prev,
      [id]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleCheckboxChange = (id: string, checked: boolean | "indeterminate") => {
    setFormState((prev) => ({
      ...prev,
      [id]: checked === true,
    }))
  }

  const handleOpenDialog = (stylist?: Peluquero) => {
    if (stylist) {
      setCurrentStylist(stylist)
      setFormState({
        nombre_peluquero: stylist.nombre_peluquero,
        especialidad_peluquero: stylist.especialidad_peluquero,
        descripcion_peluquero: stylist.descripcion_peluquero || "",
        anios_experiencia: stylist.anios_experiencia,
        activo_peluquero: stylist.activo_peluquero,
        avatar_iniciales: stylist.avatar_iniciales || "",
        avatar_url: stylist.avatar_url || "",
        telefono_peluquero: stylist.telefono_peluquero || "",
        email_peluquero: stylist.email_peluquero || "",
      })
    } else {
      setCurrentStylist(null)
      setFormState({
        nombre_peluquero: "",
        especialidad_peluquero: "",
        descripcion_peluquero: "",
        anios_experiencia: 0,
        activo_peluquero: true,
        avatar_iniciales: "",
        avatar_url: "",
        telefono_peluquero: "",
        email_peluquero: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setCurrentStylist(null)
    setFormState({
      nombre_peluquero: "",
      especialidad_peluquero: "",
      descripcion_peluquero: "",
      anios_experiencia: 0,
      activo_peluquero: true,
      avatar_iniciales: "",
      avatar_url: "",
      telefono_peluquero: "",
      email_peluquero: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let response
      if (currentStylist) {
        // Update existing stylist
        response = await fetch("/api/admin/stylists", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentStylist.id_peluquero, ...formState }),
        })
      } else {
        // Create new stylist
        response = await fetch("/api/admin/stylists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el peluquero.")
      }

      toast({
        title: "Éxito",
        description: `Peluquero ${currentStylist ? "actualizado" : "creado"} exitosamente.`,
      })
      fetchStylists() // Refresh stylist list
      handleCloseDialog()
    } catch (err: any) {
      console.error("Error saving stylist:", err)
      setError(err.message || "Error al guardar el peluquero.")
      toast({
        title: "Error",
        description: err.message || "No se pudo guardar el peluquero.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStylist = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres desactivar este peluquero? Esto lo ocultará de la lista.")) {
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/stylists", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar el peluquero.")
      }

      toast({
        title: "Éxito",
        description: "Peluquero desactivado exitosamente.",
      })
      fetchStylists() // Refresh stylist list
    } catch (err: any) {
      console.error("Error deleting stylist:", err)
      setError(err.message || "Error al eliminar el peluquero.")
      toast({
        title: "Error",
        description: err.message || "No se pudo desactivar el peluquero.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-admin-card shadow-sm border-admin-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Peluqueros</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Peluquero
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
            <span className="ml-2 text-muted-foreground">Cargando peluqueros...</span>
          </div>
        ) : stylists.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay peluqueros registrados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Experiencia</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stylists.map((stylist) => (
                <TableRow key={stylist.id_peluquero}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                      {stylist.avatar_url ? (
                        <Image
                          src={stylist.avatar_url || "/placeholder.svg"}
                          alt={stylist.nombre_peluquero}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        stylist.avatar_iniciales
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{stylist.nombre_peluquero}</TableCell>
                  <TableCell>{stylist.especialidad_peluquero}</TableCell>
                  <TableCell>{stylist.anios_experiencia} años</TableCell>
                  <TableCell>{stylist.telefono_peluquero || "N/A"}</TableCell>
                  <TableCell>{stylist.activo_peluquero ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(stylist)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteStylist(stylist.id_peluquero)}>
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
            <DialogTitle>{currentStylist ? "Editar Peluquero" : "Nuevo Peluquero"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre_peluquero" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre_peluquero"
                value={formState.nombre_peluquero}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="especialidad_peluquero" className="text-right">
                Especialidad
              </Label>
              <Input
                id="especialidad_peluquero"
                value={formState.especialidad_peluquero}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion_peluquero" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="descripcion_peluquero"
                value={formState.descripcion_peluquero}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anios_experiencia" className="text-right">
                Años Exp.
              </Label>
              <Input
                id="anios_experiencia"
                type="number"
                value={formState.anios_experiencia}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar_iniciales" className="text-right">
                Iniciales Avatar
              </Label>
              <Input
                id="avatar_iniciales"
                value={formState.avatar_iniciales}
                onChange={handleInputChange}
                className="col-span-3"
                maxLength={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar_url" className="text-right">
                URL Avatar
              </Label>
              <Input
                id="avatar_url"
                value={formState.avatar_url}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="/placeholder.svg?height=128&width=128"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono_peluquero" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono_peluquero"
                value={formState.telefono_peluquero}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email_peluquero" className="text-right">
                Email
              </Label>
              <Input
                id="email_peluquero"
                type="email"
                value={formState.email_peluquero}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo_peluquero" className="text-right">
                Activo
              </Label>
              <Checkbox
                id="activo_peluquero"
                checked={formState.activo_peluquero}
                onCheckedChange={(checked) => handleCheckboxChange("activo_peluquero", checked)}
                className="col-span-3"
              />
            </div>
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

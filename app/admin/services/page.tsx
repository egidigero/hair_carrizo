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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Servicio, CategoriaServicio } from "@/lib/database"

export default function AdminServicesPage() {
  const [services, setServices] = useState<Servicio[]>([])
  const [categories, setCategories] = useState<CategoriaServicio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Servicio | null>(null) // For editing
  const [formState, setFormState] = useState({
    nombre_servicio: "",
    descripcion_servicio: "",
    categoria_servicio: "",
    precio_servicio: 0,
    duracion_minutos: 0,
    activo_servicio: true,
    orden_categoria: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchServicesAndCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/services?type=categories"),
      ])

      if (!servicesRes.ok) throw new Error(`HTTP error! status: ${servicesRes.status} al cargar servicios`)
      if (!categoriesRes.ok) throw new Error(`HTTP error! status: ${categoriesRes.status} al cargar categorías`)

      const servicesData: Servicio[] = await servicesRes.json()
      const categoriesData: CategoriaServicio[] = await categoriesRes.json()

      setServices(servicesData)
      setCategories(categoriesData)
    } catch (err: any) {
      console.error("Error fetching services or categories:", err)
      setError(err.message || "Error al cargar servicios y categorías.")
      toast({
        title: "Error",
        description: err.message || "No se pudieron cargar los servicios o categorías.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServicesAndCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    setFormState((prev) => ({
      ...prev,
      [id]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleCheckboxChange = (id: string, checked: boolean | "indeterminate") => {
    setFormState((prev) => ({
      ...prev,
      [id]: checked === true,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      categoria_servicio: value,
    }))
  }

  const handleOpenDialog = (service?: Servicio) => {
    if (service) {
      setCurrentService(service)
      setFormState({
        nombre_servicio: service.nombre_servicio,
        descripcion_servicio: service.descripcion_servicio || "",
        categoria_servicio: service.categoria_servicio,
        precio_servicio: service.precio_servicio,
        duracion_minutos: service.duracion_minutos,
        activo_servicio: service.activo_servicio,
        orden_categoria: service.orden_categoria,
      })
    } else {
      setCurrentService(null)
      setFormState({
        nombre_servicio: "",
        descripcion_servicio: "",
        categoria_servicio: categories.length > 0 ? categories[0].nombre_categoria : "", // Default to first category
        precio_servicio: 0,
        duracion_minutos: 0,
        activo_servicio: true,
        orden_categoria: 0,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setCurrentService(null)
    setFormState({
      nombre_servicio: "",
      descripcion_servicio: "",
      categoria_servicio: "",
      precio_servicio: 0,
      duracion_minutos: 0,
      activo_servicio: true,
      orden_categoria: 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let response
      if (currentService) {
        // Update existing service
        response = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentService.id_servicio, ...formState }),
        })
      } else {
        // Create new service
        response = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el servicio.")
      }

      toast({
        title: "Éxito",
        description: `Servicio ${currentService ? "actualizado" : "creado"} exitosamente.`,
      })
      fetchServicesAndCategories() // Refresh service list
      handleCloseDialog()
    } catch (err: any) {
      console.error("Error saving service:", err)
      setError(err.message || "Error al guardar el servicio.")
      toast({
        title: "Error",
        description: err.message || "No se pudo guardar el servicio.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteService = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres desactivar este servicio? Esto lo ocultará de la lista.")) {
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar el servicio.")
      }

      toast({
        title: "Éxito",
        description: "Servicio desactivado exitosamente.",
      })
      fetchServicesAndCategories() // Refresh service list
    } catch (err: any) {
      console.error("Error deleting service:", err)
      setError(err.message || "Error al eliminar el servicio.")
      toast({
        title: "Error",
        description: err.message || "No se pudo desactivar el servicio.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-admin-card shadow-sm border-admin-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Servicios</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Servicio
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
            <span className="ml-2 text-muted-foreground">Cargando servicios...</span>
          </div>
        ) : services.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay servicios registrados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Duración (min)</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id_servicio}>
                  <TableCell className="font-medium">{service.nombre_servicio}</TableCell>
                  <TableCell>{service.categoria_servicio}</TableCell>
                  <TableCell>${service.precio_servicio.toFixed(2)}</TableCell>
                  <TableCell>{service.duracion_minutos}</TableCell>
                  <TableCell>{service.activo_servicio ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(service)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id_servicio)}>
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
            <DialogTitle>{currentService ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre_servicio" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre_servicio"
                value={formState.nombre_servicio}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion_servicio" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="descripcion_servicio"
                value={formState.descripcion_servicio}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria_servicio" className="text-right">
                Categoría
              </Label>
              <Select value={formState.categoria_servicio} onValueChange={handleSelectChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id_categoria} value={category.nombre_categoria}>
                      {category.nombre_categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio_servicio" className="text-right">
                Precio
              </Label>
              <Input
                id="precio_servicio"
                type="number"
                step="0.01"
                value={formState.precio_servicio}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracion_minutos" className="text-right">
                Duración (min)
              </Label>
              <Input
                id="duracion_minutos"
                type="number"
                value={formState.duracion_minutos}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orden_categoria" className="text-right">
                Orden
              </Label>
              <Input
                id="orden_categoria"
                type="number"
                value={formState.orden_categoria}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo_servicio" className="text-right">
                Activo
              </Label>
              <Checkbox
                id="activo_servicio"
                checked={formState.activo_servicio}
                onCheckedChange={(checked) => handleCheckboxChange("activo_servicio", checked)}
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

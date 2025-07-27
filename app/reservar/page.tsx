"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, Clock, User, Scissors, Loader2, Mail, Phone, UserCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Servicio, Peluquero, HorarioDisponible } from "@/lib/database"

export default function ReservarPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Datos cargados de la API
  const [serviciosData, setServiciosData] = useState<Record<string, Servicio[]>>({})
  const [peluquerosData, setPeluquerosData] = useState<Peluquero[]>([])
  const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDisponible[]>([])

  // Selección del usuario
  const [selectedService, setSelectedService] = useState<Servicio | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<Peluquero | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")

  // Datos del cliente
  const [nombreCliente, setNombreCliente] = useState("")
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [emailCliente, setEmailCliente] = useState("")
  const [notasCliente, setNotasCliente] = useState("")

  // Estados para validación y errores
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitError, setSubmitError] = useState("")

  // Cargar servicios y peluqueros al inicio
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        setSubmitError("")
        console.log("Cargando servicios desde /api/servicios?agrupado=true")
        const serviciosRes = await fetch("/api/servicios?agrupado=true")
        if (!serviciosRes.ok) {
          const errorText = await serviciosRes.text()
          console.error("Error response from /api/servicios:", errorText)
          throw new Error(
            `Error al cargar servicios: ${serviciosRes.status} ${serviciosRes.statusText} - ${errorText.substring(0, 100)}...`,
          )
        }
        const serviciosJson = await serviciosRes.json()
        setServiciosData(serviciosJson)
        console.log("Servicios cargados:", serviciosJson)

        console.log("Cargando todos los peluqueros desde /api/peluqueros")
        const peluquerosRes = await fetch("/api/peluqueros")
        if (!peluquerosRes.ok) {
          const errorText = await peluquerosRes.text()
          console.error("Error response from /api/peluqueros:", errorText)
          throw new Error(
            `Error al cargar peluqueros: ${peluquerosRes.status} ${peluquerosRes.statusText} - ${errorText.substring(0, 100)}...`,
          )
        }
        const peluquerosJson = await peluquerosRes.json()
        setPeluquerosData(peluquerosJson)
        console.log("Peluqueros cargados:", peluquerosJson)
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
        setSubmitError("Error al cargar la información. Inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  // Cargar peluqueros disponibles para el servicio seleccionado
  useEffect(() => {
    if (selectedService) {
      const loadAvailableStylists = async () => {
        setLoading(true)
        try {
          setSubmitError("")
          console.log(`Cargando peluqueros para servicio_id=${selectedService.id_servicio}`)
          const response = await fetch(`/api/peluqueros?servicio_id=${selectedService.id_servicio}`)
          if (!response.ok) {
            const errorText = await response.text()
            console.error("Error response from /api/peluqueros (service-specific):", errorText)
            throw new Error(
              `Error al cargar estilistas: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}...`,
            )
          }
          const data = await response.json()
          setPeluquerosData(data) // Actualiza la lista de peluqueros a solo los disponibles para este servicio
          console.log("Peluqueros disponibles para el servicio:", data)
        } catch (error) {
          console.error("Error al cargar peluqueros por servicio:", error)
          setSubmitError("Error al cargar estilistas disponibles.")
        } finally {
          setLoading(false)
        }
      }
      loadAvailableStylists()
    }
  }, [selectedService])

  // Cargar horarios disponibles cuando se selecciona estilista y fecha
  useEffect(() => {
    if (selectedStylist && selectedDate && selectedService) {
      const loadAvailableTimes = async () => {
        setLoading(true)
        try {
          setSubmitError("")
          const fechaStr = selectedDate.toISOString().split("T")[0]
          console.log(
            `Cargando horarios para peluquero_id=${selectedStylist.id_peluquero}, fecha=${fechaStr}, duracion=${selectedService.duracion_minutos}`,
          )
          const response = await fetch(
            `/api/horarios?peluquero_id=${selectedStylist.id_peluquero}&fecha=${fechaStr}&duracion_minutos=${selectedService.duracion_minutos}`,
          )
          if (!response.ok) {
            const errorText = await response.text()
            console.error("Error response from /api/horarios:", errorText)
            throw new Error(
              `Error al cargar horarios: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}...`,
            )
          }
          const data = await response.json()
          setHorariosDisponibles(data)
          console.log("Horarios disponibles:", data)
        } catch (error) {
          console.error("Error al cargar horarios:", error)
          setSubmitError("Error al cargar horarios disponibles.")
        } finally {
          setLoading(false)
        }
      }
      loadAvailableTimes()
    }
  }, [selectedStylist, selectedDate, selectedService])

  const validateClientData = () => {
    const newErrors: { [key: string]: string } = {}

    if (!nombreCliente.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!telefonoCliente.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (telefonoCliente.trim().length < 8) {
      newErrors.telefono = "El teléfono debe tener al menos 8 dígitos"
    }
    if (emailCliente.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailCliente)) {
        newErrors.email = "Formato de email inválido"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleServiceSelect = (service: Servicio) => {
    setSelectedService(service)
    setSelectedStylist(null)
    setSelectedDate(undefined)
    setSelectedTime("")
    setStep(2)
  }

  const handleStylistSelect = (stylist: Peluquero) => {
    setSelectedStylist(stylist)
    setSelectedDate(undefined)
    setSelectedTime("")
    setStep(3)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime("")
    if (date) setStep(4)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(5)
  }

  const handleConfirm = async () => {
    setSubmitError("")

    if (!validateClientData()) return

    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) {
      setSubmitError("Faltan datos para completar la reserva")
      return
    }

    setLoading(true)
    try {
      setSubmitError("")
      const reserva = {
        nombre_cliente: nombreCliente.trim(),
        telefono_cliente: telefonoCliente.trim(),
        email_cliente: emailCliente.trim() || undefined, // Enviar undefined si está vacío
        id_servicio: selectedService.id_servicio,
        id_peluquero: selectedStylist.id_peluquero,
        fecha_turno: selectedDate.toISOString().split("T")[0],
        hora_inicio_turno: selectedTime,
        notas_cliente: notasCliente.trim() || undefined, // Enviar undefined si está vacío
      }

      console.log("Enviando reserva:", reserva)
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      })

      const result = await response.json()
      console.log("Respuesta de la reserva:", result)

      if (result.success) {
        alert(
          `¡Reserva confirmada para ${nombreCliente}! Te enviaremos un email de confirmación a ${emailCliente || "tu correo"}.`,
        )
        resetBooking()
      } else {
        setSubmitError(result.error || "Error al procesar la reserva")
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error)
      setSubmitError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedStylist(null)
    setSelectedDate(undefined)
    setSelectedTime("")
    setNombreCliente("")
    setTelefonoCliente("")
    setEmailCliente("")
    setNotasCliente("")
    setErrors({})
    setSubmitError("")
    // Recargar datos iniciales para asegurar que las listas de servicios y peluqueros estén completas
    const loadInitialData = async () => {
      setLoading(true)
      try {
        setSubmitError("")
        const [serviciosRes, peluquerosRes] = await Promise.all([
          fetch("/api/servicios?agrupado=true"),
          fetch("/api/peluqueros"),
        ])
        if (!serviciosRes.ok) {
          const errorText = await serviciosRes.text()
          console.error("Error response from /api/servicios:", errorText)
          throw new Error(
            `Error al cargar servicios: ${serviciosRes.status} ${serviciosRes.statusText} - ${errorText.substring(0, 100)}...`,
          )
        }
        if (!peluquerosRes.ok) {
          const errorText = await peluquerosRes.text()
          console.error("Error response from /api/peluqueros:", errorText)
          throw new Error(
            `Error al cargar peluqueros: ${peluquerosRes.status} ${peluquerosRes.statusText} - ${errorText.substring(0, 100)}...`,
          )
        }
        const serviciosJson = await serviciosRes.json()
        const peluquerosJson = await peluquerosRes.json()
        setServiciosData(serviciosJson)
        setPeluquerosData(peluquerosJson)
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }

  const isFormValid =
    nombreCliente.trim() &&
    telefonoCliente.trim() &&
    Object.keys(errors).length === 0 &&
    (emailCliente.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente))

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Hair Carrizo Logo" width={200} height={80} className="h-10 w-auto" />
            </Link>
            <Button
              variant="outline"
              onClick={resetBooking}
              className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white bg-transparent"
            >
              NUEVA RESERVA
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-16 h-0.5 ${step > stepNumber ? "bg-amber-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                {step === 1 && "SELECCIONA UN SERVICIO"}
                {step === 2 && "ELIGE TU ESTILISTA"}
                {step === 3 && "SELECCIONA LA FECHA"}
                {step === 4 && "ELIGE LA HORA"}
                {step === 5 && "COMPLETA TUS DATOS"}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">SELECCIONA UN SERVICIO</h2>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <span className="ml-2 text-gray-600">Cargando servicios...</span>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(serviciosData).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="text-xl font-medium text-amber-700 mb-6 text-center tracking-wide">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryServices.map((service) => (
                        <Card
                          key={service.id_servicio}
                          className="cursor-pointer hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-amber-300 group"
                          onClick={() => handleServiceSelect(service)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start mb-3">
                              <CardTitle className="text-lg font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
                                {service.nombre_servicio}
                              </CardTitle>
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                                ${service.precio_servicio}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center text-gray-500 mb-3">
                              <Clock className="h-4 w-4 mr-2 text-amber-600" />
                              {service.duracion_minutos} min
                            </CardDescription>
                            <CardDescription className="text-gray-600 leading-relaxed">
                              {service.descripcion_servicio}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Stylist Selection */}
        {step === 2 && selectedService && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-600 hover:text-amber-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                VOLVER
              </Button>
              <div className="text-center">
                <h2 className="text-3xl font-light text-gray-900">ELIGE TU ESTILISTA</h2>
                <p className="text-gray-600 mt-2">Para: {selectedService.nombre_servicio}</p>
              </div>
              <div></div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <span className="ml-2 text-gray-600">Cargando estilistas...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {peluquerosData.map((stylist) => (
                  <Card
                    key={stylist.id_peluquero}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-amber-300 group"
                    onClick={() => handleStylistSelect(stylist)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl font-medium text-white">{stylist.avatar_iniciales}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                            {stylist.nombre_peluquero}
                          </CardTitle>
                          <CardDescription>
                            <div className="text-amber-600 font-medium mb-1">{stylist.especialidad_peluquero}</div>
                            <div className="text-gray-500 text-sm">{stylist.anios_experiencia} años de experiencia</div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date Selection */}
        {step === 3 && selectedStylist && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-600 hover:text-amber-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                VOLVER
              </Button>
              <div className="text-center">
                <h2 className="text-3xl font-light text-gray-900">SELECCIONA LA FECHA</h2>
                <p className="text-gray-600 mt-2">Con: {selectedStylist.nombre_peluquero}</p>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center">
              <Card className="shadow-lg border-amber-100">
                <CardContent className="p-8">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Time Selection */}
        {step === 4 && selectedDate && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <Button variant="ghost" onClick={() => setStep(3)} className="text-gray-600 hover:text-amber-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                VOLVER
              </Button>
              <div className="text-center">
                <h2 className="text-3xl font-light text-gray-900">ELIGE LA HORA</h2>
                <p className="text-gray-600 mt-2">
                  {selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div></div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <span className="ml-2 text-gray-600">Cargando horarios...</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
                {horariosDisponibles.length > 0 ? (
                  horariosDisponibles.map((slot) => (
                    <Button
                      key={slot.hora}
                      variant={selectedTime === slot.hora ? "default" : "outline"}
                      className={
                        selectedTime === slot.hora
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "border-amber-300 text-amber-700 hover:bg-amber-600 hover:text-white"
                      }
                      onClick={() => handleTimeSelect(slot.hora)}
                      disabled={!slot.disponible}
                    >
                      {slot.hora}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    No hay horarios disponibles para esta fecha.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Client Data + Confirmation */}
        {step === 5 && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <Button variant="ghost" onClick={() => setStep(4)} className="text-gray-600 hover:text-amber-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                VOLVER
              </Button>
              <h2 className="text-3xl font-light text-gray-900">COMPLETA TUS DATOS</h2>
              <div></div>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de datos del cliente */}
              <Card className="shadow-lg border-amber-100">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-amber-600" />
                    DATOS PERSONALES
                  </CardTitle>
                  <CardDescription>Los campos con * son obligatorios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="nombre" className="text-gray-700">
                      NOMBRE COMPLETO *
                    </Label>
                    <Input
                      id="nombre"
                      value={nombreCliente}
                      onChange={(e) => {
                        setNombreCliente(e.target.value)
                        if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: "" }))
                      }}
                      className={`${errors.nombre ? "border-red-500" : "border-amber-200"} focus:border-amber-500`}
                      placeholder="Tu nombre completo"
                      required
                    />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <Label htmlFor="telefono" className="text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      TELÉFONO *
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={telefonoCliente}
                      onChange={(e) => {
                        setTelefonoCliente(e.target.value)
                        if (errors.telefono) setErrors((prev) => ({ ...prev, telefono: "" }))
                      }}
                      className={`${errors.telefono ? "border-red-500" : "border-amber-200"} focus:border-amber-500`}
                      placeholder="+54 11 1234-5678"
                      required
                    />
                    {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      EMAIL (Opcional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailCliente}
                      onChange={(e) => {
                        setEmailCliente(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                      }}
                      className={`${errors.email ? "border-red-500" : "border-amber-200"} focus:border-amber-500`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="notas" className="text-gray-700">
                      NOTAS ADICIONALES (Opcional)
                    </Label>
                    <Textarea
                      id="notas"
                      value={notasCliente}
                      onChange={(e) => setNotasCliente(e.target.value)}
                      className="border-amber-200 focus:border-amber-500"
                      rows={3}
                      placeholder="Comentarios especiales, preferencias, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de la reserva */}
              <Card className="shadow-lg border-amber-100">
                <CardHeader>
                  <CardTitle className="text-gray-900">RESUMEN DE TU CITA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Scissors className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedService?.nombre_servicio}</p>
                      <p className="text-sm text-gray-600">
                        ${selectedService?.precio_servicio} - {selectedService?.duracion_minutos} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <User className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedStylist?.nombre_peluquero}</p>
                      <p className="text-sm text-gray-600">{selectedStylist?.especialidad_peluquero}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedDate?.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{selectedTime}</p>
                    </div>
                  </div>

                  {nombreCliente && telefonoCliente && (
                    <div className="flex items-center space-x-4 border-t border-amber-100 pt-4">
                      <UserCheck className="h-6 w-6 text-amber-600" />
                      <div>
                        <p className="font-medium text-gray-900">{nombreCliente}</p>
                        <p className="text-sm text-gray-600">{emailCliente}</p>
                        <p className="text-sm text-gray-600">{telefonoCliente}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-amber-100 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">TOTAL:</span>
                      <span className="text-amber-600 font-medium text-xl">${selectedService?.precio_servicio}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                    onClick={handleConfirm}
                    disabled={loading || !isFormValid}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        PROCESANDO...
                      </>
                    ) : (
                      "CONFIRMAR RESERVA"
                    )}
                  </Button>
                  {!isFormValid && (
                    <p className="text-gray-500 text-sm text-center">Completa los campos obligatorios para continuar</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

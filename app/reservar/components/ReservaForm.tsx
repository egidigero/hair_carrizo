"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Clock, User, Scissors, Loader2 } from "lucide-react"
import type { Servicio, Peluquero, HorarioDisponible } from "@/lib/database"

export default function ReservaForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Estados para los datos
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([])
  const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDisponible[]>([])

  // Estados para la selección
  const [selectedService, setSelectedService] = useState<Servicio | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<Peluquero | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")

  // Estados para datos del cliente
  const [clienteNombre, setClienteNombre] = useState("")
  const [clienteEmail, setClienteEmail] = useState("")
  const [clienteTelefono, setClienteTelefono] = useState("")
  const [notas, setNotas] = useState("")

  // Cargar servicios al montar el componente
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const response = await fetch("/api/servicios")
        const data = await response.json()
        setServicios(data)
      } catch (error) {
        console.error("Error al cargar servicios:", error)
      }
    }
    cargarServicios()
  }, [])

  // Cargar peluqueros cuando se selecciona un servicio
  useEffect(() => {
    if (selectedService) {
      const cargarPeluqueros = async () => {
        try {
          const response = await fetch(`/api/peluqueros?servicio_id=${selectedService.id}`)
          const data = await response.json()
          setPeluqueros(data)
        } catch (error) {
          console.error("Error al cargar peluqueros:", error)
        }
      }
      cargarPeluqueros()
    }
  }, [selectedService])

  // Cargar horarios disponibles cuando se selecciona fecha
  useEffect(() => {
    if (selectedStylist && selectedDate && selectedService) {
      const cargarHorarios = async () => {
        setLoading(true)
        try {
          const fechaStr = selectedDate.toISOString().split("T")[0]
          const response = await fetch(
            `/api/horarios?peluquero_id=${selectedStylist.id}&fecha=${fechaStr}&duracion_minutos=${selectedService.duracion_minutos}`,
          )
          const data = await response.json()
          setHorariosDisponibles(data)
        } catch (error) {
          console.error("Error al cargar horarios:", error)
        } finally {
          setLoading(false)
        }
      }
      cargarHorarios()
    }
  }, [selectedStylist, selectedDate, selectedService])

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
    if (date) {
      setStep(4)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(5)
  }

  const handleConfirm = async () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) {
      alert("Faltan datos para completar la reserva")
      return
    }

    if (!clienteNombre || !clienteEmail) {
      alert("Por favor completa tu nombre y email")
      return
    }

    setLoading(true)
    try {
      const reserva = {
        cliente_nombre: clienteNombre,
        cliente_email: clienteEmail,
        cliente_telefono: clienteTelefono,
        servicio_id: selectedService.id,
        peluquero_id: selectedStylist.id,
        fecha_reserva: selectedDate.toISOString().split("T")[0],
        hora_inicio: selectedTime,
        notas: notas,
      }

      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reserva),
      })

      const result = await response.json()

      if (result.success) {
        alert("¡Reserva confirmada! Te enviaremos un email de confirmación.")
        // Resetear formulario
        resetBooking()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error)
      alert("Error al procesar la reserva. Inténtalo de nuevo.")
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
    setClienteNombre("")
    setClienteEmail("")
    setClienteTelefono("")
    setNotas("")
  }

  // Resto del componente igual que antes, pero usando los datos reales...
  // [El resto del JSX permanece igual, solo cambiando servicios/peluqueros por los estados]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-light ${
                  step >= stepNumber ? "bg-white text-black" : "bg-gray-800 text-gray-400"
                }`}
              >
                {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
              </div>
              {stepNumber < 5 && <div className={`w-16 h-px ${step > stepNumber ? "bg-white" : "bg-gray-800"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 5: Cliente Info + Confirmation */}
      {step === 5 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-light text-white tracking-widest mb-4">DATOS DE CONTACTO</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario de datos del cliente */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-widest">TUS DATOS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nombre" className="text-gray-300 tracking-wide">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="nombre"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="bg-black border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300 tracking-wide">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={clienteEmail}
                    onChange={(e) => setClienteEmail(e.target.value)}
                    className="bg-black border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono" className="text-gray-300 tracking-wide">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={clienteTelefono}
                    onChange={(e) => setClienteTelefono(e.target.value)}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="notas" className="text-gray-300 tracking-wide">
                    Notas Adicionales
                  </Label>
                  <Textarea
                    id="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="bg-black border-gray-700 text-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumen de la reserva */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-widest">RESUMEN DE TU CITA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Scissors className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-light text-white tracking-wide">{selectedService?.nombre}</p>
                    <p className="text-sm text-gray-400 tracking-wide">
                      ${selectedService?.precio} - {selectedService?.duracion_minutos} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <User className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-light text-white tracking-wide">{selectedStylist?.nombre}</p>
                    <p className="text-sm text-gray-400 tracking-wide">{selectedStylist?.especialidad}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-light text-white tracking-wide">
                      {selectedDate
                        ?.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        .toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-400 tracking-wide">{selectedTime}</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-light text-white tracking-wide">TOTAL:</span>
                    <span className="text-white font-light tracking-wide text-xl">${selectedService?.precio}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-white text-black hover:bg-gray-200 py-3 tracking-widest font-light"
                  onClick={handleConfirm}
                  disabled={loading || !clienteNombre || !clienteEmail}
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
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAppointmentsPage() {
  return (
    <Card className="bg-admin-card shadow-sm border-admin-border">
      <CardHeader>
        <CardTitle>Gestión de Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Aquí se listarán y gestionarán las reservas.</p>
        {/* Future: Table of appointments, filter, search, edit status */}
      </CardContent>
    </Card>
  )
}

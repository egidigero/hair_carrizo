import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSchedulesPage() {
  return (
    <Card className="bg-admin-card shadow-sm border-admin-border">
      <CardHeader>
        <CardTitle>Gestión de Horarios</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí se listarán y gestionarán los horarios de trabajo de los peluqueros.
        </p>
        {/* Future: Table of schedules, add/edit forms */}
      </CardContent>
    </Card>
  )
}

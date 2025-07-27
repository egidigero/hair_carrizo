import type React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Home, Users, Calendar, Scissors, Clock, DollarSign, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-admin-background text-admin-foreground">
        <Sidebar
          side="left"
          collapsible="icon"
          className="bg-admin-card border-r border-admin-border"
          style={
            {
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "4rem",
              "--sidebar-background": "var(--admin-card)",
              "--sidebar-foreground": "var(--admin-foreground)",
              "--sidebar-accent": "var(--admin-accent)",
              "--sidebar-accent-foreground": "var(--admin-accent-foreground)",
              "--sidebar-border": "var(--admin-border)",
              "--sidebar-ring": "var(--admin-ring)",
            } as React.CSSProperties
          }
        >
          <SidebarHeader className="p-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Hair Carrizo Logo" width={100} height={40} className="h-8 w-auto" />
              <span className="text-lg font-semibold group-data-[state=collapsed]:hidden">Admin Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-auto py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/admin">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Clientes">
                  <Link href="/admin/clients">
                    <Users />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Peluqueros">
                  <Link href="/admin/stylists">
                    <Scissors />
                    <span>Peluqueros</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Servicios">
                  <Link href="/admin/services">
                    <DollarSign />
                    <span>Servicios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Horarios">
                  <Link href="/admin/schedules">
                    <Clock />
                    <span>Horarios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reservas">
                  <Link href="/admin/appointments">
                    <Calendar />
                    <span>Reservas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarHeader className="p-4 border-t border-admin-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Configuración">
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Cerrar Sesión">
                  <Link href="/logout">
                    {" "}
                    {/* Placeholder for logout */}
                    <LogOut />
                    <span>Cerrar Sesión</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-admin-border px-4 bg-admin-card">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-admin-border" />
            <h1 className="text-xl font-semibold">Panel de Administración</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

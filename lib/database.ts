import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// ============================================
// INTERFACES ACTUALIZADAS
// ============================================

export interface Servicio {
  id_servicio: number
  nombre_servicio: string
  descripcion_servicio?: string // Hacer opcional
  categoria_servicio: string
  precio_servicio: number
  duracion_minutos: number
  activo_servicio: boolean
  orden_categoria: number
  created_at: string
  updated_at: string
}

export interface Peluquero {
  id_peluquero: number
  nombre_peluquero: string
  especialidad_peluquero: string
  descripcion_peluquero?: string // Hacer opcional
  anios_experiencia: number
  activo_peluquero: boolean
  avatar_iniciales: string
  avatar_url?: string // Nueva propiedad
  telefono_peluquero?: string
  email_peluquero?: string
  created_at: string
  updated_at: string
}

export interface Reserva {
  id_reserva?: number
  nombre_cliente: string
  telefono_cliente: string
  email_cliente?: string
  id_peluquero: number
  id_servicio: number
  fecha_turno: string
  hora_inicio_turno: string
  hora_fin_turno: string
  estado_reserva?: "pendiente" | "confirmado" | "cancelado"
  notas_cliente?: string
  precio_final?: number
}

export interface HorarioDisponible {
  hora: string
  disponible: boolean
}

export interface Cliente {
  id_cliente: number
  nombre_cliente: string
  telefono_cliente: string
  email_cliente?: string
  total_visitas: number
  cliente_vip: boolean
  created_at: string // Añadir created_at para mostrar en la tabla
  updated_at: string // Añadir updated_at
  activo_cliente: boolean // Añadir activo_cliente
}

export interface DailyRevenue {
  fecha: string
  daily_revenue: number
}

export interface RecentReserva {
  id_reserva: number
  nombre_cliente: string
  telefono_cliente: string
  fecha_turno: string
  hora_inicio_turno: string
  nombre_servicio: string
  nombre_peluquero: string
  precio_final: number
  estado_reserva: string
}

export interface CategoriaServicio {
  id_categoria: number
  nombre_categoria: string
  descripcion_categoria?: string
  orden_visualizacion: number
  activa_categoria: boolean
}

// ============================================
// FUNCIONES PARA SERVICIOS
// ============================================

export async function getServicios(): Promise<Servicio[]> {
  try {
    const result = await sql`
    SELECT 
      id_servicio, 
      nombre_servicio, 
      descripcion_servicio, 
      categoria_servicio, 
      precio_servicio, 
      duracion_minutos,
      activo_servicio,
      orden_categoria,
      created_at,
      updated_at
    FROM servicios 
    WHERE activo_servicio = true 
    ORDER BY categoria_servicio, orden_categoria, nombre_servicio
  `
    return result.map((row) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })) as Servicio[]
  } catch (error) {
    console.error("Error al obtener servicios:", error)
    throw new Error("Error al cargar servicios")
  }
}

export async function getServiciosPorCategoria(): Promise<Record<string, Servicio[]>> {
  try {
    const servicios = await getServicios()
    return servicios.reduce(
      (acc, servicio) => {
        if (!acc[servicio.categoria_servicio]) {
          acc[servicio.categoria_servicio] = []
        }
        acc[servicio.categoria_servicio].push(servicio)
        return acc
      },
      {} as Record<string, Servicio[]>,
    )
  } catch (error) {
    console.error("Error al agrupar servicios por categoría:", error)
    throw new Error("Error al cargar servicios por categoría")
  }
}

export async function createServicio(
  servicio: Omit<Servicio, "id_servicio" | "created_at" | "updated_at">,
): Promise<Servicio> {
  try {
    const result = await sql`
    INSERT INTO servicios (nombre_servicio, descripcion_servicio, categoria_servicio, precio_servicio, duracion_minutos, activo_servicio, orden_categoria)
    VALUES (
      ${servicio.nombre_servicio}, 
      ${servicio.descripcion_servicio || null}, 
      ${servicio.categoria_servicio}, 
      ${servicio.precio_servicio}, 
      ${servicio.duracion_minutos}, 
      ${servicio.activo_servicio || true},
      ${servicio.orden_categoria || 0}
    )
    RETURNING id_servicio, nombre_servicio, descripcion_servicio, categoria_servicio, precio_servicio, duracion_minutos, activo_servicio, orden_categoria, created_at, updated_at
  `
    return {
      ...result[0],
      created_at:
        result[0].created_at instanceof Date ? result[0].created_at.toISOString() : String(result[0].created_at),
      updated_at:
        result[0].updated_at instanceof Date ? result[0].updated_at.toISOString() : String(result[0].updated_at),
    } as Servicio
  } catch (error) {
    console.error("Error al crear servicio:", error)
    throw new Error("Error al crear servicio")
  }
}

export async function updateServicio(
  id: number,
  servicio: Partial<Omit<Servicio, "id_servicio" | "created_at">>,
): Promise<Servicio> {
  try {
    const result = await sql`
    UPDATE servicios
    SET 
      nombre_servicio = COALESCE(${servicio.nombre_servicio}, nombre_servicio),
      descripcion_servicio = COALESCE(${servicio.descripcion_servicio || null}, descripcion_servicio),
      categoria_servicio = COALESCE(${servicio.categoria_servicio}, categoria_servicio),
      precio_servicio = COALESCE(${servicio.precio_servicio}, precio_servicio),
      duracion_minutos = COALESCE(${servicio.duracion_minutos}, duracion_minutos),
      activo_servicio = COALESCE(${servicio.activo_servicio}, activo_servicio),
      orden_categoria = COALESCE(${servicio.orden_categoria}, orden_categoria),
      updated_at = CURRENT_TIMESTAMP
    WHERE id_servicio = ${id}
    RETURNING id_servicio, nombre_servicio, descripcion_servicio, categoria_servicio, precio_servicio, duracion_minutos, activo_servicio, orden_categoria, created_at, updated_at
  `
    if (result.length === 0) {
      throw new Error("Servicio no encontrado para actualizar")
    }
    return {
      ...result[0],
      created_at:
        result[0].created_at instanceof Date ? result[0].created_at.toISOString() : String(result[0].created_at),
      updated_at:
        result[0].updated_at instanceof Date ? result[0].updated_at.toISOString() : String(result[0].updated_at),
    } as Servicio
  } catch (error) {
    console.error("Error al actualizar servicio:", error)
    throw new Error("Error al actualizar servicio")
  }
}

export async function deleteServicio(id: number): Promise<void> {
  try {
    // Eliminación lógica
    await sql`
    UPDATE servicios
    SET activo_servicio = false, updated_at = CURRENT_TIMESTAMP
    WHERE id_servicio = ${id}
  `
  } catch (error) {
    console.error("Error al eliminar servicio:", error)
    throw new Error("Error al eliminar servicio")
  }
}

export async function getCategoriasServicios(): Promise<CategoriaServicio[]> {
  try {
    const result = await sql`
    SELECT id_categoria, nombre_categoria, descripcion_categoria, orden_visualizacion, activa_categoria
    FROM categorias_servicios
    WHERE activa_categoria = true
    ORDER BY orden_visualizacion, nombre_categoria
  `
    return result as CategoriaServicio[]
  } catch (error) {
    console.error("Error al obtener categorías de servicios:", error)
    throw new Error("Error al cargar categorías de servicios")
  }
}

// ============================================
// FUNCIONES PARA PELUQUEROS (CRUD)
// ============================================

export async function getPeluqueros(): Promise<Peluquero[]> {
  try {
    const result = await sql`
    SELECT
      id_peluquero,
      nombre_peluquero,
      especialidad_peluquero,
      descripcion_peluquero,
      anios_experiencia,
      activo_peluquero,
      avatar_iniciales,
      avatar_url,
      telefono_peluquero,
      email_peluquero,
      created_at,
      updated_at
    FROM peluqueros
    WHERE activo_peluquero = true
    ORDER BY nombre_peluquero
  `
    return result.map((row) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })) as Peluquero[]
  } catch (error) {
    console.error("Error al obtener peluqueros:", error)
    throw new Error("Error al cargar peluqueros")
  }
}

export async function getPeluquerosPorServicio(servicioId: number): Promise<Peluquero[]> {
  try {
    const result = await sql`
      SELECT
        p.id_peluquero,
        p.nombre_peluquero,
        p.especialidad_peluquero,
        p.descripcion_peluquero,
        p.anios_experiencia,
        p.activo_peluquero,
        p.avatar_iniciales,
        p.avatar_url,
        p.telefono_peluquero,
        p.email_peluquero,
        p.created_at,
        p.updated_at
      FROM peluqueros p
      JOIN peluquero_servicios ps ON p.id_peluquero = ps.id_peluquero
      WHERE ps.id_servicio = ${servicioId} AND p.activo_peluquero = true
      ORDER BY p.nombre_peluquero
    `
    return result.map((row) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })) as Peluquero[]
  } catch (error) {
    console.error(`Error al obtener peluqueros por servicio ${servicioId}:`, error)
    throw new Error("Error al cargar peluqueros por servicio")
  }
}

export async function createPeluquero(
  peluquero: Omit<Peluquero, "id_peluquero" | "created_at" | "updated_at">,
): Promise<Peluquero> {
  try {
    const result = await sql`
    INSERT INTO peluqueros (nombre_peluquero, especialidad_peluquero, descripcion_peluquero, anios_experiencia, activo_peluquero, avatar_iniciales, avatar_url, telefono_peluquero, email_peluquero)
    VALUES (
      ${peluquero.nombre_peluquero}, 
      ${peluquero.especialidad_peluquero}, 
      ${peluquero.descripcion_peluquero || null}, 
      ${peluquero.anios_experiencia || 0}, 
      ${peluquero.activo_peluquero || true}, 
      ${peluquero.avatar_iniciales || null}, 
      ${peluquero.avatar_url || null},
      ${peluquero.telefono_peluquero || null},
      ${peluquero.email_peluquero || null}
    )
    RETURNING id_peluquero, nombre_peluquero, especialidad_peluquero, descripcion_peluquero, anios_experiencia, activo_peluquero, avatar_iniciales, avatar_url, telefono_peluquero, email_peluquero, created_at, updated_at
  `
    return {
      ...result[0],
      created_at:
        result[0].created_at instanceof Date ? result[0].created_at.toISOString() : String(result[0].created_at),
      updated_at:
        result[0].updated_at instanceof Date ? result[0].updated_at.toISOString() : String(result[0].updated_at),
    } as Peluquero
  } catch (error) {
    console.error("Error al crear peluquero:", error)
    throw new Error("Error al crear peluquero")
  }
}

export async function updatePeluquero(
  id: number,
  peluquero: Partial<Omit<Peluquero, "id_peluquero" | "created_at">>,
): Promise<Peluquero> {
  try {
    const result = await sql`
    UPDATE peluqueros
    SET 
      nombre_peluquero = COALESCE(${peluquero.nombre_peluquero}, nombre_peluquero),
      especialidad_peluquero = COALESCE(${peluquero.especialidad_peluquero}, especialidad_peluquero),
      descripcion_peluquero = COALESCE(${peluquero.descripcion_peluquero || null}, descripcion_peluquero),
      anios_experiencia = COALESCE(${peluquero.anios_experiencia}, anios_experiencia),
      activo_peluquero = COALESCE(${peluquero.activo_peluquero}, activo_peluquero),
      avatar_iniciales = COALESCE(${peluquero.avatar_iniciales || null}, avatar_iniciales),
      avatar_url = COALESCE(${peluquero.avatar_url || null}, avatar_url),
      telefono_peluquero = COALESCE(${peluquero.telefono_peluquero || null}, telefono_peluquero),
      email_peluquero = COALESCE(${peluquero.email_peluquero || null}, email_peluquero),
      updated_at = CURRENT_TIMESTAMP
    WHERE id_peluquero = ${id}
    RETURNING id_peluquero, nombre_peluquero, especialidad_peluquero, descripcion_peluquero, anios_experiencia, activo_peluquero, avatar_iniciales, avatar_url, telefono_peluquero, email_peluquero, created_at, updated_at
  `
    if (result.length === 0) {
      throw new Error("Peluquero no encontrado para actualizar")
    }
    return {
      ...result[0],
      created_at:
        result[0].created_at instanceof Date ? result[0].created_at.toISOString() : String(result[0].created_at),
      updated_at:
        result[0].updated_at instanceof Date ? result[0].updated_at.toISOString() : String(result[0].updated_at),
    } as Peluquero
  } catch (error) {
    console.error("Error al actualizar peluquero:", error)
    throw new Error("Error al actualizar peluquero")
  }
}

export async function deletePeluquero(id: number): Promise<void> {
  try {
    // Eliminación lógica
    await sql`
    UPDATE peluqueros
    SET activo_peluquero = false, updated_at = CURRENT_TIMESTAMP
    WHERE id_peluquero = ${id}
  `
  } catch (error) {
    console.error("Error al eliminar peluquero:", error)
    throw new Error("Error al eliminar peluquero")
  }
}

// ============================================
// FUNCIONES PARA HORARIOS
// ============================================

export async function getHorariosDisponibles(
  idPeluquero: number,
  fecha: string,
  duracionMinutos: number,
): Promise<HorarioDisponible[]> {
  try {
    const diaSemana = new Date(fecha).getDay() || 7 // Convertir domingo (0) a 7

    // Obtener horario de trabajo del peluquero
    const horarioTrabajo = await sql`
    SELECT hora_inicio, hora_fin 
    FROM horarios_trabajo 
    WHERE id_peluquero = ${idPeluquero} 
    AND dia_semana = ${diaSemana} 
    AND activo_horario = true
  `

    if (horarioTrabajo.length === 0) {
      return []
    }

    // Obtener reservas existentes para esa fecha
    const reservasExistentes = await sql`
    SELECT hora_inicio_turno, hora_fin_turno 
    FROM reservas 
    WHERE id_peluquero = ${idPeluquero} 
    AND fecha_turno = ${fecha}
    AND estado_reserva IN ('pendiente', 'confirmado')
  `

    // Generar slots de 30 minutos
    const slots: HorarioDisponible[] = []
    const horaInicio = horarioTrabajo[0].hora_inicio
    const horaFin = horarioTrabajo[0].hora_fin

    let horaActual = new Date(`2000-01-01 ${horaInicio}`)
    const horaLimite = new Date(`2000-01-01 ${horaFin}`)

    while (horaActual < horaLimite) {
      const horaStr = horaActual.toTimeString().slice(0, 5)

      // Calcular hora de fin del servicio
      const horaFinServicio = new Date(horaActual.getTime() + duracionMinutos * 60000)

      // Verificar si hay conflicto con reservas existentes
      const hayConflicto = reservasExistentes.some((reserva: any) => {
        const inicioReserva = new Date(`2000-01-01 ${reserva.hora_inicio_turno}`)
        const finReserva = new Date(`2000-01-01 ${reserva.hora_fin_turno}`)
        return horaActual < finReserva && horaFinServicio > inicioReserva
      })

      // Verificar que el servicio termine antes del cierre
      const disponible = !hayConflicto && horaFinServicio <= horaLimite

      slots.push({
        hora: horaStr,
        disponible,
      })

      // Avanzar 30 minutos
      horaActual = new Date(horaActual.getTime() + 30 * 60000)
    }

    return slots
  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error)
    throw new Error("Error al cargar horarios disponibles")
  }
}

// ============================================
// FUNCIONES PARA RESERVAS
// ============================================

export async function crearReserva(reserva: Reserva): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    // Validaciones básicas
    if (!reserva.nombre_cliente?.trim() || !reserva.telefono_cliente?.trim()) {
      return { success: false, error: "Nombre y teléfono son obligatorios" }
    }

    // Validar email si se proporciona
    if (reserva.email_cliente && reserva.email_cliente.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(reserva.email_cliente)) {
        return { success: false, error: "Formato de email inválido" }
      }
    }

    // Obtener información del servicio para calcular hora de fin
    const servicio = await sql`
    SELECT duracion_minutos, precio_servicio 
    FROM servicios 
    WHERE id_servicio = ${reserva.id_servicio}
  `

    if (servicio.length === 0) {
      return { success: false, error: "Servicio no encontrado" }
    }

    const duracionMinutos = servicio[0].duracion_minutos
    const precioServicio = servicio[0].precio_servicio

    // Calcular hora de fin
    const horaInicio = new Date(`2000-01-01 ${reserva.hora_inicio_turno}`)
    const horaFin = new Date(horaInicio.getTime() + duracionMinutos * 60000)
    const horaFinStr = horaFin.toTimeString().slice(0, 5)

    // Verificar disponibilidad usando la función de la base de datos
    const disponibilidad = await sql`
    SELECT verificar_disponibilidad_horario(
      ${reserva.id_peluquero}, 
      ${reserva.fecha_turno}::date, 
      ${reserva.hora_inicio_turno}::time, 
      ${horaFinStr}::time
    ) as disponible
  `

    if (!disponibilidad[0].disponible) {
      return { success: false, error: "El horario ya no está disponible" }
    }

    // Crear la reserva
    const result = await sql`
    INSERT INTO reservas (
      nombre_cliente, 
      telefono_cliente, 
      email_cliente,
      id_peluquero, 
      id_servicio, 
      fecha_turno,
      hora_inicio_turno, 
      hora_fin_turno, 
      estado_reserva,
      notas_cliente,
      precio_final
    ) VALUES (
      ${reserva.nombre_cliente.trim()}, 
      ${reserva.telefono_cliente.trim()}, 
      ${reserva.email_cliente?.trim() || null},
      ${reserva.id_peluquero}, 
      ${reserva.id_servicio}, 
      ${reserva.fecha_turno},
      ${reserva.hora_inicio_turno}, 
      ${horaFinStr}, 
      'pendiente',
      ${reserva.notas_cliente?.trim() || null},
      ${precioServicio}
    )
    RETURNING id_reserva
  `

    // Actualizar o crear cliente
    await sql`
    INSERT INTO clientes (nombre_cliente, telefono_cliente, email_cliente, total_visitas)
    VALUES (${reserva.nombre_cliente.trim()}, ${reserva.telefono_cliente.trim()}, ${reserva.email_cliente?.trim() || null}, 1)
    ON CONFLICT (telefono_cliente) 
    DO UPDATE SET 
      total_visitas = clientes.total_visitas + 1,
      email_cliente = COALESCE(EXCLUDED.email_cliente, clientes.email_cliente),
      updated_at = CURRENT_TIMESTAMP
  `

    return { success: true, id: result[0].id_reserva }
  } catch (error) {
    console.error("Error al crear reserva:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

export async function getReservasPorFecha(fecha: string) {
  try {
    const result = await sql`
    SELECT 
      r.id_reserva,
      r.nombre_cliente,
      r.telefono_cliente,
      r.email_cliente,
      r.hora_inicio_turno,
      r.hora_fin_turno,
      r.estado_reserva,
      r.notas_cliente,
      r.precio_final,
      s.nombre_servicio,
      s.categoria_servicio,
      p.nombre_peluquero,
      p.avatar_iniciales
    FROM reservas r
    JOIN servicios s ON r.id_servicio = s.id_servicio
    JOIN peluqueros p ON r.id_peluquero = p.id_peluquero
    WHERE r.fecha_turno = ${fecha}
    ORDER BY r.hora_inicio_turno, p.nombre_peluquero
  `
    return result
  } catch (error) {
    console.error("Error al obtener reservas por fecha:", error)
    return []
  }
}

// ============================================
// FUNCIONES PARA CLIENTES
// ============================================

export async function getClientePorTelefono(telefono: string): Promise<Cliente | null> {
  try {
    const result = await sql`
    SELECT 
      id_cliente, 
      nombre_cliente, 
      telefono_cliente, 
      email_cliente, 
      total_visitas, 
      cliente_vip, 
      created_at, 
      updated_at,
      activo_cliente
    FROM clientes 
    WHERE telefono_cliente = ${telefono} 
    AND activo_cliente = true
  `
    return result.length > 0 ? (result[0] as Cliente) : null
  } catch (error) {
    console.error("Error al obtener cliente por teléfono:", error)
    return null
  }
}

export async function createCliente(
  cliente: Omit<Cliente, "id_cliente" | "total_visitas" | "created_at" | "updated_at">,
): Promise<Cliente> {
  try {
    const result = await sql`
    INSERT INTO clientes (nombre_cliente, telefono_cliente, email_cliente, cliente_vip, activo_cliente)
    VALUES (${cliente.nombre_cliente}, ${cliente.telefono_cliente}, ${cliente.email_cliente || null}, ${cliente.cliente_vip || false}, ${cliente.activo_cliente || true})
    RETURNING id_cliente, nombre_cliente, telefono_cliente, email_cliente, total_visitas, cliente_vip, created_at, updated_at, activo_cliente
  `
    return {
      ...result[0],
      created_at:
        result[0].created_at instanceof Date ? result[0].created_at.toISOString() : String(result[0].created_at),
      updated_at:
        result[0].updated_at instanceof Date ? result[0].updated_at.toISOString() : String(result[0].updated_at),
    } as Cliente
  } catch (error) {
    console.error("Error al crear cliente:", error)
    throw new Error("Error al crear cliente")
  }
}

export async function updateCliente(
  id: number,
  cliente: Partial<Omit<Cliente, "id_cliente" | "created_at" | "total_visitas">>,
): Promise<Cliente> {
  try {
    const result = await sql`
    UPDATE clientes
    SET 
      nombre_cliente = COALESCE(${cliente.nombre_cliente}, nombre_cliente),
      telefono_cliente = COALESCE(${cliente.telefono_cliente}, telefono_cliente),
      email_cliente = COALESCE(${cliente.email_cliente || null}, email_cliente),
      cliente_vip = COALESCE(${cliente.cliente_vip}, cliente_vip),
      activo_cliente = COALESCE(${cliente.activo_cliente}, activo_cliente),
      updated_at = CURRENT_TIMESTAMP
    WHERE id_cliente = ${id}
    RETURNING id_cliente, nombre_cliente, telefono_cliente, email_cliente, total_visitas, cliente_vip, created_at, updated_at, activo_cliente
  `
    if (result.length === 0) {
      throw new Error("Cliente no encontrado para actualizar")
    }
    return {
      ...result[0],
      created_at:
        result[0].created_at instanceof Date ? result[0].created_at.toISOString() : String(result[0].created_at),
      updated_at:
        result[0].updated_at instanceof Date ? result[0].updated_at.toISOString() : String(result[0].updated_at),
    } as Cliente
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    throw new Error("Error al actualizar cliente")
  }
}

export async function deleteCliente(id: number): Promise<void> {
  try {
    // Considerar una eliminación lógica (activo_cliente = false) en lugar de física
    await sql`
    UPDATE clientes
    SET activo_cliente = false, updated_at = CURRENT_TIMESTAMP
    WHERE id_cliente = ${id}
  `
    // Si se prefiere eliminación física:
    // await sql`DELETE FROM clientes WHERE id_cliente = ${id}`
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    throw new Error("Error al eliminar cliente")
  }
}

// ============================================
// FUNCIONES PARA EL PANEL DE ADMINISTRACIÓN
// ============================================

export async function getEstadisticasGenerales() {
  try {
    const stats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM reservas WHERE estado_reserva = 'confirmado' AND fecha_turno >= CURRENT_DATE) as reservas_confirmadas,
      (SELECT COUNT(*) FROM reservas WHERE estado_reserva = 'pendiente' AND fecha_turno >= CURRENT_DATE) as reservas_pendientes,
      (SELECT COUNT(*) FROM clientes WHERE activo_cliente = true) as total_clientes,
      (SELECT COUNT(*) FROM clientes WHERE cliente_vip = true) as clientes_vip,
      (SELECT COUNT(*) FROM peluqueros WHERE activo_peluquero = true) as peluqueros_activos,
      (SELECT COUNT(*) FROM servicios WHERE activo_servicio = true) as servicios_activos
  `
    return stats[0]
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return null
  }
}

export async function getRevenueByDateRange(startDate: string, endDate: string): Promise<number> {
  try {
    const result = await sql`
    SELECT COALESCE(SUM(precio_final), 0) AS total_revenue
    FROM reservas
    WHERE fecha_turno BETWEEN ${startDate} AND ${endDate}
    AND estado_reserva = 'confirmado';
  `
    return Number.parseFloat(result[0].total_revenue) || 0
  } catch (error) {
    console.error("Error al obtener facturación por rango de fechas:", error)
    throw new Error("Error al cargar la facturación")
  }
}

export async function getDailyRevenueByDateRange(startDate: string, endDate: string): Promise<DailyRevenue[]> {
  try {
    const result = await sql`
    SELECT 
      fecha_turno AS fecha,
      COALESCE(SUM(precio_final), 0) AS daily_revenue
    FROM reservas
    WHERE fecha_turno BETWEEN ${startDate} AND ${endDate}
    AND estado_reserva = 'confirmado'
    GROUP BY fecha_turno
    ORDER BY fecha_turno ASC;
  `
    return result.map((row) => ({
      fecha: row.fecha.toISOString().split("T")[0], // Format date to YYYY-MM-DD
      daily_revenue: Number.parseFloat(row.daily_revenue) || 0,
    })) as DailyRevenue[]
  } catch (error) {
    console.error("Error al obtener facturación diaria por rango de fechas:", error)
    throw new Error("Error al cargar la facturación diaria")
  }
}

export async function getRecentReservas(limit = 5): Promise<RecentReserva[]> {
  try {
    const result = await sql`
    SELECT 
      r.id_reserva,
      r.nombre_cliente,
      r.telefono_cliente,
      r.fecha_turno,
      r.hora_inicio_turno,
      s.nombre_servicio,
      p.nombre_peluquero,
      r.precio_final,
      r.estado_reserva
    FROM reservas r
    JOIN servicios s ON r.id_servicio = s.id_servicio
    JOIN peluqueros p ON r.id_peluquero = p.id_peluquero
    ORDER BY r.created_at DESC
    LIMIT ${limit};
  `
    return result.map((row) => ({
      ...row,
      fecha_turno: row.fecha_turno.toISOString().split("T")[0], // Format date
      precio_final: Number.parseFloat(row.precio_final) || 0,
    })) as RecentReserva[]
  } catch (error) {
    console.error("Error al obtener reservas recientes:", error)
    throw new Error("Error al cargar reservas recientes")
  }
}

export async function getAllClientes(): Promise<Cliente[]> {
  try {
    const result = await sql`
    SELECT 
      id_cliente,
      nombre_cliente,
      telefono_cliente,
      email_cliente,
      total_visitas,
      cliente_vip,
      created_at,
      updated_at,
      activo_cliente
    FROM clientes
    WHERE activo_cliente = true
    ORDER BY created_at DESC
  `
    return result.map((row) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })) as Cliente[]
  } catch (error) {
    console.error("Error al obtener todos los clientes:", error)
    throw new Error("Error al cargar clientes")
  }
}

export async function getAllPeluqueros(): Promise<Peluquero[]> {
  try {
    const result = await sql`
    SELECT
      id_peluquero,
      nombre_peluquero,
      especialidad_peluquero,
      anios_experiencia,
      activo_peluquero,
      avatar_iniciales,
      avatar_url,
      telefono_peluquero,
      email_peluquero,
      created_at,
      updated_at
    FROM peluqueros
    WHERE activo_peluquero = true
    ORDER BY nombre_peluquero
  `
    return result.map((row) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })) as Peluquero[]
  } catch (error) {
    console.error("Error al obtener todos los peluqueros:", error)
    throw new Error("Error al cargar peluqueros")
  }
}

export async function getAllServiciosAdmin(): Promise<Servicio[]> {
  try {
    const result = await sql`
    SELECT 
      id_servicio, 
      nombre_servicio, 
      descripcion_servicio, 
      categoria_servicio, 
      precio_servicio, 
      duracion_minutos,
      activo_servicio,
      orden_categoria,
      created_at,
      updated_at
    FROM servicios
    WHERE activo_servicio = true
    ORDER BY categoria_servicio, orden_categoria, nombre_servicio
  `
    return result.map((row) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })) as Servicio[]
  } catch (error) {
    console.error("Error al obtener todos los servicios para admin:", error)
    throw new Error("Error al cargar servicios")
  }
}

export async function getAllHorarios(): Promise<any[]> {
  // Considerar definir una interfaz específica para Horario
  try {
    const result = await sql`
    SELECT 
      ht.id_horario,
      p.nombre_peluquero,
      ht.dia_semana,
      ht.hora_inicio,
      ht.hora_fin,
      ht.activo_horario
    FROM horarios_trabajo ht
    JOIN peluqueros p ON ht.id_peluquero = p.id_peluquero
    ORDER BY p.nombre_peluquero, ht.dia_semana
  `
    return result
  } catch (error) {
    console.error("Error al obtener todos los horarios:", error)
    throw new Error("Error al cargar horarios")
  }
}

export async function getAllReservas(): Promise<Reserva[]> {
  try {
    const result = await sql`
    SELECT 
      r.id_reserva,
      r.nombre_cliente,
      r.telefono_cliente,
      r.email_cliente,
      r.fecha_turno,
      r.hora_inicio_turno,
      r.hora_fin_turno,
      r.estado_reserva,
      s.nombre_servicio,
      p.nombre_peluquero,
      r.precio_final,
      r.created_at
    FROM reservas r
    JOIN servicios s ON r.id_servicio = s.id_servicio
    JOIN peluqueros p ON r.id_peluquero = p.id_peluquero
    ORDER BY r.fecha_turno DESC, r.hora_inicio_turno DESC
  `
    return result as Reserva[]
  } catch (error) {
    console.error("Error al obtener todas las reservas:", error)
    throw new Error("Error al cargar reservas")
  }
}

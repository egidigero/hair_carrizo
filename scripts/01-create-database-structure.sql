-- ============================================
-- SISTEMA DE RESERVAS HAIR CARRIZO
-- Base de datos completa y estructurada
-- ============================================

-- Eliminar tablas existentes si existen (en orden correcto por dependencias)
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS peluquero_servicios CASCADE;
DROP TABLE IF EXISTS horarios_trabajo CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS peluqueros CASCADE;
DROP TABLE IF EXISTS categorias_servicios CASCADE;

-- ============================================
-- TABLA: categorias_servicios
-- Categorías principales de servicios
-- ============================================
CREATE TABLE categorias_servicios (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria TEXT NOT NULL UNIQUE,
    descripcion_categoria TEXT,
    orden_visualizacion INTEGER DEFAULT 0,
    activa_categoria BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: servicios (versión final solicitada)
-- ============================================
CREATE TABLE servicios (
    id_servicio SERIAL PRIMARY KEY,
    nombre_servicio TEXT NOT NULL,
    descripcion_servicio TEXT,
    categoria_servicio TEXT NOT NULL,
    precio_servicio NUMERIC(10,2) NOT NULL CHECK (precio_servicio > 0),
    duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
    activo_servicio BOOLEAN DEFAULT TRUE,
    orden_categoria INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_servicio) 
        REFERENCES categorias_servicios(nombre_categoria) ON UPDATE CASCADE
);

-- ============================================
-- TABLA: peluqueros (versión final solicitada)
-- ============================================
CREATE TABLE peluqueros (
    id_peluquero SERIAL PRIMARY KEY,
    nombre_peluquero TEXT NOT NULL,
    especialidad_peluquero TEXT NOT NULL,
    descripcion_peluquero TEXT,
    anios_experiencia INTEGER CHECK (anios_experiencia >= 0),
    activo_peluquero BOOLEAN DEFAULT TRUE,
    avatar_iniciales TEXT, -- Para mostrar en la UI (ej: "MC", "AC")
    avatar_url TEXT, -- Nueva columna para la URL de la imagen
    telefono_peluquero TEXT,
    email_peluquero TEXT,
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: peluquero_servicios
-- Relación muchos a muchos entre peluqueros y servicios
-- ============================================
CREATE TABLE peluquero_servicios (
    id_peluquero_servicio SERIAL PRIMARY KEY,
    id_peluquero INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    precio_personalizado NUMERIC(10,2), -- Precio especial para este peluquero (opcional)
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_peluquero) REFERENCES peluqueros(id_peluquero) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE,
    UNIQUE(id_peluquero, id_servicio)
);

-- ============================================
-- TABLA: horarios_trabajo
-- Horarios de trabajo de cada peluquero
-- ============================================
CREATE TABLE horarios_trabajo (
    id_horario SERIAL PRIMARY KEY,
    id_peluquero INTEGER NOT NULL,
    dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo_horario BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_peluquero) REFERENCES peluqueros(id_peluquero) ON DELETE CASCADE,
    UNIQUE(id_peluquero, dia_semana),
    CHECK (hora_fin > hora_inicio)
);

-- ============================================
-- TABLA: reservas (versión final solicitada)
-- ============================================
CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,
    nombre_cliente TEXT NOT NULL,
    telefono_cliente TEXT NOT NULL,
    email_cliente TEXT, -- Opcional como solicitado
    id_peluquero INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    fecha_turno DATE NOT NULL,
    hora_inicio_turno TIME NOT NULL,
    hora_fin_turno TIME NOT NULL,
    estado_reserva TEXT DEFAULT 'pendiente' CHECK (estado_reserva IN ('pendiente', 'confirmado', 'cancelado')),
    notas_cliente TEXT,
    precio_final NUMERIC(10,2), -- Precio al momento de la reserva
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_peluquero) REFERENCES peluqueros(id_peluquero),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio),
    CHECK (hora_fin_turno > hora_inicio_turno),
    CHECK (fecha_turno >= CURRENT_DATE)
);

-- ============================================
-- TABLA ADICIONAL: clientes
-- Para mantener historial de clientes
-- ============================================
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente TEXT NOT NULL,
    telefono_cliente TEXT NOT NULL UNIQUE,
    email_cliente TEXT UNIQUE,
    fecha_primera_visita DATE DEFAULT CURRENT_DATE,
    total_visitas INTEGER DEFAULT 0,
    cliente_vip BOOLEAN DEFAULT FALSE,
    notas_cliente TEXT,
    activo_cliente BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA ADICIONAL: historial_reservas
-- Para auditoría y seguimiento
-- ============================================
CREATE TABLE historial_reservas (
    id_historial SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL,
    estado_anterior TEXT,
    estado_nuevo TEXT,
    motivo_cambio TEXT,
    usuario_cambio TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices para reservas (consultas más frecuentes)
CREATE INDEX idx_reservas_fecha_peluquero ON reservas(fecha_turno, id_peluquero);
CREATE INDEX idx_reservas_estado ON reservas(estado_reserva);
CREATE INDEX idx_reservas_cliente_telefono ON reservas(telefono_cliente);
CREATE INDEX idx_reservas_fecha_estado ON reservas(fecha_turno, estado_reserva);

-- Índices para servicios
CREATE INDEX idx_servicios_categoria ON servicios(categoria_servicio);
CREATE INDEX idx_servicios_activo ON servicios(activo_servicio);

-- Índices para peluqueros
CREATE INDEX idx_peluqueros_activo ON peluqueros(activo_peluquero);
CREATE INDEX idx_peluqueros_especialidad ON peluqueros(especialidad_peluquero);

-- Índices para horarios
CREATE INDEX idx_horarios_peluquero_dia ON horarios_trabajo(id_peluquero, dia_semana);

-- Índices para relaciones
CREATE INDEX idx_peluquero_servicios_peluquero ON peluquero_servicios(id_peluquero);
CREATE INDEX idx_peluquero_servicios_servicio ON peluquero_servicios(id_servicio);

-- ============================================
-- TRIGGERS PARA AUDITORÍA Y AUTOMATIZACIÓN
-- ============================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas relevantes
CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON servicios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_peluqueros_updated_at BEFORE UPDATE ON peluqueros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para historial de cambios en reservas
CREATE OR REPLACE FUNCTION log_reserva_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado_reserva != NEW.estado_reserva THEN
        INSERT INTO historial_reservas (id_reserva, estado_anterior, estado_nuevo, motivo_cambio)
        VALUES (NEW.id_reserva, OLD.estado_reserva, NEW.estado_reserva, 'Cambio automático de estado');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_reserva_estado_changes AFTER UPDATE ON reservas
    FOR EACH ROW EXECUTE FUNCTION log_reserva_changes();

-- ============================================
-- FUNCIONES ÚTILES PARA LA APLICACIÓN
-- ============================================

-- Función para verificar disponibilidad de horario
CREATE OR REPLACE FUNCTION verificar_disponibilidad_horario(
    p_id_peluquero INTEGER,
    p_fecha DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_id_reserva_excluir INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflictos INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflictos
    FROM reservas
    WHERE id_peluquero = p_id_peluquero
    AND fecha_turno = p_fecha
    AND estado_reserva IN ('pendiente', 'confirmado')
    AND (p_id_reserva_excluir IS NULL OR id_reserva != p_id_reserva_excluir)
    AND (
        (hora_inicio_turno < p_hora_fin AND hora_fin_turno > p_hora_inicio)
    );
    
    RETURN conflictos = 0;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener próximas reservas de un peluquero
CREATE OR REPLACE FUNCTION obtener_proximas_reservas(p_id_peluquero INTEGER, p_dias INTEGER DEFAULT 7)
RETURNS TABLE (
    id_reserva INTEGER,
    nombre_cliente TEXT,
    telefono_cliente TEXT,
    nombre_servicio TEXT,
    fecha_turno DATE,
    hora_inicio_turno TIME,
    hora_fin_turno TIME,
    estado_reserva TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id_reserva,
        r.nombre_cliente,
        r.telefono_cliente,
        s.nombre_servicio,
        r.fecha_turno,
        r.hora_inicio_turno,
        r.hora_fin_turno,
        r.estado_reserva
    FROM reservas r
    JOIN servicios s ON r.id_servicio = s.id_servicio
    WHERE r.id_peluquero = p_id_peluquero
    AND r.fecha_turno BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '%s days' % p_dias
    AND r.estado_reserva IN ('pendiente', 'confirmado')
    ORDER BY r.fecha_turno, r.hora_inicio_turno;
END;
$$ LANGUAGE plpgsql;

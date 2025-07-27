-- Crear tablas para el sistema de reservas
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion_minutos INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS peluqueros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    experiencia VARCHAR(50),
    descripcion TEXT,
    avatar VARCHAR(10),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS peluquero_servicios (
    id SERIAL PRIMARY KEY,
    peluquero_id INTEGER REFERENCES peluqueros(id),
    servicio_id INTEGER REFERENCES servicios(id),
    UNIQUE(peluquero_id, servicio_id)
);

CREATE TABLE IF NOT EXISTS horarios_trabajo (
    id SERIAL PRIMARY KEY,
    peluquero_id INTEGER REFERENCES peluqueros(id),
    dia_semana INTEGER NOT NULL, -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    servicio_id INTEGER REFERENCES servicios(id),
    peluquero_id INTEGER REFERENCES peluqueros(id),
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada', -- confirmada, cancelada, completada
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_reservas_fecha_peluquero ON reservas(fecha_reserva, peluquero_id);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_horarios_peluquero_dia ON horarios_trabajo(peluquero_id, dia_semana);

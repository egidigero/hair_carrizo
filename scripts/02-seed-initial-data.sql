-- ============================================
-- DATOS INICIALES PARA HAIR CARRIZO
-- ============================================

-- TRUNCAR tablas para asegurar un estado limpio antes de insertar datos
-- Esto es crucial si las tablas ya existen y tienen datos o secuencias de ID desfasadas.
TRUNCATE TABLE reservas RESTART IDENTITY CASCADE;
TRUNCATE TABLE peluquero_servicios RESTART IDENTITY CASCADE;
TRUNCATE TABLE horarios_trabajo RESTART IDENTITY CASCADE;
TRUNCATE TABLE servicios RESTART IDENTITY CASCADE;
TRUNCATE TABLE peluqueros RESTART IDENTITY CASCADE;
TRUNCATE TABLE categorias_servicios RESTART IDENTITY CASCADE;
TRUNCATE TABLE clientes RESTART IDENTITY CASCADE;
TRUNCATE TABLE historial_reservas RESTART IDENTITY CASCADE;


-- Insertar categorías de servicios
INSERT INTO categorias_servicios (nombre_categoria, descripcion_categoria, orden_visualizacion) VALUES
('BARBERÍA', 'Servicios especializados para caballeros', 1),
('CEJAS Y PESTAÑAS', 'Tratamientos de belleza facial', 2),
('COLORACIÓN', 'Técnicas avanzadas de color', 3),
('CORTE', 'Cortes para toda la familia', 4),
('DECOLORACIÓN', 'Técnicas de aclarado premium', 5),
('FORMA', 'Tratamientos capilares', 6),
('LIFTING DE PESTAÑAS', 'Servicios de curvado y tinte de pestañas', 7), -- Nueva categoría
('PEINADOS', 'Estilos y peinados especiales', 8);

-- Insertar servicios completos
INSERT INTO servicios (nombre_servicio, descripcion_servicio, categoria_servicio, precio_servicio, duracion_minutos, orden_categoria) VALUES
-- BARBERÍA
('Barba', 'Perfilado, recorte y definición para un look prolijo y moderno', 'BARBERÍA', 30.00, 30, 1),

-- CEJAS Y PESTAÑAS
('Laminado de Cejas', 'Fijación semipermanente que ordena y realza la forma natural', 'CEJAS Y PESTAÑAS', 45.00, 45, 1),
('Laminado y Tinte de Cejas', 'Laminado + color para un acabado más definido y duradero', 'CEJAS Y PESTAÑAS', 55.00, 60, 2),
('Lifting de Pestañas', 'Curvado natural que abre la mirada sin necesidad de extensiones', 'CEJAS Y PESTAÑAS', 50.00, 45, 3),
('Lifting + Tinte + Laminado', 'Mirada impactante: combina curva, color y fijación', 'CEJAS Y PESTAÑAS', 70.00, 75, 4),
('Perfilado de Cejas', 'Diseño y depilación según la forma de tu rostro', 'CEJAS Y PESTAÑAS', 25.00, 30, 5),

-- COLORACIÓN
('Balayage con Martín Carrizo', 'Técnica personalizada por un especialista para lograr luces naturales', 'COLORACIÓN', 120.00, 180, 1),
('Balayage Hair Carrizo', 'Efecto de mechas difuminadas, con estilo profesional exclusivo', 'COLORACIÓN', 100.00, 150, 2),
('Baño de Luz', 'Reflejos de brillo y tono para revitalizar el color', 'COLORACIÓN', 60.00, 90, 3),
('Color Inoa (solo raíces)', 'Coloración sin amoníaco que respeta la fibra capilar', 'COLORACIÓN', 45.00, 60, 4),
('Color Majirel', 'Cobertura total con colores intensos y duraderos', 'COLORACIÓN', 55.00, 75, 5),
('Maquillaje de Mechas', 'Reflejos suaves y estratégicos para resaltar zonas puntuales', 'COLORACIÓN', 70.00, 90, 6),
('Mechas con Gorra', 'Técnica clásica para iluminar el cabello desde la raíz', 'COLORACIÓN', 65.00, 90, 7),

-- CORTE
('Corte de Caballero', 'Estilo moderno o clásico, según tu personalidad', 'CORTE', 35.00, 45, 1),
('Corte de Damas', 'Adaptado a tus rasgos y estilo, para realzar tu belleza', 'CORTE', 40.00, 50, 2),
('Corte de Niñas', 'Cortes delicados pensados para las más pequeñas', 'CORTE', 25.00, 30, 3),
('Corte de Niños', 'Rápido y cómodo para los más chicos, con estilo', 'CORTE', 20.00, 25, 4),

-- DECOLORACIÓN
('Limpieza de Color', 'Remueve restos de color previo para aplicar uno nuevo', 'DECOLORACIÓN', 80.00, 120, 1),
('Mechas Platinium', 'Iluminación extrema con tonos fríos y brillantes', 'DECOLORACIÓN', 90.00, 150, 2),
('Mechas Platinium con Martín Carrizo', 'Técnica avanzada para resultados premium', 'DECOLORACIÓN', 130.00, 180, 3),

-- FORMA
('Keratina', 'Suaviza, hidrata y elimina el frizz por semanas', 'FORMA', 85.00, 120, 1),
('Nano Keratina', 'Tratamiento más intensivo que reestructura profundamente el cabello', 'FORMA', 110.00, 150, 2),

-- LIFTING DE PESTAÑAS (Servicio movido a su propia categoría)
('Lifting de Pestañas con Tinte', 'Curvado + color para un efecto “pestañas de muñeca” sin maquillaje', 'LIFTING DE PESTAÑAS', 60.00, 60, 1),

-- PEINADOS
('Brushing', 'Secado con volumen, brillo y forma', 'PEINADOS', 25.00, 30, 1),
('Modelado', 'Peinado con ondas, planchita o bucles según tu estilo', 'PEINADOS', 35.00, 45, 2),
('Peinados Especiales', 'Recogidos, semis o estilizados para eventos y ocasiones especiales', 'PEINADOS', 50.00, 60, 3);

-- Insertar peluqueros del equipo
INSERT INTO peluqueros (nombre_peluquero, especialidad_peluquero, descripcion_peluquero, anios_experiencia, avatar_iniciales, avatar_url, telefono_peluquero, email_peluquero) VALUES
('Martín Carrizo', 'Director Creativo & Colorista Master', 'Especialista en técnicas avanzadas de coloración y balayage. Referente en el salón con más de 15 años perfeccionando su arte.', 15, 'MC', '/placeholder.svg?height=128&width=128', '+54 11 1234-5001', 'martin@haircarrizo.com'),
('Alejandro Carrizo', 'Estilista Senior', 'Experto en cortes de vanguardia y transformaciones capilares. Combina técnicas clásicas con tendencias modernas.', 12, 'AC', '/placeholder.svg?height=128&width=128', '+54 11 1234-5002', 'alejandro@haircarrizo.com'),
('Sofia Martinez', 'Especialista en Cejas y Pestañas', 'Maestra en laminados, lifting y diseño de cejas. Especializada en realzar la belleza natural de la mirada.', 8, 'SM', '/placeholder.svg?height=128&width=128', '+54 11 1234-5003', 'sofia@haircarrizo.com'),
('Valentina Cruz', 'Estilista & Colorista', 'Especializada en peinados y técnicas de coloración. Experta en crear looks únicos para cada ocasión.', 10, 'VC', '/placeholder.svg?height=128&width=128', '+54 11 1234-5004', 'valentina@haircarrizo.com');

-- Asignar servicios a peluqueros según sus especialidades (usando los IDs de servicio correctos)
-- NOTA: Los IDs de servicio se asignan automáticamente por SERIAL.
-- Se asume que el orden de inserción de servicios es el mismo que el orden de IDs (1, 2, 3...)
-- Si se modifica el orden de inserción de servicios, estos IDs deben ser verificados.

-- Para mayor claridad, aquí se usan los IDs que deberían corresponder al orden de inserción:
-- BARBA: 1
-- LAMINADO DE CEJAS: 2
-- LAMINADO Y TINTE DE CEJAS: 3
-- LIFTING DE PESTAÑAS (CEJAS Y PESTAÑAS): 4
-- LIFTING + TINTE + LAMINADO: 5
-- PERFILADO DE CEJAS: 6
-- BALAYAGE CON MARTÍN CARRIZO: 7
-- BALAYAGE HAIR CARRIZO: 8
-- BAÑO DE LUZ: 9
-- COLOR INOA (SOLO RAÍCES): 10
-- COLOR MAJIREL: 11
-- MAQUILLAJE DE MECHAS: 12
-- MECHAS CON GORRA: 13
-- CORTE DE CABALLERO: 14
-- CORTE DE DAMAS: 15
-- CORTE DE NIÑAS: 16
-- CORTE DE NIÑOS: 17
-- LIMPIEZA DE COLOR: 18
-- MECHAS PLATINIUM: 19
-- MECHAS PLATINIUM CON MARTÍN CARRIZO: 20
-- KERATINA: 21
-- NANO KERATINA: 22
-- LIFTING DE PESTAÑAS CON TINTE (LIFTING DE PESTAÑAS): 23
-- BRUSHING: 24
-- MODELADO: 25
-- PEINADOS ESPECIALES: 26

INSERT INTO peluquero_servicios (id_peluquero, id_servicio) VALUES
-- Martín Carrizo (ID 1) - Especialista en coloración premium y cortes
(1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), -- Coloración
(1, 18), (1, 19), (1, 20), -- Decoloración
(1, 14), (1, 15), -- Cortes premium (Caballero, Damas)

-- Alejandro Carrizo (ID 2) - Estilista senior, cortes y barbería
(2, 14), (2, 15), (2, 16), (2, 17), -- Cortes (Caballero, Damas, Niñas, Niños)
(2, 1), -- Barbería (Barba)
(2, 24), (2, 25), (2, 26), -- Peinados (Brushing, Modelado, Peinados Especiales)

-- Sofia Martinez (ID 3) - Especialista en cejas, pestañas y cortes femeninos
(3, 2), (3, 3), (3, 4), (3, 5), (3, 6), -- Cejas y pestañas (Laminado, Tinte, Lifting, Perfilado)
(3, 23), -- Lifting de Pestañas con Tinte (nueva categoría)
(3, 15), (3, 16), -- Cortes de damas y niñas

-- Valentina Cruz (ID 4) - Colorista y estilista general
(4, 9), (4, 10), (4, 11), (4, 12), -- Coloración básica (Baño de Luz, Inoa, Majirel, Maquillaje de Mechas)
(4, 15), (4, 16), -- Cortes (Damas, Niñas)
(4, 21), (4, 22), -- Tratamientos (Keratina, Nano Keratina)
(4, 24), (4, 25), (4, 26); -- Peinados (Brushing, Modelado, Peinados Especiales)

-- Horarios de trabajo (Lunes a Sábado, 9:00 a 19:00)
INSERT INTO horarios_trabajo (id_peluquero, dia_semana, hora_inicio, hora_fin) VALUES
-- Martín Carrizo (Lunes a Sábado)
(1, 1, '09:00', '19:00'), (1, 2, '09:00', '19:00'), (1, 3, '09:00', '19:00'),
(1, 4, '09:00', '19:00'), (1, 5, '09:00', '19:00'), (1, 6, '09:00', '19:00'),

-- Alejandro Carrizo (Lunes a Sábado)
(2, 1, '09:00', '19:00'), (2, 2, '09:00', '19:00'), (2, 3, '09:00', '19:00'),
(2, 4, '09:00', '19:00'), (2, 5, '09:00', '19:00'), (2, 6, '09:00', '19:00'),

-- Sofia Martinez (Martes a Sábado - especialista en tratamientos)
(3, 2, '10:00', '18:00'), (3, 3, '10:00', '18:00'), (3, 4, '10:00', '18:00'),
(3, 5, '10:00', '18:00'), (3, 6, '09:00', '19:00'),

-- Valentina Cruz (Lunes a Sábado)
(4, 1, '09:00', '19:00'), (4, 2, '09:00', '19:00'), (4, 3, '09:00', '19:00'),
(4, 4, '09:00', '19:00'), (4, 5, '09:00', '19:00'), (4, 6, '09:00', '19:00');

-- Insertar algunos clientes de ejemplo
INSERT INTO clientes (nombre_cliente, telefono_cliente, email_cliente, total_visitas, cliente_vip) VALUES
('María González', '+54 11 9876-5432', 'maria.gonzalez@email.com', 5, FALSE),
('Carlos Rodriguez', '+54 11 8765-4321', 'carlos.rodriguez@email.com', 12, TRUE),
('Ana López', '+54 11 7654-3210', 'ana.lopez@email.com', 3, FALSE),
('Diego Fernández', '+54 11 6543-2109', 'diego.fernandez@email.com', 8, FALSE);

-- Insertar algunas reservas de ejemplo
INSERT INTO reservas (nombre_cliente, telefono_cliente, email_cliente, id_peluquero, id_servicio, fecha_turno, hora_inicio_turno, hora_fin_turno, estado_reserva, precio_final) VALUES
('María González', '+54 11 9876-5432', 'maria.gonzalez@email.com', 1, 7, CURRENT_DATE + INTERVAL '1 day', '10:00', '13:00', 'confirmado', 120.00),
('Carlos Rodriguez', '+54 11 8765-4321', 'carlos.rodriguez@email.com', 2, 14, CURRENT_DATE + INTERVAL '2 days', '14:00', '14:45', 'confirmado', 35.00),
('Ana López', '+54 11 7654-3210', 'ana.lopez@email.com', 3, 3, CURRENT_DATE + INTERVAL '3 days', '11:00', '12:00', 'pendiente', 55.00);

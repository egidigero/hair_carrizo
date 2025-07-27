-- Insertar servicios
INSERT INTO servicios (nombre, descripcion, precio, duracion_minutos) VALUES
('CORTE CLÁSICO', 'Corte personalizado con técnicas tradicionales', 35.00, 45),
('CORTE + BARBA', 'Servicio completo de corte y arreglo de barba', 50.00, 60),
('COLORACIÓN', 'Tinte profesional con productos premium', 80.00, 120),
('PEINADO FORMAL', 'Peinado para eventos y ocasiones especiales', 25.00, 30),
('TRATAMIENTO CAPILAR', 'Tratamiento nutritivo y reparador intensivo', 60.00, 90),
('AFEITADO TRADICIONAL', 'Afeitado clásico con navaja y toallas calientes', 30.00, 40);

-- Insertar peluqueros
INSERT INTO peluqueros (nombre, especialidad, experiencia, descripcion, avatar) VALUES
('ALEJANDRO CARRIZO', 'DIRECTOR CREATIVO', '15 años', 'Especialista en cortes vanguardistas', 'AC'),
('SOFIA MARTINEZ', 'COLORISTA SENIOR', '10 años', 'Experta en técnicas de coloración avanzada', 'SM'),
('DIEGO ROMERO', 'BARBERO CLÁSICO', '12 años', 'Maestro en barbería tradicional', 'DR'),
('VALENTINA CRUZ', 'ESTILISTA PREMIUM', '8 años', 'Especializada en peinados y tratamientos', 'VC');

-- Asignar servicios a peluqueros
INSERT INTO peluquero_servicios (peluquero_id, servicio_id) VALUES
-- Alejandro Carrizo (todos menos afeitado)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
-- Sofia Martinez (corte, coloración, peinado, tratamiento)
(2, 1), (2, 3), (2, 4), (2, 5),
-- Diego Romero (corte, corte+barba, afeitado)
(3, 1), (3, 2), (3, 6),
-- Valentina Cruz (corte, corte+barba, peinado, tratamiento)
(4, 1), (4, 2), (4, 4), (4, 5);

-- Horarios de trabajo (Lunes a Sábado, 9:00 a 19:00)
INSERT INTO horarios_trabajo (peluquero_id, dia_semana, hora_inicio, hora_fin) VALUES
-- Alejandro Carrizo
(1, 1, '09:00', '19:00'), (1, 2, '09:00', '19:00'), (1, 3, '09:00', '19:00'),
(1, 4, '09:00', '19:00'), (1, 5, '09:00', '19:00'), (1, 6, '09:00', '19:00'),
-- Sofia Martinez
(2, 1, '09:00', '19:00'), (2, 2, '09:00', '19:00'), (2, 3, '09:00', '19:00'),
(2, 4, '09:00', '19:00'), (2, 5, '09:00', '19:00'), (2, 6, '09:00', '19:00'),
-- Diego Romero
(3, 1, '09:00', '19:00'), (3, 2, '09:00', '19:00'), (3, 3, '09:00', '19:00'),
(3, 4, '09:00', '19:00'), (3, 5, '09:00', '19:00'), (3, 6, '09:00', '19:00'),
-- Valentina Cruz
(4, 1, '09:00', '19:00'), (4, 2, '09:00', '19:00'), (4, 3, '09:00', '19:00'),
(4, 4, '09:00', '19:00'), (4, 5, '09:00', '19:00'), (4, 6, '09:00', '19:00');

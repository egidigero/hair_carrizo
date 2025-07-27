-- Actualizar la tabla reservas para separar nombre y apellido
ALTER TABLE reservas 
DROP COLUMN IF EXISTS cliente_nombre;

ALTER TABLE reservas 
ADD COLUMN cliente_nombre VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN cliente_apellido VARCHAR(50) NOT NULL DEFAULT '';

-- Hacer teléfono obligatorio
ALTER TABLE reservas 
ALTER COLUMN cliente_telefono SET NOT NULL;

-- Actualizar registros existentes si los hay
UPDATE reservas 
SET cliente_nombre = 'Cliente', cliente_apellido = 'Ejemplo'
WHERE cliente_nombre = '' OR cliente_apellido = '';

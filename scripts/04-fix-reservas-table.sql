-- Script para corregir la tabla reservas de forma segura
-- Primero verificamos si las columnas existen y las creamos si no están

-- Agregar columna cliente_apellido si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reservas' AND column_name = 'cliente_apellido') THEN
        ALTER TABLE reservas ADD COLUMN cliente_apellido VARCHAR(50);
    END IF;
END $$;

-- Actualizar cliente_telefono para que sea NOT NULL con valor por defecto
DO $$ 
BEGIN
    -- Primero actualizar registros existentes que tengan telefono NULL
    UPDATE reservas SET cliente_telefono = '' WHERE cliente_telefono IS NULL;
    
    -- Luego hacer la columna NOT NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'reservas' AND column_name = 'cliente_telefono' AND is_nullable = 'YES') THEN
        ALTER TABLE reservas ALTER COLUMN cliente_telefono SET NOT NULL;
    END IF;
END $$;

-- Si cliente_nombre contiene nombre completo, separarlo
DO $$
DECLARE
    rec RECORD;
    nombre_parts TEXT[];
BEGIN
    FOR rec IN SELECT id, cliente_nombre FROM reservas WHERE cliente_apellido IS NULL OR cliente_apellido = ''
    LOOP
        nombre_parts := string_to_array(trim(rec.cliente_nombre), ' ');
        
        IF array_length(nombre_parts, 1) >= 2 THEN
            UPDATE reservas 
            SET cliente_nombre = nombre_parts[1],
                cliente_apellido = array_to_string(nombre_parts[2:], ' ')
            WHERE id = rec.id;
        ELSE
            UPDATE reservas 
            SET cliente_apellido = 'Apellido'
            WHERE id = rec.id;
        END IF;
    END LOOP;
END $$;

-- Hacer cliente_apellido NOT NULL después de llenar los datos
ALTER TABLE reservas ALTER COLUMN cliente_apellido SET NOT NULL;

-- Agregar constraint para asegurar que no estén vacíos
ALTER TABLE reservas ADD CONSTRAINT check_cliente_nombre_not_empty 
    CHECK (length(trim(cliente_nombre)) > 0);
    
ALTER TABLE reservas ADD CONSTRAINT check_cliente_apellido_not_empty 
    CHECK (length(trim(cliente_apellido)) > 0);

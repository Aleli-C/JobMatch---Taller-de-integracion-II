
INSERT INTO usuarios (rut, nombre, correo, contrasena, region, ciudad, direccion, tipo_usuario) VALUES
('101589218', 'Camila Fernández', 'cfernandez@gmail.com', 'JobMatch123', 'Metropolitana de Santiago', 'Santiago', 'Av. Providencia 1234', 'USUARIO'),
('76852774', 'Juan Pérez', 'jperez@gmail.com', 'JobMatch123', 'La Araucanía', 'Temuco', 'Calle Prat 45', 'USUARIO'),
('194902824', 'María González', 'mgonzalez@gmail.com', 'JobMatch123', 'Valparaíso', 'Viña del Mar', 'Calle Valparaíso 987', 'USUARIO'),
('73619041', 'Andrés Silva', 'asilva@gmail.com', 'JobMatch123', 'Biobío', 'Concepción', 'Pje. Los Alerces 12', 'USUARIO'),
('89727332', 'Sofía Romero', 'sromero@gmail.com', 'JobMatch123', 'Región de Los Lagos', 'Puerto Montt', 'Av. Angelmó 210', 'USUARIO'),
('97218986', 'Felipe Morales', 'fmorales@gmail.com', 'JobMatch123', 'Antofagasta', 'Antofagasta', 'Calle Prat 77', 'USUARIO'),
('184709422', 'Valentina Rojas', 'vrojas@gmail.com', 'JobMatch123', 'Coquimbo', 'La Serena', 'Av. del Mar 55', 'USUARIO'),
('135905879', 'Diego Castillo', 'dcastillo@gmail.com', 'JobMatch123', 'Magallanes', 'Punta Arenas', 'Calle Bories 101', 'USUARIO'),
('138906353', 'Isidora Muñoz', 'imunoz@gmail.com', 'JobMatch123', 'O''Higgins', 'Rancagua', 'Ruta 5 Sur Km 215', 'USUARIO'),
('152591853', 'Matías Herrera', 'mherrera@gmail.com', 'JobMatch123', 'Maule', 'Talca', 'Calle 1 Poniente 300', 'USUARIO');

-- FUNCIONAMIENTO GENERAL DE VALIDACIONES
-- todos los campos del formulario cumplen correctamente con las validaciones esperadas.
-- todos estos usuarios fueron ingresados manualmente tanto el formulario de registro como el de login.
-- se verifico el correcto funcionamiento de los siguientes campos y reglas:

-- Campo: rut
--  - Valida formato y dígito verificador chileno mediante regex y algoritmo personalizado.
--  - Resultado: ✅ Correcto.

-- Campo: nombre completo
--  - Mínimo 2 caracteres, máximo 100.
--  - Resultado: ✅ Correcto.

-- Campo: correo
--  - Validación de formato con Zod (.email()).
--  - Rechaza correos mal formateados.
--  - Resultado: ✅ Correcto.

-- Campo: contrasena
--  - Longitud mínima de 8 caracteres.
--  - Requiere al menos una mayúscula, una minúscula y un número.
--  - Resultado: ✅ Correcto.

-- Campo: confirmcontrasena
--  - Debe coincidir exactamente con la contraseña.
--  - Resultado: ✅ Correcto.

-- Campo: region
--  - No permite valores vacíos (min(1)).
--  - Resultado: ✅ Correcto.

-- Campo: ciudad
--  - Mínimo 2 caracteres, máximo 60.
--  - Resultado: ✅ Correcto.

-- Campo: direccion
--  - Mínimo 5 caracteres, máximo 255.
--  - Resultado: ✅ Correcto.

-- Campo: tipo_usuario
--  - Se asigna por el backend con valor "USUARIO".
--  - No acepta valores externos del formulario.
--  - Resultado: ✅ Correcto.

--en cuanto a la validacion del formulario de login, todos estos usuarios ingresados inician sesion correctamente.
Guía Rápida: Migraciones con Prisma

Para crear migraciones:
`npx prisma migrate dev --name init`

Para hacer cambios en la BD:

1.Modifica el schema.prisma
- Edita el archivo `prisma/schema.prisma`
- Agrega/modifica modelos, campos, índices, etc.

2.Crear migración:

npx prisma migrate dev --name nombre-del-cambio
Ejemplo:`npx prisma migrate dev --name agregar-campo-telefono`

Comandos de emergencia:

Si algo sale mal (solo en desarrollo):

Reset completo (BORRA TODOS LOS DATOS):
npx prisma migrate reset

Ver estado de migraciones:
npx prisma migrate status

Solo generar cliente (sin cambios en BD):
npx prisma generate

Archivos importantes

- `prisma/schema.prisma` → Definición de la BD
- `prisma/migrations/` → Historial de cambios (commitear todo)

Reglas importantes

- SIEMPRE hacer pull antes de migrar
- NUNCA editar archivos de migración manualmente
- COMMIT las migraciones junto con el schema
- NO usar `migrate reset` con datos importantes
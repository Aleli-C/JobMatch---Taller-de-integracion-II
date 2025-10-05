/*
  Warnings:

  - The values [EMPLEADOR,EMPLEADO] on the enum `usuarios_tipo_usuario` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `tipo_usuario` ENUM('USUARIO', 'ADMIN') NOT NULL;

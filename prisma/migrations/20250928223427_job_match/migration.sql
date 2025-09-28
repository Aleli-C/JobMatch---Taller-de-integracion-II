/*
  Warnings:

  - Made the column `region` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ciudad` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direccion` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `region` VARCHAR(50) NOT NULL,
    MODIFY `ciudad` VARCHAR(60) NOT NULL,
    MODIFY `direccion` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rut` VARCHAR(12) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `tipo_usuario` ENUM('USUARIO', 'ADMIN') NOT NULL,
    `region` VARCHAR(50) NOT NULL,
    `ciudad` VARCHAR(60) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `ubicacion_id` INTEGER NULL,

    UNIQUE INDEX `usuarios_rut_key`(`rut`),
    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    INDEX `usuarios_correo_idx`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `foto` VARCHAR(255) NULL,
    `habilidades` TEXT NULL,
    `experiencia` TEXT NULL,
    `nivel_insignias` ENUM('EXPERTO', 'AVANZADO', 'PRINCIPIANTE') NOT NULL DEFAULT 'PRINCIPIANTE',
    `verificacion` BOOLEAN NOT NULL,
    `disponibilidad_hr` VARCHAR(100) NULL,
    `usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `perfiles_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ubicaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ciudad` VARCHAR(100) NOT NULL,
    `comuna` VARCHAR(100) NOT NULL,
    `region` VARCHAR(100) NOT NULL,
    `latitud` DECIMAL(10, 8) NOT NULL,
    `longitud` DECIMAL(11, 8) NOT NULL,

    INDEX `ubicaciones_ciudad_idx`(`ciudad`),
    INDEX `ubicaciones_region_idx`(`region`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `icono` VARCHAR(255) NULL,

    INDEX `categorias_nombre_idx`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `remuneracion` DECIMAL(10, 2) NOT NULL,
    `tipo` ENUM('FULLTIME', 'PARTTIME', 'FREELANCE') NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'CERRADO') NOT NULL,
    `fecha_publicacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_cierre` DATETIME(3) NULL,
    `icono` VARCHAR(255) NULL,
    `usuario_id` INTEGER NOT NULL,
    `ubicacion_id` INTEGER NOT NULL,
    `categoria_id` INTEGER NOT NULL,

    INDEX `publicaciones_estado_idx`(`estado`),
    INDEX `publicaciones_fecha_publicacion_idx`(`fecha_publicacion`),
    INDEX `publicaciones_categoria_id_idx`(`categoria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario1_id` INTEGER NOT NULL,
    `usuario2_id` INTEGER NOT NULL,

    INDEX `chats_usuario1_id_idx`(`usuario1_id`),
    INDEX `chats_usuario2_id_idx`(`usuario2_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensajes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenido` TEXT NOT NULL,
    `enviado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chat_id` INTEGER NOT NULL,
    `remitente_id` INTEGER NOT NULL,
    `destinatario_id` INTEGER NOT NULL,

    INDEX `mensajes_chat_id_idx`(`chat_id`),
    INDEX `mensajes_remitente_id_idx`(`remitente_id`),
    INDEX `mensajes_destinatario_id_idx`(`destinatario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bloqueos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `motivo` TEXT NULL,
    `bloqueador_id` INTEGER NOT NULL,
    `bloqueado_id` INTEGER NOT NULL,

    INDEX `bloqueos_bloqueador_id_idx`(`bloqueador_id`),
    INDEX `bloqueos_bloqueado_id_idx`(`bloqueado_id`),
    UNIQUE INDEX `bloqueos_bloqueador_id_bloqueado_id_key`(`bloqueador_id`, `bloqueado_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reportes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motivo` TEXT NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('PENDIENTE', 'REVISADO', 'RESUELTO') NOT NULL DEFAULT 'PENDIENTE',
    `reportante_id` INTEGER NOT NULL,
    `reportado_id` INTEGER NOT NULL,
    `publicacion_id` INTEGER NULL,

    INDEX `reportes_reportante_id_idx`(`reportante_id`),
    INDEX `reportes_reportado_id_idx`(`reportado_id`),
    INDEX `reportes_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postulaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('ENVIADA', 'ACEPTADA', 'RECHAZADA', 'CANCELADA') NOT NULL DEFAULT 'ENVIADA',
    `usuario_id` INTEGER NOT NULL,
    `publicacion_id` INTEGER NOT NULL,

    INDEX `postulaciones_estado_idx`(`estado`),
    UNIQUE INDEX `postulaciones_usuario_id_publicacion_id_key`(`usuario_id`, `publicacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guardados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` INTEGER NOT NULL,
    `publicacion_id` INTEGER NOT NULL,

    UNIQUE INDEX `guardados_usuario_id_publicacion_id_key`(`usuario_id`, `publicacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_trabajos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NULL,
    `descripcion` TEXT NULL,
    `empleador_id` INTEGER NOT NULL,
    `empleado_id` INTEGER NOT NULL,
    `publicacion_id` INTEGER NULL,

    INDEX `historial_trabajos_empleador_id_idx`(`empleador_id`),
    INDEX `historial_trabajos_empleado_id_idx`(`empleado_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calificaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `puntuacion` TINYINT NOT NULL,
    `comentario` TEXT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `historial_id` INTEGER NOT NULL,
    `autor_id` INTEGER NOT NULL,

    INDEX `calificaciones_historial_id_idx`(`historial_id`),
    INDEX `calificaciones_autor_id_idx`(`autor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(200) NOT NULL,
    `consulta` TEXT NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` INTEGER NOT NULL,

    INDEX `foros_usuario_id_idx`(`usuario_id`),
    INDEX `foros_fecha_idx`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `respuestas_foro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `respuesta` TEXT NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `foro_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    INDEX `respuestas_foro_foro_id_idx`(`foro_id`),
    INDEX `respuestas_foro_usuario_id_idx`(`usuario_id`),
    INDEX `respuestas_foro_fecha_idx`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ubicacion_id_fkey` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfiles` ADD CONSTRAINT `perfiles_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_ubicacion_id_fkey` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_usuario1_id_fkey` FOREIGN KEY (`usuario1_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_usuario2_id_fkey` FOREIGN KEY (`usuario2_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_remitente_id_fkey` FOREIGN KEY (`remitente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_destinatario_id_fkey` FOREIGN KEY (`destinatario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bloqueos` ADD CONSTRAINT `bloqueos_bloqueador_id_fkey` FOREIGN KEY (`bloqueador_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bloqueos` ADD CONSTRAINT `bloqueos_bloqueado_id_fkey` FOREIGN KEY (`bloqueado_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_reportante_id_fkey` FOREIGN KEY (`reportante_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_reportado_id_fkey` FOREIGN KEY (`reportado_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `postulaciones_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `postulaciones_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guardados` ADD CONSTRAINT `guardados_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guardados` ADD CONSTRAINT `guardados_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_trabajos` ADD CONSTRAINT `historial_trabajos_empleador_id_fkey` FOREIGN KEY (`empleador_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_trabajos` ADD CONSTRAINT `historial_trabajos_empleado_id_fkey` FOREIGN KEY (`empleado_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_trabajos` ADD CONSTRAINT `historial_trabajos_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calificaciones` ADD CONSTRAINT `calificaciones_historial_id_fkey` FOREIGN KEY (`historial_id`) REFERENCES `historial_trabajos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calificaciones` ADD CONSTRAINT `calificaciones_autor_id_fkey` FOREIGN KEY (`autor_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foros` ADD CONSTRAINT `foros_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respuestas_foro` ADD CONSTRAINT `respuestas_foro_foro_id_fkey` FOREIGN KEY (`foro_id`) REFERENCES `foros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respuestas_foro` ADD CONSTRAINT `respuestas_foro_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

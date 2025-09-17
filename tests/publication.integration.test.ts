import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient, TipoEnum } from '@prisma/client'; 
import { PublicationService } from '../lib/servicies/publication-service';
import { PrismaPublicationRepository } from '../lib/repositories/prisma-publication-repository';
import { CreatePublicationResponse, DeletePublicationResponse, ListPublicationsResult } from '../lib/types/publication';
import { PublicationType } from '../lib/types/publication';
// --- SETUP ---
const prisma = new PrismaClient();
const publicationRepository = new PrismaPublicationRepository(prisma);
const publicationService = new PublicationService(publicationRepository);

// --- LIMPIEZA DE LA BASE DE DATOS ---
beforeEach(async () => {
  await prisma.publicacion.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.ubicacion.deleteMany();
  await prisma.categoria.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// --- SUITE DE PRUEBAS ---
describe('Publication Integration Tests', () => {

  it('should create a publication successfully', async () => {
    // Arrange
    const user = await prisma.usuario.create({ 
      data: { rut: '1111111-1', nombre: 'Test User', correo: 'test@example.com', contrasena: 'hashed', tipo_usuario: 'EMPLEADOR' } 
    });
    const category = await prisma.categoria.create({ data: { nombre: 'Tecnología' } });
    const location = await prisma.ubicacion.create({ 
      data: { ciudad: 'Santiago', comuna: 'Providencia', region: 'Metropolitana', latitud: -33.43, longitud: -70.61 } 
    });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const publicationData = {
      titulo: 'Desarrollador de Software Senior',
      descripcion: 'Se necesita desarrollador con más de 5 años de experiencia comprobable.',
      remuneracion: 2500000.0,
      tipo: PublicationType.FULLTIME,
      fechaCierre: tomorrow,
      idUsuario: user.idUsuario,
      idUbicacion: location.idUbicacion,
      idCategoria: category.idCategoria,
    };

    // Act
    const response = await publicationService.createPublication(publicationData) as CreatePublicationResponse;

    // Assert
    expect(response.success).toBe(true);

    // 🔧 Sin castear a `Publicacion`, validamos directamente
    const createdPublication = response.data!;
    expect(createdPublication.titulo).toBe(publicationData.titulo);
    expect(createdPublication.idUsuario).toBe(user.idUsuario);

    // Verificación final en la BD
    const dbPublication = await prisma.publicacion.findUnique({ 
      where: { idPublicacion: createdPublication.idPublicacion } 
    });
    expect(dbPublication).not.toBeNull();
  });

  it('should list all publications', async () => {
    // Arrange
    const user = await prisma.usuario.create({ 
      data: { rut: '2222222-2', nombre: 'Lister', correo: 'lister@example.com', contrasena: 'pw', tipo_usuario: 'EMPLEADO' } 
    });
    const category = await prisma.categoria.create({ data: { nombre: 'Diseño' } });
    const location = await prisma.ubicacion.create({ 
      data: { ciudad: 'Valparaíso', comuna: 'Viña', region: 'Valparaíso', latitud: 0, longitud: 0 } 
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.publicacion.createMany({
      data: [
        { titulo: 'Diseñador UX/UI', descripcion: 'Descripción larga para pasar validación de Zod.', remuneracion: 1200000, tipo: 'FULLTIME', estado: 'ACTIVO', idUsuario: user.idUsuario, idUbicacion: location.idUbicacion, idCategoria: category.idCategoria, fecha_cierre: tomorrow },
        { titulo: 'Ilustrador Digital', descripcion: 'Otra descripción suficientemente larga para Zod.', remuneracion: 900000, tipo: 'PARTTIME', estado: 'ACTIVO', idUsuario: user.idUsuario, idUbicacion: location.idUbicacion, idCategoria: category.idCategoria, fecha_cierre: tomorrow },
      ],
    });

    // Act
    const response = await publicationService.listPublications({}) as ListPublicationsResult;

    // Assert
    expect(response.success).toBe(true);
    expect(response.publications).toBeDefined();
    expect(response.pagination).toBeDefined();
    expect(response.publications?.length).toBe(2);
    expect(response.publications?.[0].titulo).toBe('Ilustrador Digital');
  });

  it('should delete a publication successfully when the user is the owner', async () => {
    // Arrange
    const user = await prisma.usuario.create({ 
      data: { rut: '3333333-3', nombre: 'Owner', correo: 'owner@example.com', contrasena: 'pw', tipo_usuario: 'EMPLEADOR' } 
    });
    const category = await prisma.categoria.create({ data: { nombre: 'Ventas' } });
    const location = await prisma.ubicacion.create({ 
      data: { ciudad: 'Concepción', comuna: 'Talcahuano', region: 'Biobío', latitud: 0, longitud: 0 } 
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const publication = await prisma.publicacion.create({
      data: {
        titulo: 'Vendedor en Terreno Senior',
        descripcion: 'Descripción suficientemente larga para Zod.',
        remuneracion: 800000,
        tipo: 'FULLTIME',
        estado: 'ACTIVO',
        idUsuario: user.idUsuario,
        idUbicacion: location.idUbicacion,
        idCategoria: category.idCategoria,
        fecha_cierre: tomorrow,
      },
    });

    // Act
    const response = await publicationService.deletePublication({
      idPublicacion: publication.idPublicacion,
      idUsuario: user.idUsuario,
    }) as DeletePublicationResponse;

    // Assert
    expect(response.success).toBe(true);
    const dbPublication = await prisma.publicacion.findUnique({ where: { idPublicacion: publication.idPublicacion } });
    expect(dbPublication).toBeNull();
  });

  it('should FAIL to delete when a user is not the owner', async () => {
    // Arrange
    const ownerUser = await prisma.usuario.create({ 
      data: { rut: '4444444-4', nombre: 'Owner', correo: 'owner2@example.com', contrasena: 'pw', tipo_usuario: 'EMPLEADOR' } 
    });
    const attackerUser = await prisma.usuario.create({ 
      data: { rut: '5555555-5', nombre: 'Attacker', correo: 'attacker@example.com', contrasena: 'pw', tipo_usuario: 'EMPLEADO' } 
    });
    const category = await prisma.categoria.create({ data: { nombre: 'Logística' } });
    const location = await prisma.ubicacion.create({ 
      data: { ciudad: 'Antofagasta', comuna: 'Antofagasta', region: 'Antofagasta', latitud: 0, longitud: 0 } 
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const publication = await prisma.publicacion.create({
      data: {
        titulo: 'Jefe de Bodega con experiencia',
        descripcion: 'Descripción suficientemente larga para Zod.',
        remuneracion: 600000,
        tipo: 'FULLTIME',
        estado: 'ACTIVO',
        idUsuario: ownerUser.idUsuario,
        idUbicacion: location.idUbicacion,
        idCategoria: category.idCategoria,
        fecha_cierre: tomorrow,
      },
    });

    // Act
    const response = await publicationService.deletePublication({
      idPublicacion: publication.idPublicacion,
      idUsuario: attackerUser.idUsuario,
    }) as DeletePublicationResponse;

    // Assert
    expect(response.success).toBe(false);
    expect(response.error).toBe('No autorizado o publicación no encontrada');

    const dbPublication = await prisma.publicacion.findUnique({ where: { idPublicacion: publication.idPublicacion } });
    expect(dbPublication).not.toBeNull();
  });
});


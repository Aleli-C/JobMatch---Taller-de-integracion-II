// Factory para instanciar servicios con la implementación correcta
import { PublicationService } from '../services/publication-service';
import { MockPublicationRepository } from '../repositories/mock-publication-repository';
import { PrismaPublicationRepository } from '../repositories/prisma-publication-repository';
import { PrismaClient } from '@prisma/client';

export function createPublicationService(): PublicationService {
  // En desarrollo sin BD, usar mock
  if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
    return new PublicationService(new MockPublicationRepository());
  }

  // En producción o con BD configurada, usar Prisma
  const prisma = new PrismaClient();
  return new PublicationService(new PrismaPublicationRepository(prisma));
}
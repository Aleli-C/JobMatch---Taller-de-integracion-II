// app/perfil/historial/page.tsx
import ProfileHistory from '@/components/ProfileHistory';
import { PublicationStatus, PublicationType } from '@/lib/types/publication';
import ProfileSidebar from '@/components/ProfileSidebar';

export default function Page() {
  const forumHistory = [
    {
      title: 'Consejos para primer proyecto freelance',
      author: 'alexc',
      createdAt: '2025-09-18T15:42:00.000Z',
      replies: 12,
      content: '¿Cómo cotizan su primera propuesta y qué plazos usan?',
    },
    {
      title: 'Mejores prácticas para contratos',
      author: 'alexc',
      createdAt: '2025-09-10T11:05:00.000Z',
      replies: 7,
      content: 'Cláusulas clave y experiencias con adelantos.',
    },
    {
      title: 'Stack recomendado para landing simple',
      author: 'alexc',
      createdAt: '2025-08-28T22:10:00.000Z',
      replies: 4,
      content: '¿Next.js + Tailwind o algo más liviano?',
    },
  ];

  const publications = [
    {
      id: 101,
      usuarioId: 1,
      titulo: 'Desarrollo de Landing Page',
      descripcion: 'Landing informativa para Pyme local. Integración con formulario.',
      remuneracion: 450000,
      tipo: PublicationType.FREELANCE,
      estado: PublicationStatus.ACTIVO,
      createdAt: '2025-09-20T14:30:00.000Z',
      ubicacion: { comuna: 'Santiago', region: 'Metropolitana' },
      categoria: { nombre: 'Desarrollo Web' },
    },
    {
      id: 102,
      usuarioId: 1,
      titulo: 'Soporte Frontend Part-Time',
      descripcion: 'Corrección de bugs y pequeños features en React.',
      remuneracion: 300000,
      tipo: PublicationType.PARTTIME,
      estado: PublicationStatus.INACTIVO,
      createdAt: '2025-09-05T09:00:00.000Z',
      ubicacionId: 12,
      categoriaId: 4,
    },
    {
      id: 103,
      usuarioId: 1,
      titulo: 'Implantación de Analytics',
      descripcion: 'Plan de medición, eventos y dashboard básico.',
      remuneracion: '600000',
      tipo: PublicationType.FULLTIME,
      estado: PublicationStatus.CERRADO,
      createdAt: '2025-08-15T12:15:00.000Z',
      closedAt: '2025-09-01T00:00:00.000Z',
      ubicacion: { comuna: 'Viña del Mar', region: 'Valparaíso' },
      categoria: { nombre: 'Data/Analytics' },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        <aside className="hidden lg:block">
          <ProfileSidebar />
        </aside>

        <main>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Historial</h1>
            <ProfileHistory forumHistory={forumHistory} publications={publications} />
          </div>
        </main>
      </div>
    </div>
  );
}

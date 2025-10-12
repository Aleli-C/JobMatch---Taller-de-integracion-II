// app/(demo)/page.tsx
import PendingJobCard from '@/components/PendingJobs';
import ProfileSidebar from '@/components/ProfileSidebar';

export default function Demo() {
  const now = Date.now();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ProfileSidebar />

      {/* Cards con espacio vertical entre ellas */}
      <div className="mt-6 space-y-6">
        {/* 1 */}
        <PendingJobCard
          title="Soporte técnico a domicilio"
          startAt={new Date(now + 2 * 60 * 60 * 1000)}
          endAt={new Date(now + 5 * 60 * 60 * 1000)}
          compensationCLP={85000}
          publisherName="María Pérez"
          publishedAt={new Date(now - 3 * 60 * 60 * 1000)}
        />

        {/* 2 */}
        <PendingJobCard
          title="Instalación de red doméstica"
          startAt={new Date(now + 24 * 60 * 60 * 1000)}
          endAt={new Date(now + 27 * 60 * 60 * 1000)}
          compensationCLP={120000}
          publisherName="Carlos Ruiz"
          publishedAt={new Date(now - 6 * 60 * 60 * 1000)}
        />

        {/* 3 */}
        <PendingJobCard
          title="Configuración de PC nuevo y migración de datos"
          startAt={new Date(now + 3 * 60 * 60 * 1000)}
          endAt={new Date(now + 6 * 60 * 60 * 1000)}
          compensationCLP={95000}
          publisherName="Javiera Soto"
          publishedAt={new Date(now - 90 * 60 * 1000)}
        />

        {/* 4 */}
        <PendingJobCard
          title="Mantenimiento preventivo a 5 equipos"
          startAt={new Date(now + 2 * 24 * 60 * 60 * 1000)}
          endAt={new Date(now + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)}
          compensationCLP={280000}
          publisherName="Empresa Alfa SpA"
          publishedAt={new Date(now - 12 * 60 * 60 * 1000)}
        />

        {/* 5 */}
        <PendingJobCard
          title="Soporte remoto: diagnóstico de lentitud"
          startAt={new Date(now + 60 * 60 * 1000)}
          endAt={new Date(now + 2.5 * 60 * 60 * 1000)}
          compensationCLP={45000}
          publisherName="Luis Herrera"
          publishedAt={new Date(now - 30 * 60 * 1000)}
        />
      </div>
    </div>
  );
}

// app/(demo)/page.tsx
import PendingJobCard from '@/components/PendingJobs';

export default function Demo() {
  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Datos de prueba */}
      <PendingJobCard
        title="Soporte técnico a domicilio"
        startAt={new Date(Date.now() + 2 * 60 * 60 * 1000)}
        endAt={new Date(Date.now() + 5 * 60 * 60 * 1000)}
        compensationCLP={85000}
        publisherName="María Pérez"
        publishedAt={new Date(Date.now() - 3 * 60 * 60 * 1000)}
      />
    </div>
  );
}

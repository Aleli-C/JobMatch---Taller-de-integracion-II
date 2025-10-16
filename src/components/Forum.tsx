export default function Forum() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      <p className="font-medium text-slate-700">
        Conecta tu API o componente actual para renderizar el listado de foros en este espacio.
      </p>
      <p className="mt-2">
        Si ya cuentas con un módulo de foros, reemplaza el contenido de <code>src/components/Forum.tsx</code> por tu
        implementación real o monta aquí tu tabla/listado existente.
      </p>
    </div>
  );
}
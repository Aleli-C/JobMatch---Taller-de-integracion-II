export default function DashboardProfileCard({ perfil }) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Perfil Profesional</h2>
          <p className="text-gray-500 text-sm">
            Ciudad: <span className="font-medium">{perfil?.ciudad || "No definida"}</span> | Región:{" "}
            <span className="font-medium">{perfil?.region || "No definida"}</span>
          </p>
        </div>
        <div className="mt-3 sm:mt-0 text-sm text-yellow-500">
          ⭐ {perfil?.insignia ? perfil.insignia.toFixed(1) : "Sin calificación"}
        </div>
      </div>

      {/* Experiencia */}
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Experiencia</h3>
        {perfil?.experiencia ? (
          <p className="text-gray-600 whitespace-pre-line">{perfil.experiencia}</p>
        ) : (
          <p className="text-gray-400">Sin información registrada.</p>
        )}
      </section>

      {/* Habilidades */}
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Habilidades</h3>
        {perfil?.habilidades ? (
          <div className="flex flex-wrap gap-2">
            {perfil.habilidades.split(",").map((h, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
              >
                {h.trim()}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No se han agregado habilidades.</p>
        )}
      </section>

      {/* Disponibilidad */}
      <section>
        <h3 className="text-lg font-medium mb-2 text-gray-700">Disponibilidad Horaria</h3>
        <p className="text-gray-600">
          {perfil?.disponibilidad_horaria || "No especificada"}
        </p>
      </section>

      {/* Fecha de actualización */}
      <div className="mt-6 text-xs text-gray-400 text-right">
        Última actualización:{" "}
        {perfil?.updated_at
          ? new Date(perfil.updated_at).toLocaleDateString("es-CL")
          : "Sin registro"}
      </div>
    </div>
  );
}

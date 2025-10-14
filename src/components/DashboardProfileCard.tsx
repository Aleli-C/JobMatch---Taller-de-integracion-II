export default function DashboardProfileCard({ perfil }) {
  const nombre = perfil?.nombre || `${perfil?.first_name || 'Usuario'} ${perfil?.last_name || ''}`.trim();
  const titulo = perfil?.titulo || perfil?.profesion || 'Profesional';
  const ciudad = perfil?.ciudad || 'No definida';
  const region = perfil?.region || 'No definida';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-gray-50">
      {/* Elevated header with subtle gradient */}
  <div className="rounded-xl -mx-6 px-6 py-5 bg-gradient-to-r from-white via-slate-50 to-white border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center overflow-hidden ring-2 ring-white shadow-md">
              {perfil?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={perfil.avatar} alt={`${nombre} avatar`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-semibold text-gray-400">{(nombre || 'U').charAt(0)}</span>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-white flex items-center justify-center text-xs text-green-500 shadow">●</span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">{nombre}</h2>
              <p className="text-indigo-600 text-sm font-medium">{titulo}</p>
              <p className="text-gray-400 text-sm">{ciudad}, {region}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 rounded-full px-3 py-1 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0L5.34 18.05c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L1.248 8.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69L9.05 2.927z"/></svg>
                <span className="text-sm font-semibold text-gray-800">{perfil?.insignia ? perfil.insignia.toFixed(1) : '—'}</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-full px-3 py-1 shadow-sm">
                <span className="text-sm font-semibold text-indigo-700">{perfil?.stats?.trabajos || 0}</span>
                <span className="text-gray-400 text-sm">trabajos</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16 3l5 5M21 8h-5v-5"/></svg>
                Editar
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: left column info, right column skills & availability */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Sobre mí</h3>
            <div className="bg-white text-gray-700 rounded-lg p-5 shadow-inner">
              {perfil?.descripcion ? (
                <p className="whitespace-pre-line leading-relaxed">{perfil.descripcion}</p>
              ) : (
                <p className="text-gray-400">No hay descripción disponible.</p>
              )}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Experiencia</h3>
            <div className="bg-white rounded-lg p-5 shadow-inner">
              {perfil?.experiencia ? (
                <p className="whitespace-pre-line leading-relaxed text-gray-700">{perfil.experiencia}</p>
              ) : (
                <p className="text-gray-400">Sin información registrada.</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Contacto</h3>
            <div className="bg-white rounded-lg p-5 shadow-inner text-sm text-gray-700 space-y-2">
              <div className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12v6M8 12v6m-2 0h12a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2z"/></svg><span>Email: <span className="font-medium">{perfil?.email || 'No definido'}</span></span></div>
              <div className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4v6"/></svg><span>Teléfono: <span className="font-medium">{perfil?.telefono || 'No definido'}</span></span></div>
              {perfil?.direccion && <div className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z"/></svg><span>Dirección: <span className="font-medium">{perfil.direccion}</span></span></div>}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Habilidades</h3>
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg p-4">
              {perfil?.habilidades ? (
                <div className="flex flex-wrap gap-2">
                  {perfil.habilidades.split(',').map((h, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-white text-indigo-700 border border-indigo-100 text-sm shadow hover:scale-105 transform transition">{h.trim()}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No se han agregado habilidades.</p>
              )}
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Disponibilidad</h3>
            <div className="bg-white border rounded-lg p-3 text-gray-700 text-sm shadow-sm">
              {perfil?.disponibilidad_horaria ? (
                <div>{perfil.disponibilidad_horaria}</div>
              ) : (
                <div className="text-gray-400">No especificada</div>
              )}
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
            <div className="text-xs text-gray-400">Última actualización</div>
            <div className="font-medium text-gray-700 mt-1">{perfil?.updated_at ? new Date(perfil.updated_at).toLocaleDateString('es-CL') : 'Sin registro'}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}

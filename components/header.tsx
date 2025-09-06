export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Nombre empresa */}
          <div className="flex items-center space-x-2">
            <img
              src="/logo sin fondo.png"
              alt="JobMatch Logo"
              className="h-16 w-20"
            />
            <span className="text-2xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Barra de búsqueda a la derecha */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar Publicaciones"
              className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

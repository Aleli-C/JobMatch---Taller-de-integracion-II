"use client";
import { useState } from "react";
// NOTA: Se comenta temporalmente el Link y la Card si no existen, pero mantendré la estructura.
// import Link from "next/link"; 
// import PublicationCard from "../../../components/PublicationCard";

// Definición de tipos para TypeScript (mejor práctica)
interface Publicacion {
    id: number;
    titulo: string;
    descripcion: string;
    icon: string;
    tipo: "buscar" | "ofrecer";
}

// Componente simulado para fines de visualización si no tienes el PublicationCard real
const PublicationCard = ({ title, description, icon, onEdit, onDelete }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 flex flex-col justify-between">
        <div>
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>
        <div className="mt-4 flex gap-3">
            <button 
                onClick={onEdit} 
                className="flex-grow px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
                Editar
            </button>
            <button 
                onClick={onDelete} 
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
            >
                Eliminar
            </button>
        </div>
    </div>
);


const publicacionesData: Publicacion[] = [
    { id: 1, titulo: "Ayudante de Mudanza", descripcion: "Necesito apoyo para cargar y descargar muebles en un traslado desde Loncoche hasta Temuco. El trabajo incluye levantar objetos pesados.", icon: "🚚", tipo: "buscar" },
    { id: 2, titulo: "Paseador de Perros", descripcion: "Buscamos a alguien responsable y amante de los animales para pasear 2 perros de raza golden retriever, durante fines de semana y algunos días de semana.", icon: "🐕", tipo: "buscar" },
    { id: 3, titulo: "Cuidado de Niños", descripcion: "Se necesita niñera para cuidar a dos niños menores de 5 años, en las mañanas. El trabajo consiste en preparar colaciones y supervisar su seguridad en todo momento.", icon: "👶", tipo: "buscar" },
    { id: 4, titulo: "Jardinería Básica", descripcion: "Corte de pasto y limpieza de jardín en casa particular. Incluye riego de plantas, mantenimiento de maceteros y poda de arbustos pequeños.", icon: "🌱", tipo: "ofrecer" },
    { id: 5, titulo: "Ayudante de Eventos", descripcion: "Necesitamos apoyo para armar y desarmar mesas y sillas en un evento social. Se requiere disponibilidad para trabajar en equipo, rapidez y responsabilidad en el montaje y desmontaje.", icon: "🎉", tipo: "ofrecer" },
    { id: 6, titulo: "Repartidor en Bicicleta", descripcion: "Entrega de comida rápida en bicicleta dentro del centro de la ciudad, transportarlos de manera segura y entregar puntualmente a los clientes.", icon: "🚴‍♂️", tipo: "buscar" },
    { id: 7, titulo: "Profesor Particular", descripcion: "Clases particulares para estudiantes de enseñanza media en la asignatura de matemáticas. Se valorará paciencia y experiencia previa.", icon: "📚", tipo: "ofrecer" },
    { id: 8, titulo: "Camarero", descripcion: "Atención en cafetería en el centro de la ciudad. El trabajo consiste en tomar pedidos, servir mesas y colaborar en mantener el local limpio y ordenado.", icon: "☕", tipo: "ofrecer" },
    { id: 9, titulo: "Repartidor en Moto", descripcion: "Entrega de pedidos de comida rápida dentro de la ciudad. Se requiere licencia al día, casco propio y disponibilidad para trabajar en horarios flexibles,", icon: "🛵", tipo: "buscar" },
    { id: 10, titulo: "Promotor de Ventas", descripcion: "Promocionar productos en supermercados y ferias locales. El trabajo incluye entregar información sobre las ofertas y fomentar la compra a través de promociones activas.", icon: "🛍️", tipo: "ofrecer" },
    { id: 11, titulo: "Ayudante de Construcción", descripcion: "Apoyo en carga de materiales y limpieza en obras menores. Se requiere disposición para aprender tareas básicas y mantener un entorno de trabajo seguro.", icon: "👷‍♂️", tipo: "buscar" },
    { id: 12, titulo: "Cajero en Minimarket", descripcion: "Atención al cliente y manejo de caja en turno de medio tiempo. El trabajo incluye mantener el orden de productos en góndola y colaborar con tareas generales del local.", icon: "💳", tipo: "ofrecer" },
];

export default function MisPublicaciones() {
    const [publicaciones, setPublicaciones] = useState(publicacionesData);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingPub, setEditingPub] = useState<null | Publicacion>(null);
    const [filtro, setFiltro] = useState<"todo" | "ofrecer" | "buscar">("todo");
    // NUEVO ESTADO: Término de búsqueda
    const [searchTerm, setSearchTerm] = useState(""); 
    
    const itemsPerPage = 6;

    // LÓGICA DE FILTRADO Y BÚSQUEDA COMBINADA
    const filteredAndSearchedPubs = publicaciones
        .filter((p) => (filtro === "todo" || p.tipo === filtro)) // 1. Filtrar por tipo
        .filter((p) => { // 2. Filtrar por término de búsqueda
            if (searchTerm.trim() === "") return true; 
            const term = searchTerm.toLowerCase();
            // Búsqueda por título o descripción (insensible a mayúsculas)
            return (
                p.titulo.toLowerCase().includes(term) ||
                p.descripcion.toLowerCase().includes(term)
            );
        });

    const totalPages = Math.ceil(filteredAndSearchedPubs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredAndSearchedPubs.slice(startIndex, startIndex + itemsPerPage);

    const handleEdit = (pub: Publicacion) => {
        setEditingPub(pub);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
            setPublicaciones((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const saveEdit = (updated: Publicacion) => {
        setPublicaciones((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingPub(null);
    };
    
    // Función para manejar el cambio de búsqueda y resetear la página
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Importante: Resetear paginación al buscar
    }

    // Función para manejar el cambio de filtro y resetear la página
    const handleFiltroChange = (tipo: "todo" | "ofrecer" | "buscar") => {
        setFiltro(tipo);
        setCurrentPage(1); // Importante: Resetear paginación al cambiar filtro
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Mis Publicaciones</h1>
                
                {/* BARRA DE BÚSQUEDA */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                
                {/* Filtro y Botón de Nueva Publicación */}
                <div className="flex gap-3 mb-8 items-center">
                    {["todo", "ofrecer", "buscar"].map((tipo) => (
                        <button
                            key={tipo}
                            onClick={() => handleFiltroChange(tipo as "todo" | "ofrecer" | "buscar")}
                            className={`px-5 py-2 rounded-full font-semibold transition-colors text-sm shadow-md ${
                                filtro === tipo ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                            }`}
                        >
                            {tipo === "todo" ? "Todas" : tipo === "ofrecer" ? "Ofrecer Trabajo" : "Buscar Trabajo"}
                        </button>
                    ))}
                    
                    {/* Botón para crear nueva publicación (simulado) */}
                    {/* Se reemplaza Link por un botón simulado si no usamos Next.js Router */}
                    <button 
                         className="ml-auto px-5 py-2 rounded-full font-semibold transition-colors text-sm bg-green-500 text-white hover:bg-green-600 shadow-md flex items-center"
                         onClick={() => console.log('Navegar a /publicar (simulado)')}
                     >
                         + Nueva Publicación
                    </button>
                    
                </div>
                
                {/* Cards */}
                {currentItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((pub) => (
                            <PublicationCard
                                key={pub.id}
                                title={pub.titulo}
                                description={pub.descripcion}
                                icon={pub.icon}
                                onEdit={() => handleEdit(pub)}
                                onDelete={() => handleDelete(pub.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center bg-white rounded-xl shadow-lg border border-gray-200">
                        <p className="text-xl font-semibold text-gray-700">No se encontraron publicaciones.</p>
                        <p className="text-gray-500 mt-2">Intenta ajustar tus filtros o tu término de búsqueda: <span className="font-medium text-blue-600">"{searchTerm}"</span></p>
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}

                {/* Sección de edición (Modal) */}
                {editingPub && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 p-4 z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl transform transition-all">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Editar Publicación</h2>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-3 mb-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={editingPub.titulo}
                                onChange={(e) =>
                                    setEditingPub({ ...editingPub, titulo: e.target.value })
                                }
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
                                value={editingPub.descripcion}
                                onChange={(e) =>
                                    setEditingPub({ ...editingPub, descripcion: e.target.value })
                                }
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                    onClick={() => setEditingPub(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                    onClick={() => saveEdit(editingPub)}
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

"use client"

import React, { useState } from "react"
import { MapPin, Briefcase, DollarSign, ChevronRight } from "lucide-react"

// Definición de tipos/interfaces
interface Job {
  id: number
  title: string
  description: string
  location: string
  salary: string
  icon: string
}

interface FilterOption {
  value: string
  label: string
}

export default function PublicationsPage() {
  // Datos de ejemplo para los trabajos
  const jobs: Job[] = [
    { id: 1, title: "Ayudante de Mudanza", description: "Se necesita apoyo para cargar y descargar muebles en un traslado.", location: "Temuco, Chile", salary: "CLP20,000 - CLP25,000 / día", icon: "🚚" },
    { id: 2, title: "Paseador de Perros", description: "Buscamos alguien responsable para pasear 2 perros durante la semana.", location: "Villarica, Chile", salary: "CLP5,000 - CLP8,000 / paseo", icon: "🐕" },
    { id: 3, title: "Cuidado de Niños", description: "Se necesita niñera para cuidar a dos niños en las tardes.", location: "Pucón, Chile", salary: "CLP15,000 - CLP20,000 / tarde", icon: "👶" },
    { id: 4, title: "Jardinería Básica", description: "Corte de pasto y limpieza de jardín en casa particular.", location: "Loncoche, Chile", salary: "CLP12,000 - CLP18,000 / jornada", icon: "🌱" },
    { id: 5, title: "Ayudante en Eventos", description: "Se necesita apoyo para montaje y desmontaje de mesas y sillas en un evento.", location: "Freire, Chile", salary: "CLP20,000 - CLP30,000 / evento", icon: "🎉" },
    { id: 6, title: "Repartidor en Bicicleta", description: "Entrega de comida rápida en bicicleta dentro del centro de la ciudad.", location: "Temuco, Chile", salary: "CLP10,000 - CLP15,000 / jornada", icon: "🚴‍♂️" },
    { id: 7, title: "Profesor Particular", description: "Se requiere profesor para clases de matemáticas nivel enseñanza media.", location: "Valdivia, Chile", salary: "CLP12,000 - CLP18,000 / hora", icon: "📚" },
    { id: 8, title: "Camarero", description: "Atención en cafetería en el centro de la ciudad.", location: "Temuco, Chile", salary: "CLP18,000 - CLP22,000 / turno", icon: "☕" },
    { id: 9, title: "Repartidor en Moto", description: "Entrega de pedidos de comida rápida dentro de la ciudad.", location: "Temuco, Chile", salary: "CLP15,000 - CLP25,000 / jornada", icon: "🛵"},
    { id: 10, title: "Promotor de Ventas", description: "Promocionar productos en supermercados y ferias locales.", location: "Valdivia, Chile", salary: "CLP20,000 - CLP30,000 / día", icon: "🛍️"},
    { id: 11, title: "Ayudante de Construcción", description: "Apoyo en carga de materiales y limpieza en obras menores.", location: "Pucón, Chile", salary: "CLP25,000 - CLP35,000 / jornada", icon: "👷‍♂️"},
    { id: 12, title: "Cajero en Minimarket", description: "Atención al cliente y manejo de caja en turno de medio tiempo.", location: "Loncoche, Chile", salary: "CLP18,000 - CLP22,000 / turno", icon: "💳"}
  ]

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6

  // Calcular trabajos por página
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage)

  // Opciones para los filtros
  const categoryOptions: FilterOption[] = [
    { value: "", label: "Todas las categorías" },
    { value: "service", label: "Servicios y Arreglos" },
    { value: "personal", label: "Cuidado Personal y Apoyo" },
    { value: "logic", label: "Logística y Apoyo Físico" },
    { value: "entertaiment", label: "Eventos y Entretenimiento" },
    { value: "comercio", label: "Comercio" }
  ]

  const locationOptions: FilterOption[] = [
    { value: "", label: "Todas las ubicaciones" },
    { value: "villarica", label: "Villarica" },
    { value: "temuco", label: "Temuco" },
    { value: "loncoche", label: "Loncoche" },
    { value: "valdivia", label: "Valdivia" }
  ]

  const jobTypeOptions: FilterOption[] = [
    { value: "", label: "Todos los tipos" },
    { value: "full-time", label: "Tiempo completo" },
    { value: "part-time", label: "Medio tiempo" },
    { value: "freelance", label: "Freelance" },
    { value: "contract", label: "Contrato" }
  ]

  const salaryOptions: FilterOption[] = [
    { value: "", label: "Todos los rangos" },
    { value: "20-30", label: "CLP20,000 - CLP30,000" },
    { value: "30-40", label: "CLP30,000 - CLP40,000" },
    { value: "40-50", label: "CLP40,000 - CLP50,000" },
    { value: "50+", label: "CLP50,000+" }
  ]

  // Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Búsqueda:", event.target.value)
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Filtro cambiado:", event.target.name, event.target.value)
  }

  const handleJobClick = (jobId: number) => {
    console.log("Job clicked:", jobId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Explora Oportunidades Laborales
          </h1>
        </section>

        {/* Filtros */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 shadow-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Categoría */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Categoría
                </label>
                <select
                  name="category"
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ubicación
                </label>
                <select
                  name="location"
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Tipo de empleo */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Tipo de Empleo
                </label>
                <select
                  name="jobType"
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {jobTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Salario */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Salario
                </label>
                <select
                  name="salary"
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {salaryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Filtrar por palabra clave..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Grid de trabajos */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm shadow-blue-100 border border-gray-200 p-6 hover:shadow-lg hover:shadow-blue-200 transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl" role="img" aria-label={job.title}>{job.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {job.salary}
                </div>

                <button
                  onClick={() => handleJobClick(job.id)}
                  className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 text-sm font-medium transition-colors"
                >
                  Ver Más
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              )
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1]
                const showEllipsis = prevPage && page - prevPage > 1

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                )
              })}
          </div>
        </section>
      </main>
    </div>
  )
}

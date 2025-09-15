"use client"

import { useState } from "react"
import { MapPin, DollarSign, ChevronRight, X, Clock, User, Phone, Mail } from "lucide-react"
import FilterBar from "../../../components/FilterBar"
import { useToastContext } from "../../../components/ToastContext";
import PublicationCard from "../../../components/PublicationCard";

// Definición de tipos/interfaces
interface Job {
  id: number
  title: string
  description: string
  location: string
  salary: string
  icon: string
  tipo: "buscar" | "ofrecer"
  detailedDescription?: string
  requirements?: string[]
  schedule?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  duration?: string
}

// Modal de detalles del trabajo
const JobDetailsModal = ({ job, isOpen, onClose, onSelect }: {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  onSelect: (job: Job) => void
}) => {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">{job.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción del Trabajo</h3>
            <p className="text-gray-700">{job.detailedDescription || job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.schedule && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Horario</p>
                  <p className="text-sm text-gray-600">{job.schedule}</p>
                </div>
              </div>
            )}
            {job.duration && (
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Duración</p>
                  <p className="text-sm text-gray-600">{job.duration}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contacto</h3>
            <div className="space-y-2">
              {job.contactPerson && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{job.contactPerson}</span>
                </div>
              )}
              {job.contactPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{job.contactPhone}</span>
                </div>
              )}
              {job.contactEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{job.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            Cerrar
          </button>
          <button
            onClick={() => onSelect(job)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Seleccionar Servicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PublicationsPage() {
  const { addToast } = useToastContext();

  const jobs: Job[] = [
    { 
      id: 1, 
      title: "Ayudante de Mudanza", 
      description: "Se busca ayudante responsable para apoyar en la carga y descarga de muebles y electrodomésticos durante un traslado en Temuco. El trabajo incluye esfuerzo físico y disponibilidad por el día completo.", 
      location: "Temuco", 
      salary: "CLP20,000 - CLP25,000 / día", 
      icon: "🚚", 
      tipo: "buscar" 
    },
    { 
      id: 2, 
      title: "Paseador de Perros", 
      description: "Se busca persona responsable para pasear a 2 perros de raza mediana en Villarica. Los paseos serán de lunes a viernes en la tarde y deben ser de al menos 1 hora.", 
      location: "Villarica", 
      salary: "CLP5,000 - CLP8,000 / paseo", 
      icon: "🐕", 
      tipo: "buscar" 
    },
    { 
      id: 3, 
      title: "Cuidado de Niños", 
      description: "Se necesita niñera confiable para cuidar a dos niños de 6 y 8 años en las tardes en Pucón. Se requiere ayuda con tareas escolares, juegos y preparación de meriendas.", 
      location: "Pucón", 
      salary: "CLP15,000 - CLP20,000 / tarde", 
      icon: "👶", 
      tipo: "buscar" 
    },
    { 
      id: 4, 
      title: "Repartidor en Bicicleta", 
      description: "Se busca repartidor en bicicleta para entregar comida rápida dentro del centro de Temuco. Es necesario contar con bicicleta propia y disponibilidad en horario de tarde.", 
      location: "Temuco", 
      salary: "CLP10,000 - CLP15,000 / jornada", 
      icon: "🚴‍♂️", 
      tipo: "buscar" 
    },
    { 
      id: 5, 
      title: "Cuidado de Adulto Mayor", 
      description: "Se busca persona paciente y responsable para acompañar y asistir a un adulto mayor en Pucón. Las tareas incluyen compañía, caminatas y ayuda con comidas ligeras.", 
      location: "Pucón", 
      salary: "CLP20,000 - CLP25,000 / jornada", 
      icon: "🧓", 
      tipo: "buscar" 
    },
    { 
      id: 6, 
      title: "Ayuda en Limpieza", 
      description: "Se necesita apoyo en limpieza general de casa particular en Lautaro. Incluye aseo de baños, pisos, cocina y ventanas. Trabajo de medio día o jornada completa según disponibilidad.", 
      location: "Lautaro", 
      salary: "CLP15,000 - CLP20,000 / jornada", 
      icon: "🧹", 
      tipo: "buscar" 
    },
    { 
      id: 7, 
      title: "Jardinería Básica", 
      description: "Me ofrezco para realizar jardinería básica en casas particulares. Puedo cortar pasto, podar arbustos, regar plantas y mantener jardines pequeños en buen estado.", 
      location: "Loncoche", 
      salary: "CLP12,000 - CLP18,000 / jornada", 
      icon: "🌱", 
      tipo: "ofrecer" 
    },
    { 
      id: 8, 
      title: "Ayudante en Eventos", 
      description: "Me ofrezco para apoyar en montaje y desmontaje de mesas, sillas y carpas en eventos sociales o familiares. Tengo experiencia previa y disponibilidad los fines de semana.", 
      location: "Freire", 
      salary: "CLP20,000 - CLP30,000 / evento", 
      icon: "🎉", 
      tipo: "ofrecer" 
    },
    { 
      id: 9, 
      title: "Ayudante de Pintura", 
      description: "Me ofrezco para trabajos de pintura de interiores en casas particulares en Temuco. Puedo preparar superficies, aplicar pintura y dejar el espacio limpio al finalizar.", 
      location: "Temuco", 
      salary: "CLP18,000 - CLP25,000 / jornada", 
      icon: "🎨", 
      tipo: "ofrecer" 
    },
    { 
      id: 10, 
      title: "Volanteo Publicitario", 
      description: "Me ofrezco para repartir volantes en el centro de Villarrica. Puedo trabajar en plazas, ferias y calles concurridas. Soy puntual, activo y responsable.", 
      location: "Villarrica", 
      salary: "CLP12,000 - CLP15,000 / día", 
      icon: "📄", 
      tipo: "ofrecer" 
    },
    { 
      id: 11, 
      title: "Ayuda en Bodega", 
      description: "Me ofrezco para ayudar en bodegas pequeñas, cargando, ordenando y clasificando productos. Tengo buena condición física y disponibilidad inmediata en Temuco.", 
      location: "Temuco", 
      salary: "CLP18,000 - CLP22,000 / jornada", 
      icon: "📦", 
      tipo: "ofrecer" 
    },
    { 
      id: 12, 
      title: "Ayudante de Cocina", 
      description: "Me ofrezco como ayudante de cocina en locales pequeños de Villarrica. Puedo apoyar en preparación de ingredientes, limpieza y tareas básicas de cocina.", 
      location: "Villarrica", 
      salary: "CLP15,000 - CLP18,000 / jornada", 
      icon: "🍳", 
      tipo: "ofrecer" 
    },
  ]

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    jobType: "",
    salary: "",
  })
  const [filtroTipo, setFiltroTipo] = useState<"todo" | "buscar" | "ofrecer">("todo")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const jobsPerPage = 6

  // ---- FILTROS ----
  const parseSalaryRange = (salaryStr: string): [number, number] | null => {
    const match = salaryStr.match(/CLP\s?([\d.,]+)\s*-\s*CLP\s?([\d.,]+)/i)
    if (match) {
      const min = parseInt(match[1].replace(/[.,]/g, ""))
      const max = parseInt(match[2].replace(/[.,]/g, ""))
      return [min, max]
    }
    return null
  }

  const parseFilterRange = (filter: string): [number, number] | null => {
    if (!filter) return null
    if (filter === "50+") return [50000, Infinity]
    const match = filter.match(/(\d+)-(\d+)/)
    if (match) {
      return [parseInt(match[1]) * 1000, parseInt(match[2]) * 1000]
    }
    return null
  }

  const filteredJobs = jobs.filter(job => {
    const matchesTipo = filtroTipo === "todo" || job.tipo === filtroTipo
    const matchesSearch =
      !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory =
      !filters.category || job.title.toLowerCase().includes(filters.category)
    const matchesLocation =
      !filters.location || job.location.toLowerCase().includes(filters.location)
    const matchesJobType =
      !filters.jobType || job.title.toLowerCase().includes(filters.jobType)

    let matchesSalary = true
    const filterRange = parseFilterRange(filters.salary)
    const jobRange = parseSalaryRange(job.salary)
    if (filterRange && jobRange) {
      matchesSalary = jobRange[1] >= filterRange[0] && jobRange[0] <= filterRange[1]
    } else if (filterRange) {
      matchesSalary = false
    }

    return (
      matchesTipo &&
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesJobType &&
      matchesSalary
    )
  })

  // ---- PAGINACIÓN ----
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleJobSelect = (job: Job) => {
    addToast({
      type: 'SERVICE_SELECTED',
      title: 'Servicio Seleccionado',
      message: `Has seleccionado: ${job.title}`,
      timestamp: new Date()
    });
    setIsModalOpen(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Título */}
        <section className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
            Explora Oportunidades Laborales
          </h1>
          <p className="text-gray-600">Encuentra trabajos disponibles en tu ciudad</p>
        </section>

        {/* Filtro tipo */}
        <div className="flex gap-2 mb-6">
          {["todo", "buscar", "ofrecer"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => { setFiltroTipo(tipo as any); setCurrentPage(1) }}
              className={`px-4 py-2 rounded transition-colors ${
                filtroTipo === tipo ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tipo === "todo" ? "Todas" : tipo === "buscar" ? "Buscar" : "Ofrecer"}
            </button>
          ))}
        </div>

        {/* Otros filtros */}
        <FilterBar
          onFilter={(newFilters) => {
            setFilters(newFilters)
            setCurrentPage(1)
          }}
          categories={[
            { value: "", label: "Todas las categorías" },
            { value: "service", label: "Servicios y Arreglos" },
            { value: "personal", label: "Cuidado Personal y Apoyo" },
            { value: "logic", label: "Logística y Apoyo Físico" },
            { value: "entertaiment", label: "Eventos y Entretenimiento" },
            { value: "comercio", label: "Comercio" }
          ]}
          locations={[
            { value: "", label: "Todas las ubicaciones" },
            { value: "villarica", label: "Villarica" },
            { value: "temuco", label: "Temuco" },
            { value: "loncoche", label: "Loncoche" },
            { value: "valdivia", label: "Valdivia" }
          ]}
          jobTypes={[
            { value: "", label: "Todos los tipos" },
            { value: "full-time", label: "Tiempo completo" },
            { value: "part-time", label: "Medio tiempo" },
            { value: "freelance", label: "Freelance" },
            { value: "contract", label: "Contrato" }
          ]}
          salaries={[
            { value: "", label: "Todos los rangos" },
            { value: "0-10", label: "CLP0 - CLP10,000" },
            { value: "10-20", label: "CLP10,000 - CLP20,000" },
            { value: "20-30", label: "CLP20,000 - CLP30,000" },
            { value: "30-40", label: "CLP30,000 - CLP40,000" },
            { value: "40-50", label: "CLP40,000 - CLP50,000" },
            { value: "50+", label: "CLP50,000+" }
          ]}
        />

        {/* Grid de trabajos - Ahora usando PublicationCard correctamente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {currentJobs.map((job) => (
            <PublicationCard
              key={job.id}
              title={job.title}
              description={job.description}
              icon={job.icon}
              location={job.location}
              salary={job.salary}
              onViewDetails={() => handleJobClick(job)}
            />
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleJobSelect}
      />
    </div>
  )
}
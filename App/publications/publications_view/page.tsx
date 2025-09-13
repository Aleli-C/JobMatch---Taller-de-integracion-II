"use client"

import { useState } from "react"
import { MapPin, DollarSign, ChevronRight, X, Clock, User, Phone, Mail } from "lucide-react"
import FilterBar from "../../../components/FilterBar"
import { useToastContext } from "../../../components/ToastContext";

// Definición de tipos/interfaces
interface Job {
  id: number
  title: string
  description: string
  location: string
  salary: string
  icon: string
  // Detalles adicionales para el modal
  detailedDescription?: string
  requirements?: string[]
  schedule?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  duration?: string
}

interface FilterOption {
  value: string
  label: string
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
        {/* Header del modal */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="text-3xl" role="img" aria-label={job.title}>
              {job.icon}
            </div>
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {/* Descripción detallada */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción del Trabajo</h3>
            <p className="text-gray-700 leading-relaxed">
              {job.detailedDescription || job.description}
            </p>
          </div>

          {/* Requisitos */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detalles adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.schedule && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Horario</p>
                  <p className="text-sm text-gray-600">{job.schedule}</p>
                </div>
              </div>
            )}

            {job.duration && (
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duración</p>
                  <p className="text-sm text-gray-600">{job.duration}</p>
                </div>
              </div>
            )}
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de Contacto</h3>
            <div className="space-y-2">
              {job.contactPerson && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{job.contactPerson}</span>
                </div>
              )}
              {job.contactPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{job.contactPhone}</span>
                </div>
              )}
              {job.contactEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{job.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer del modal con botones */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => onSelect(job)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
          >
            Seleccionar Servicio
          </button>
        </div>
      </div>
    </div>
  )
}

// Utilidad para extraer el rango numérico de un string de salario
function parseSalaryRange(salaryStr: string): [number, number] | null {
  const match =
    salaryStr.match(/CLP\s?([\d.,]+)\s*-\s*CLP\s?([\d.,]+)/i) ||
    salaryStr.match(/CLP([\d.,]+)\s*-\s*CLP([\d.,]+)/i)
  if (match) {
    const min = parseInt(match[1].replace(/[.,]/g, ""))
    const max = parseInt(match[2].replace(/[.,]/g, ""))
    return [min, max]
  }
  const plusMatch =
    salaryStr.match(/CLP\s?([\d.,]+)\+/i) ||
    salaryStr.match(/CLP([\d.,]+)\+/i)
  if (plusMatch) {
    const min = parseInt(plusMatch[1].replace(/[.,]/g, ""))
    return [min, Infinity]
  }
  return null
}

// Utilidad para extraer el rango del filtro
function parseFilterRange(filter: string): [number, number] | null {
  if (!filter) return null
  if (filter === "50+") return [50000, Infinity]
  const match = filter.match(/(\d+)-(\d+)/)
  if (match) {
    return [parseInt(match[1]) * 1000, parseInt(match[2]) * 1000]
  }
  return null
}

export default function PublicationsPage() {
  const { addToast } = useToastContext();

  const jobs: Job[] = [
    { 
      id: 1, 
      title: "Ayudante de Mudanza", 
      description: "Se necesita apoyo para cargar y descargar muebles en un traslado.", 
      location: "Temuco, Chile", 
      salary: "CLP20,000 - CLP25,000 / día", 
      icon: "🚚",
      detailedDescription: "Buscamos una persona física y responsable para ayudar en una mudanza. El trabajo consiste en cargar y descargar muebles, cajas y electrodomésticos. Se requiere disponibilidad para trabajar el fin de semana.",
      requirements: ["Experiencia previa en mudanzas (deseable)", "Buena condición física", "Responsabilidad y puntualidad", "Disponibilidad de fin de semana"],
      schedule: "Sábado 8:00 AM - 6:00 PM",
      contactPerson: "Carlos Mendoza",
      contactPhone: "+56 9 8765 4321",
      contactEmail: "carlos.mendoza@email.com",
      duration: "1 día"
    },
    { 
      id: 2, 
      title: "Paseador de Perros", 
      description: "Buscamos alguien responsable para pasear 2 perros durante la semana.", 
      location: "Villarica, Chile", 
      salary: "CLP5,000 - CLP8,000 / paseo", 
      icon: "🐕",
      detailedDescription: "Se requiere una persona amante de los animales para pasear dos perros de raza mediana. Los paseos son de aproximadamente 1 hora cada uno, por las tardes entre semana.",
      requirements: ["Amor por los animales", "Experiencia con perros", "Disponibilidad de lunes a viernes", "Responsabilidad"],
      schedule: "Lunes a Viernes 5:00 PM - 6:00 PM",
      contactPerson: "María González",
      contactPhone: "+56 9 1234 5678",
      contactEmail: "maria.gonzalez@email.com",
      duration: "Contrato mensual renovable"
    },
    { 
      id: 3, 
      title: "Cuidado de Niños", 
      description: "Se necesita niñera para cuidar a dos niños en las tardes.", 
      location: "Pucón, Chile", 
      salary: "CLP15,000 - CLP20,000 / tarde", 
      icon: "👶",
      detailedDescription: "Buscamos una niñera confiable para cuidar a dos niños de 6 y 8 años en las tardes. Las responsabilidades incluyen ayuda con tareas, preparar merienda y actividades recreativas.",
      requirements: ["Experiencia comprobable en cuidado infantil", "Referencias", "Paciencia con niños", "Conocimientos básicos de primeros auxilios (deseable)"],
      schedule: "Lunes a Viernes 2:00 PM - 7:00 PM",
      contactPerson: "Andrea Silva",
      contactPhone: "+56 9 9876 5432",
      contactEmail: "andrea.silva@email.com",
      duration: "3 meses con posibilidad de extensión"
    },
    { 
      id: 4, 
      title: "Jardinería Básica", 
      description: "Corte de pasto y limpieza de jardín en casa particular.", 
      location: "Loncoche, Chile", 
      salary: "CLP12,000 - CLP18,000 / jornada", 
      icon: "🌱",
      detailedDescription: "Se requiere persona para mantenimiento básico de jardín que incluye corte de pasto, poda de arbustos, limpieza de hojas y riego de plantas. Es un jardín de tamaño mediano.",
      requirements: ["Experiencia en jardinería", "Herramientas propias (deseable)", "Disponibilidad los sábados", "Conocimiento de plantas básicas"],
      schedule: "Sábados 9:00 AM - 1:00 PM",
      contactPerson: "Roberto Fuentes",
      contactPhone: "+56 9 5555 1234",
      contactEmail: "roberto.fuentes@email.com",
      duration: "Trabajo quincenal"
    },
    { 
      id: 5, 
      title: "Ayudante en Eventos", 
      description: "Se necesita apoyo para montaje y desmontaje de mesas y sillas en un evento.", 
      location: "Freire, Chile", 
      salary: "CLP20,000 - CLP30,000 / evento", 
      icon: "🎉",
      detailedDescription: "Buscamos personas para apoyar en el montaje y desmontaje de un evento familiar. El trabajo incluye armado de carpas, mesas, sillas y decoración básica.",
      requirements: ["Experiencia en eventos (deseable)", "Buena condición física", "Trabajo en equipo", "Disponibilidad el domingo"],
      schedule: "Domingo 7:00 AM - 11:00 PM",
      contactPerson: "Claudia Ramírez",
      contactPhone: "+56 9 7777 8888",
      contactEmail: "claudia.ramirez@email.com",
      duration: "1 día (evento único)"
    },
    { 
      id: 6, 
      title: "Repartidor en Bicicleta", 
      description: "Entrega de comida rápida en bicicleta dentro del centro de la ciudad.", 
      location: "Temuco, Chile", 
      salary: "CLP10,000 - CLP15,000 / jornada", 
      icon: "🚴‍♂️",
      detailedDescription: "Se busca repartidor en bicicleta para delivery de comida rápida. El trabajo requiere movilizarse por el centro de la ciudad entregando pedidos a domicilio.",
      requirements: ["Bicicleta propia", "Casco de seguridad", "Conocimiento del centro de la ciudad", "Celular con GPS"],
      schedule: "Martes y Jueves 6:00 PM - 10:00 PM",
      contactPerson: "Delivery Express",
      contactPhone: "+56 9 3333 4444",
      contactEmail: "repartidores@deliveryexpress.cl",
      duration: "Por horas (flexible)"
    },
    { 
      id: 7, 
      title: "Ayudante de Pintura", 
      description: "Se busca apoyo para pintar paredes interiores en una casa particular.", 
      location: "Temuco, Chile", 
      salary: "CLP18,000 - CLP25,000 / jornada", 
      icon: "🎨",
      detailedDescription: "Trabajo de apoyo en pintura de muros interiores. Incluye preparación de superficies, aplicación de pintura y limpieza posterior.", 
      requirements: ["Experiencia básica en pintura", "Ropa adecuada para trabajar", "Responsabilidad y puntualidad"], 
      schedule: "Sábado y Domingo 9:00 AM - 6:00 PM", 
      contactPerson: "Luis Herrera", 
      contactPhone: "+56 9 6543 2100", 
      contactEmail: "luis.herrera@email.com", 
      duration: "2 días" 
    },
    { 
      id: 8, 
      title: "Volanteo Publicitario", 
      description: "Entrega de volantes en el centro de la ciudad.", 
      location: "Villarrica, Chile", 
      salary: "CLP12,000 - CLP15,000 / día", 
      icon: "📄",
      detailedDescription: "Se necesita persona activa para repartir volantes en plazas y calles céntricas. Trabajo sencillo, de pie y en movimiento constante.", 
      requirements: ["Puntualidad", "Capacidad para caminar varias horas", "Buena disposición"], 
      schedule: "Viernes y Sábado 10:00 AM - 2:00 PM", 
      contactPerson: "Agencia Creativa", 
      contactPhone: "+56 9 2222 3333", 
      contactEmail: "contacto@agenciacreativa.cl", 
      duration: "Trabajo por 2 días" 
    },
    { 
      id: 9, 
      title: "Cuidado de Adulto Mayor", 
      description: "Se necesita apoyo para acompañar y asistir a adulto mayor.", 
      location: "Pucón, Chile", 
      salary: "CLP20,000 - CLP25,000 / jornada", 
      icon: "🧓",
      detailedDescription: "Apoyo en actividades básicas como caminar, conversar y preparar una comida ligera. Trabajo en ambiente hogareño y tranquilo.", 
      requirements: ["Paciencia y empatía", "Experiencia previa (deseable)", "Disponibilidad en las tardes"], 
      schedule: "Lunes a Viernes 3:00 PM - 8:00 PM", 
      contactPerson: "Marcela Torres", 
      contactPhone: "+56 9 7890 1234", 
      contactEmail: "marcela.torres@email.com", 
      duration: "1 mes (renovable)" 
    },
    { 
      id: 10, 
      title: "Ayuda en Limpieza", 
      description: "Se busca persona para limpieza general de casa particular.", 
      location: "Lautaro, Chile", 
      salary: "CLP15,000 - CLP20,000 / jornada", 
      icon: "🧹",
      detailedDescription: "Tareas de limpieza general: pisos, baños, cocina y ventanas. No se requiere experiencia avanzada.", 
      requirements: ["Responsabilidad", "Orden y pulcritud", "Disponibilidad por las mañanas"], 
      schedule: "Martes y Jueves 9:00 AM - 1:00 PM", 
      contactPerson: "Paola Ramírez", 
      contactPhone: "+56 9 8765 1111", 
      contactEmail: "paola.ramirez@email.com", 
      duration: "Trabajo semanal" 
    },
    { 
      id: 11, 
      title: "Ayuda en Bodega", 
      description: "Carga y orden de productos en bodega pequeña.", 
      location: "Temuco, Chile", 
      salary: "CLP18,000 - CLP22,000 / jornada", 
      icon: "📦",
      detailedDescription: "Apoyo en recepción, clasificación y organización de cajas en bodega local. Trabajo físico con carga moderada.", 
      requirements: ["Buen estado físico", "Responsabilidad", "Disponibilidad inmediata"], 
      schedule: "Lunes a Viernes 8:00 AM - 5:00 PM", 
      contactPerson: "Distribuidora Araucanía", 
      contactPhone: "+56 9 5555 6666", 
      contactEmail: "contacto@distribuidora.cl", 
      duration: "1 semana con posibilidad de extensión" 
    },
    { 
      id: 12, 
      title: "Ayudante de Cocina", 
      description: "Se busca apoyo en cocina de pequeño local de comida.", 
      location: "Villarrica, Chile", 
      salary: "CLP15,000 - CLP18,000 / jornada", 
      icon: "🍳",
      detailedDescription: "Apoyo en preparación de ingredientes, lavado de utensilios y limpieza de cocina. Ambiente de trabajo dinámico.", 
      requirements: ["Disponibilidad en horario de almuerzo", "Responsabilidad", "Ganas de aprender"], 
      schedule: "Sábado y Domingo 11:00 AM - 4:00 PM", 
      contactPerson: "Comida Rápida Villarrica", 
      contactPhone: "+56 9 4444 9999", 
      contactEmail: "empleos@comidavillarrica.cl", 
      duration: "Trabajo de fin de semana" 
    }
  ]

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    jobType: "",
    salary: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const jobsPerPage = 6

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
    { value: "0-10", label: "CLP0 - CLP10,000" },
    { value: "10-20", label: "CLP10,000 - CLP20,000" },
    { value: "20-30", label: "CLP20,000 - CLP30,000" },
    { value: "30-40", label: "CLP30,000 - CLP40,000" },
    { value: "40-50", label: "CLP40,000 - CLP50,000" },
    { value: "50+", label: "CLP50,000+" }
  ]

  const filteredJobs = jobs.filter(job => {
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
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesJobType &&
      matchesSalary
    )
  })

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
        <section className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
            Explora Oportunidades Laborales
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Encuentra trabajos disponibles en tu ciudad
          </p>
        </section>

        {/* Filtros */}
        <section className="mb-6 sm:mb-8">
          <FilterBar
            onFilter={(newFilters) => {
              setFilters(newFilters)
              setCurrentPage(1)
            }}
            categories={categoryOptions}
            locations={locationOptions}
            jobTypes={jobTypeOptions}
            salaries={salaryOptions}
          />
        </section>

        {/* Grid de trabajos */}
        <section className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm shadow-blue-100 border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:shadow-blue-200 transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                  <div className="text-2xl sm:text-3xl" role="img" aria-label={job.title}>
                    {job.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {job.location}
                </div>

                <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {job.salary}
                </div>

                <button
                  onClick={() => handleJobClick(job)}
                  className="flex items-center justify-between w-full px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  Ver Más
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-1 sm:space-x-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 sm:px-3 py-1 rounded-md border text-xs sm:text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Modal de detalles */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleJobSelect}
      />
    </div>
  )
}
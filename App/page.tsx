"use client";

import React, { useState } from "react";
import {
  Users,
  MapPin,
  Shield,
  Calendar,
  Star,
  Search,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Award,
  Briefcase,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
// import Footer from '../components/Footer';

const JobMatchHome: React.FC = () => {
  // Estado para simular autenticación del usuario
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState({
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    avatar: "JP",
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserMenu(false);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
  };
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Ofertas laborales al instante",
      description:
        "Encuentra oportunidades de trabajo en tiempo real que se adapten a tu perfil profesional y objetivos.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Chatea con tu Match",
      description:
        "Conecta directamente con empleadores interesados en tu perfil para una comunicación más efectiva.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Geolocaliza Trabajos",
      description:
        "Encuentra empleos cerca de tu ubicación o en la zona donde deseas trabajar.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Ofertas seguras y verificadas",
      description:
        "Todas las ofertas pasan por un proceso de verificación para garantizar su autenticidad.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Horarios de trabajo flexibles",
      description:
        "Encuentra trabajos con horarios que se adapten a tu estilo de vida y necesidades.",
    },
    {
      icon: <Star className="w-8 h-8 text-blue-600" />,
      title: "Transparente Feedback",
      description:
        "Recibe retroalimentación clara sobre tu proceso de selección y mejora tu perfil.",
    },
  ];

  const news = [
    {
      title: "Nuevas oportunidades en tecnología",
      description:
        "El sector tech sigue creciendo con más de 500 nuevas ofertas esta semana",
      date: "22 Sep 2024",
      category: "Tecnología",
    },
    {
      title: "Tendencias del trabajo remoto",
      description:
        "El 70% de las empresas ofrecen modalidad híbrida o remota completa",
      date: "20 Sep 2024",
      category: "Tendencias",
    },
    {
      title: "JobMatch supera los 10,000 usuarios",
      description:
        "Celebramos este hito con nuevas funcionalidades para mejorar tu experiencia",
      date: "18 Sep 2024",
      category: "Empresa",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="../public/JobMatch.png"
                alt="JobMatch Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-blue-600">JobMatch</span>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                // Botones para usuario no autenticado
                <>
                  <button
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={handleRegister}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                // Interface para usuario autenticado
                <div className="flex items-center space-x-4">
                  {/* Notificaciones */}
                  <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                  </button>

                  {/* Menú de usuario */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {user.avatar}
                      </div>
                      <span>{user.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Mi Perfil
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          Mis Aplicaciones
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configuración
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Trabaja a tu ritmo,{" "}
                <span className="text-blue-600">gana en tu tiempo</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                JobMatch te conecta con ofertas de trabajo en tiempo real que se
                ajustan a tus habilidades y horarios, transformando la forma en
                que encuentras trabajo.
              </p>
              <button
                onClick={handleRegister}
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors"
              >
                <span>
                  {isLoggedIn ? "Buscar Empleos" : "Explorar trabajos"}
                </span>
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Briefcase className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">5,000+</div>
                    <div className="text-sm">Empleos</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-sm">Usuarios</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm">Éxito</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="text-sm">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir JobMatch?
            </h2>
            <p className="text-lg text-gray-600">
              Descubre las ventajas que nos hacen diferentes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Últimas Noticias
            </h2>
            <p className="text-lg text-gray-600">
              Mantente al día con las tendencias del mercado laboral
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{article.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-600">
              ¿Tienes preguntas? Estamos aquí para ayudarte
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Correo Electrónico
              </h3>
              <p className="text-gray-600">Jobmatchsupport@gmail.com</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Teléfono
              </h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Horarios de Atención
              </h3>
              <p className="text-gray-600">Lun - Vie: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Estás listo para encontrar tu trabajo ideal?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de profesionales que ya encontraron su empleo perfecto
          </p>
          <button
            onClick={!isLoggedIn ? handleRegister : undefined}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            {isLoggedIn ? "Ver Mi Dashboard" : "Registrarse Ahora"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="../public/JobMatch.png"
                  alt="JobMatch Logo"
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">JobMatch</span>
              </div>
              <p className="text-gray-300 mb-4">
                Conectando talento con oportunidades. La plataforma que
                transforma la búsqueda de empleo.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Para Candidatos
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Buscar Empleos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Mi Perfil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Alertas de Empleo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Consejos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Para Empresas
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Publicar Empleos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Buscar Talento
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Planes y Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Recursos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 JobMatch. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Política de Privacidad
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Términos de Servicio
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobMatchHome;

import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center space-x-6">
          <a
            href="/contactanos"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
          >
            Contáctanos
          </a>
          <a
            href="/soporte"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
          >
            Soporte al Cliente
          </a>
          <a
            href="/terminos"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
          >
            Términos y Condiciones
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>

          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

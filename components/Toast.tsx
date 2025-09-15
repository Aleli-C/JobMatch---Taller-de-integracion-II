import React, { useState } from 'react';
import { X } from 'lucide-react';


const eventConfigs = {
  LOGIN: {
    title: 'Inicio de Sesión',
    message: '¡Bienvenido de vuelta! Has iniciado sesión correctamente.'
  },
  REGISTER: {
    title: 'Registro Exitoso',
    message: '¡Felicidades! Tu cuenta ha sido creada exitosamente.'
  },
  SERVICE_SELECTED: {
    title: 'Servicio Seleccionado',
    message: 'Has seleccionado un nuevo servicio correctamente.'
  },
  APPLICATION_SUBMITTED: {
    title: 'Postulación Enviada',
    message: '¡Felicidades! Tu postulación ha sido enviada exitosamente.'
  },
  POST_CREATED: {
    title: 'Publicación Creada',
    message: 'Tu nueva publicación ha sido creada exitosamente.'
  },
  POST_UPDATED: {
    title: 'Publicación Actualizada',
    message: 'Los cambios en tu publicación han sido guardados.'
  },
  PROFILE_UPDATED: {
    title: 'Perfil Actualizado',
    message: 'Tu información de perfil ha sido actualizada correctamente.'
  },
  SUCCESS: {
    title: 'Éxito',
    message: 'Operación completada exitosamente.'
  },
  ERROR: {
    title: 'Error',
    message: 'Ha ocurrido un error. Inténtalo de nuevo.'
  },
  DEFAULT: {
    title: 'Notificación',
    message: 'Tienes una nueva notificación.'
  }
} as const;

export interface Toast {
  id: number;
  type: keyof typeof eventConfigs;
  title?: string;
  message?: string;
  timestamp: Date;
}

export interface AddToastPayload {
  type: keyof typeof eventConfigs;
  title?: string;
  message?: string;
  timestamp: Date;
}

interface ToastCardProps {
  toast: Toast;
  onRemove: (id: number) => void;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: AddToastPayload) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove después de 5 segundos
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

// Componente individual de Toast
export const ToastCard: React.FC<ToastCardProps> = ({ toast, onRemove }) => {
  const config = eventConfigs[toast.type] || eventConfigs.DEFAULT;

  const timeAgo = () => {
    const now = new Date();
    const toastTime = new Date(toast.timestamp);
    const diffInMs = now.getTime() - toastTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes === 1) return '1 min ago';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1h ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return '1d ago';
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-5 mb-4 max-w-md animate-slideInUp hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img 
            src="../public/logo sin fondo.png"
            alt="Logo empresa" 
            className="w-16 h-16 rounded-md object-contain flex-shrink-0" 
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {toast.title || config.title}
              </h3>
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                {timeAgo()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {toast.message || config.message}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Contenedor de Toast
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  if (toasts.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] space-y-4 pointer-events-none">
        <div className="pointer-events-auto">
          {toasts.map(toast => (
            <ToastCard 
              key={toast.id} 
              toast={toast} 
              onRemove={onRemoveToast}
            />
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .animate-slideInUp {
            animation: slideInUp 0.3s ease-out;
          }
        `
      }} />
    </>
  );
};

export default { useToast, ToastCard, ToastContainer };

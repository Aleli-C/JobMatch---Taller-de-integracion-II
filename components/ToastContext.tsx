"use client";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useToast, ToastContainer } from "./Toast";
import type { AddToastPayload } from "./Toast";

// Tipos del contexto
interface ToastContextType {
  addToast: (toast: AddToastPayload) => number;
}

interface ToastProviderProps {
  children: ReactNode;
}

// Crear el contexto
const ToastContext = createContext<ToastContextType | null>(null);

// Hook para usar el contexto
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext debe usarse dentro de ToastProvider');
  }
  return context;
};

// Provider del contexto
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, addToast, removeToast } = useToast();

  const contextValue: ToastContextType = {
    addToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
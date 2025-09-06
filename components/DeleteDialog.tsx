import { FC } from "react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteDialog: FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Eliminar publicación",
  message = "¿Seguro que deseas eliminar esta publicación?",
}) => {
  if (!isOpen) return null; // No renderiza si no está abierto

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-white rounded-lg shadow-lg w-[95vw] max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 mx-2">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#0060c0]">{title}</h2>
        <p className="mb-6 text-gray-800 text-sm sm:text-base">{message}</p>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            className="px-4 py-2 border border-[#0060c0] text-[#0060c0] rounded hover:bg-[#e6f0fa] transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-[#0060c0] text-white rounded hover:bg-[#004a99] transition"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;

import { FC, useState } from "react";

interface TagSelectorProps {
  availableTags: string[];
  onChange?: (tags: string[]) => void;
  onAccept?: (tags: string[]) => void;
}

const TagSelector: FC<TagSelectorProps> = ({ availableTags, onChange, onAccept }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag); // quitar
    } else {
      updatedTags = [...selectedTags, tag]; // agregar
    }
    setSelectedTags(updatedTags);
    if (onChange) {
      onChange(updatedTags); // enviar cambios al padre
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(selectedTags);
    }
  };

  return (
    <div className="p-3 sm:p-4 border rounded-2xl w-full max-w-full sm:max-w-md bg-white shadow-[0_0_8px_0_rgba(0,105,192,0.08)]">
      <h2 className="text-base sm:text-lg font-semibold mb-3">Selecciona los tags:</h2>
      {/* Tags disponibles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableTags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={index}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border transition text-sm sm:text-base ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {/* Tags seleccionados */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium mb-2">Tags seleccionados:</h3>
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm mb-4">No has seleccionado ningún tag.</p>
        )}
        <button
          type="button"
          className="mt-2 bg-[#0069c0] text-white px-4 py-2 rounded-xl text-xs sm:text-sm hover:bg-[#004a99] transition w-full sm:w-auto"
          onClick={handleAccept}
          disabled={selectedTags.length === 0}
        >
          Aceptar selección
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
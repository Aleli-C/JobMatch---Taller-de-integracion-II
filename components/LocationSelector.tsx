import { FC, useState } from "react";

interface LocationSelectorProps {
  availableLocations: string[];
  onChange?: (locations: string[]) => void;
  onAccept?: (locations: string[]) => void;
}

const LocationSelector: FC<LocationSelectorProps> = ({
  availableLocations,
  onChange,
  onAccept,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSelect = (location: string) => {
    const newValue = selectedLocation === location ? null : location;
    setSelectedLocation(newValue);
    if (onChange) {
      onChange(newValue ? [newValue] : []);
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(selectedLocation ? [selectedLocation] : []);
    }
  };

  return (
    <div className="p-3 sm:p-4 border rounded-2xl w-full max-w-full sm:max-w-md bg-white shadow-[0_0_8px_0_rgba(0,105,192,0.08)]">
      <h2 className="text-base sm:text-lg font-semibold mb-3">
        Selecciona la ubicación:
      </h2>
      {/* Ubicaciones disponibles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableLocations.map((location, index) => {
          const isSelected = selectedLocation === location;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(location)}
              className={`px-3 py-1 rounded-full border transition text-xs sm:text-sm md:text-base ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {location}
            </button>
          );
        })}
      </div>
      {/* Ubicación seleccionada */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium mb-2">
          Ubicación seleccionada:
        </h3>
        {selectedLocation ? (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs sm:text-sm">
              {selectedLocation}
            </span>
          </div>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm mb-4">
            No has seleccionado ninguna ubicación.
          </p>
        )}
        <button
          type="button"
          className="mt-2 bg-[#0069c0] text-white px-4 py-2 rounded-xl text-xs sm:text-sm hover:bg-[#004a99] transition w-full sm:w-auto"
          onClick={handleAccept}
          disabled={!selectedLocation}
        >
          Aceptar selección
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;
import { FC, useState } from "react";
import { Briefcase, MapPin, DollarSign } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  onFilter: (filters: {
    search: string;
    category: string;
    location: string;
    jobType: string;
    salary: string;
  }) => void;
  categories: FilterOption[];
  locations: FilterOption[];
  jobTypes: FilterOption[];
  salaries: FilterOption[];
}

const FilterBar: FC<FilterBarProps> = ({
  onFilter,
  categories,
  locations,
  jobTypes,
  salaries,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search, category, location, jobType, salary });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setJobType("");
    setSalary("");
    onFilter({ search: "", category: "", location: "", jobType: "", salary: "" });
  };

  return (
    <form
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 shadow-blue-200"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categoría */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 mr-2" />
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((option) => (
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {locations.map((option) => (
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
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {jobTypes.map((option) => (
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
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {salaries.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Búsqueda y botones */}
      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Filtrar por palabra clave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#0069c0] text-white px-4 py-2 rounded-md text-sm hover:bg-[#004a99] transition"
          >
            Filtrar
          </button>
          <button
            type="button"
            className="text-[#0069c0] px-4 py-2 rounded-md text-sm hover:underline bg-gray-50 border border-gray-200"
            onClick={handleReset}
          >
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
};

export default FilterBar;
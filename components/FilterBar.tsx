import { FC, useState } from "react";

interface FilterBarProps {
  onFilter: (filters: {
    search: string;
    category: string;
    location: string;
    minSalary: string;
    maxSalary: string;
  }) => void;
  categories?: string[];
  locations?: string[];
}

const FilterBar: FC<FilterBarProps> = ({
  onFilter,
  categories = [],
  locations = [],
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search, category, location, minSalary, maxSalary });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    onFilter({ search: "", category: "", location: "", minSalary: "", maxSalary: "" });
  };

  return (
    <form
      className="flex flex-col sm:flex-row flex-wrap gap-2 items-left bg-white p-3 px-2 rounded-2xl mb-4 shadow-[0_0_8px_0_rgba(0,105,192,0.08)]"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="border border-blue-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-[#0069c0] shadow-[0_0_2px_0_#0069c0] flex-1 min-w-[140px]"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-[#0069c0] shadow-[0_0_2px_0_#0069c0] bg-gray-50 flex-1 min-w-[120px]"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" className="text-black">Categoría</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="text-black">{cat}</option>
        ))}
      </select>
      <select
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-[#0069c0] shadow-[0_0_2px_0_#0069c0] bg-gray-50 flex-1 min-w-[120px]"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="" className="text-black">Ubicación</option>
        {locations.map((loc) => (
          <option key={loc} value={loc} className="text-black">{loc}</option>
        ))}
      </select>
      <input
        type="number"
        className="border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm text-black focus:outline-none focus:border-[#0069c0] shadow-[0_0_2px_0_#0069c0] bg-gray-50"
        placeholder="Mín $"
        value={minSalary}
        onChange={(e) => setMinSalary(e.target.value)}
        min={0}
      />
      <input
        type="number"
        className="border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm text-black focus:outline-none focus:border-[#0069c0] shadow-[0_0_2px_0_#0069c0] bg-gray-50"
        placeholder="Máx $"
        value={maxSalary}
        onChange={(e) => setMaxSalary(e.target.value)}
        min={0}
      />
      <button
        type="submit"
        className="bg-[#0069c0] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#004a99] transition min-w-[90px]"
      >
        Filtrar
      </button>
      <button
        type="button"
        className="text-[#0069c0] px-4 py-2 rounded-xl text-sm hover:underline shadow-[0_0_2px_0_#0069c0] bg-gray-50 min-w-[90px]"
        onClick={handleReset}
      >
        Limpiar
      </button>
    </form>
  );
};

export default FilterBar;
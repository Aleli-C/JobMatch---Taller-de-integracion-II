
"use client";
import { FC, useState } from "react";
import { Briefcase, MapPin, DollarSign } from "lucide-react";

interface FilterOption { value: string; label: string; }
interface FilterBarProps {
  onFilter: (filters: {
    search: string; category: string; location: string; jobType: string; salary: string;
  }) => void;
  categories: { value: string; label: string }[];
  locations:  { value: string; label: string }[];
  jobTypes:   { value: string; label: string }[];
  salaries:   { value: string; label: string }[];
  // ✅ nuevo
  defaults?: { search?: string; category?: string; location?: string; jobType?: string; salary?: string };
}

const FilterBar: FC<FilterBarProps> = ({
  onFilter, categories, locations, jobTypes, salaries, defaults
}) => {
  const [search, setSearch]     = useState(defaults?.search ?? "");
  const [category, setCategory] = useState(defaults?.category ?? "");
  const [location, setLocation] = useState(defaults?.location ?? "");
  const [jobType, setJobType]   = useState(defaults?.jobType ?? "");
  const [salary, setSalary]     = useState(defaults?.salary ?? "");

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onFilter({ search, category, location, jobType, salary }); };
  const handleReset = () => { setSearch(""); setCategory(""); setLocation(""); setJobType(""); setSalary(""); onFilter({ search: "", category: "", location: "", jobType: "", salary: "" }); };

  return (
    <form className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 shadow-blue-200" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700"><Briefcase className="w-4 h-4 mr-2" />Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {categories.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700"><MapPin className="w-4 h-4 mr-2" />Ubicación</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {locations.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700"><Briefcase className="w-4 h-4 mr-2" />Tipo de Empleo</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {jobTypes.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700"><DollarSign className="w-4 h-4 mr-2" />Salario</label>
          <select value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {salaries.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <input type="text" placeholder="Filtrar por palabra clave..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <div className="flex gap-2">
          <button type="submit" className="bg-[#0069c0] text-white px-4 py-2 rounded-md text-sm hover:bg-[#004a99] transition">Filtrar</button>
          <button type="button" onClick={handleReset} className="text-[#0069c0] px-4 py-2 rounded-md text-sm hover:underline bg-gray-50 border border-gray-200">Limpiar</button>
        </div>
      </div>
    </form>
  );
};
export default FilterBar;


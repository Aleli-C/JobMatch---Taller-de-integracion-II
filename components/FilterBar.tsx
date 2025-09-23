"use client";
import { FC, useRef } from "react";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface Option { value: string; label: string }
export interface FilterBarProps {
  categories: Option[];
  locations:  Option[];
  jobTypes:   Option[];
  salaries:   Option[];
  // ✅ opcional
  onFilter?: (f: { search: string; category: string; location: string; jobType: string; salary: string }) => void;
  // ✅ soporta valores iniciales
  defaults?: { search?: string; category?: string; location?: string; jobType?: string; salary?: string };
}

const FilterBar: FC<FilterBarProps> = ({ categories, locations, jobTypes, salaries, defaults }) => {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = () => { formRef.current?.reset(); router.push(pathname); };

  return (
    <form ref={formRef} method="GET" action={pathname}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 shadow-blue-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 mr-2" />Categoría
          </label>
          <select name="category" defaultValue={defaults?.category ?? ""} className="w-full px-3 py-2 border rounded-md">
            {categories.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-2" />Ubicación
          </label>
          <select name="location" defaultValue={defaults?.location ?? ""} className="w-full px-3 py-2 border rounded-md">
            {locations.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 mr-2" />Tipo de Empleo
          </label>
          <select name="jobType" defaultValue={defaults?.jobType ?? ""} className="w-full px-3 py-2 border rounded-md">
            {jobTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <DollarSign className="w-4 h-4 mr-2" />Salario
          </label>
          <select name="salary" defaultValue={defaults?.salary ?? ""} className="w-full px-3 py-2 border rounded-md">
            {salaries.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <input
          type="text" name="search" placeholder="Filtrar por palabra clave..."
          defaultValue={defaults?.search ?? ""} className="w-full px-4 py-2 border rounded-md"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-[#0069c0] text-white px-4 py-2 rounded-md text-sm hover:bg-[#004a99]">Filtrar</button>
          <button type="button" onClick={handleReset}
                  className="text-[#0069c0] px-4 py-2 rounded-md text-sm hover:underline bg-gray-50 border">
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
};
export default FilterBar;

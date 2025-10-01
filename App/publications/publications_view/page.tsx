// app/publicaciones/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublicationCard from "@/components/PublicationCard";
import FilterBar from "@/components/FilterBar";

type SearchParams = Record<string, string | string[] | undefined>;

function clp(v: any) {
  const n = typeof v?.toNumber === "function" ? v.toNumber() : Number(v);
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  // 1) Datos desde Prisma
  const pubs = await prisma.publicacion.findMany({
    orderBy: { fechaPublicacion: "desc" },
    include: {
      categoria: { select: { nombre: true, icono: true } },
      ubicacion: { select: { ciudad: true, region: true } },
      usuario:   { select: { id: true, nombre: true, tipoUsuario: true } },
    },
  });

  // 2) Normalización (server)
  const items = pubs.map((p) => {
    const salaryValue =
      typeof (p as any).remuneracion?.toNumber === "function"
        ? (p as any).remuneracion.toNumber()
        : Number((p as any).remuneracion ?? 0);

    const location = p.ubicacion?.ciudad
      ? `${p.ubicacion.ciudad}${p.ubicacion?.region ? `, ${p.ubicacion.region}` : ""}`
      : undefined;

    return {
      id: p.id,
      title: p.titulo,
      description: p.descripcion ?? "",
      icon: p.categoria?.icono ?? (p.tipo === "FREELANCE" ? "🧰" : "🧑‍💼"),
      category: p.categoria?.nombre ?? "",
      location: location ?? "",
      salaryCLP: salaryValue ? clp(salaryValue) : undefined,
      salaryValue,
      jobType: p.tipo ?? "",
      usuario: p.usuario
        ? { nombre: p.usuario.nombre, tipoUsuario: p.usuario.tipoUsuario }
        : undefined,
    };

  });

  // 3) Opciones para filtros
  const opt = <T extends string>(arr: T[]) =>
    [{ value: "", label: "Todas" }, ...Array.from(new Set(arr.filter(Boolean))).map(v => ({ value: v, label: v }))];

  const categories = opt(items.map(i => i.category));
  const locations  = opt(items.map(i => i.location));
  const jobTypes   = [{ value: "", label: "Todos" }, ...Array.from(new Set(items.map(i => i.jobType).filter(Boolean))).map(v => ({ value: v, label: v }))];
  const salaries   = [
    { value: "", label: "Cualquiera" },
    { value: "0-300000", label: "≤ $300.000" },
    { value: "300000-700000", label: "$300.000 – $700.000" },
    { value: "700000-1200000", label: "$700.000 – $1.200.000" },
    { value: "1200000+", label: "≥ $1.200.000" },
  ];

  // 4) Lee filtros desde searchParams (GET)
  const sp = {
    search:   String(searchParams.search ?? ""),
    category: String(searchParams.category ?? ""),
    location: String(searchParams.location ?? ""),
    jobType:  String(searchParams.jobType ?? ""),
    salary:   String(searchParams.salary ?? ""),
  };

  // 5) Filtrado en servidor
  const filtered = items.filter(i => {
    const q = sp.search.toLowerCase();
    const okQ = !q || i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    const okCat = !sp.category || i.category === sp.category;
    const okLoc = !sp.location || i.location === sp.location;
    const okType = !sp.jobType || i.jobType === sp.jobType;
    const okSalary = (() => {
      if (!sp.salary || !i.salaryValue) return true;
      if (sp.salary.endsWith("+")) return i.salaryValue >= Number(sp.salary.replace("+",""));
      const [minS, maxS] = sp.salary.split("-").map(Number);
      return i.salaryValue >= (minS ?? 0) && i.salaryValue <= (maxS ?? Infinity);
    })();
    return okQ && okCat && okLoc && okType && okSalary;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      <section className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
            Explora Oportunidades Laborales
          </h1>
          <p className="text-gray-600">Encuentra trabajos disponibles en tu ciudad</p>
      </section>
      
      <FilterBar
        categories={categories}
        locations={locations}
        jobTypes={jobTypes}
        salaries={salaries}
        defaults={sp}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <PublicationCard
            key={p.id}
            title={p.title}
            description={p.description}
            icon={p.icon}
            location={p.location || undefined}
            salary={p.salaryCLP}
            jobType={p.jobType}
            category={p.category}
            author={p.usuario}
          />
        ))}

        {!filtered.length && (
          <div className="col-span-full text-gray-500">
            No hay publicaciones{sp.search ? " para los filtros aplicados" : ""}.
          </div>
        )}
      </section>
    </main>
  );
}

import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Car, MapPin, Ruler } from "lucide-react";
import type { properties } from "@/data/properties";

type Property = (typeof properties)[number];

export default function PropertyCard({ property }: { property: Property }) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link href={`/imoveis/${property.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E2DC] bg-white transition duration-300 hover:border-[#C89B5A]/40 hover:shadow-[0_8px_24px_rgba(19,34,56,0.05)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ECE9E2]">
        <img src={`${property.image}?auto=format&fit=crop&w=800&q=85`} alt={property.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 motion-safe:group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-md bg-[#132238]/95 px-3 py-2 text-xs font-medium tracking-wide text-white">{property.type}</span>
        <span aria-hidden="true" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#132238]"><ArrowUpRight size={17} /></span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        <p className="text-[22px] font-semibold tracking-tight text-[#132238]">
          {formattedPrice}
          {property.type === "Aluguel" && <span className="text-sm font-normal text-[#666]"> /mês</span>}
        </p>
        <h3 className="mt-3 text-[17px] font-semibold leading-relaxed text-[#132238]">{property.title}</h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm leading-6 text-[#666]"><MapPin size={14} aria-hidden="true" className="mt-1 shrink-0 text-[#A77638]" />{property.neighborhood} · {property.city}, {property.state}</p>
        <div className="mb-4 mt-6 grid grid-cols-4 gap-2 border-y border-[#EEECE6] py-4 text-sm text-[#666]">
          <span aria-label={`${property.area} metros quadrados`} className="flex items-center gap-1.5"><Ruler size={16} aria-hidden="true" />{property.area} m²</span>
          <span aria-label={`${property.bedrooms} quartos`} className="flex items-center justify-center gap-1.5"><BedDouble size={16} aria-hidden="true" />{property.bedrooms}</span>
          <span aria-label={`${property.bathrooms} banheiros`} className="flex items-center justify-center gap-1.5"><Bath size={16} aria-hidden="true" />{property.bathrooms}</span>
          <span aria-label={`${property.parking} vagas`} className="flex items-center justify-end gap-1.5"><Car size={16} aria-hidden="true" />{property.parking}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-[#132238]">{property.agent.name}<span className="mt-0.5 block text-xs font-normal text-[#777]">{property.agent.creci}</span></span>
          <span aria-hidden="true" className="text-[#A77638]"><ArrowUpRight size={19} /></span>
        </div>
      </div>
    </Link>
  );
}

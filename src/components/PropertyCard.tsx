import Link from "next/link";
import { Bath, BedDouble, Car, Heart, Ruler } from "lucide-react";

export default function PropertyCard({ property }: { property: any }) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link href={`/imoveis/${property.slug}`} className="group overflow-hidden rounded-xl border border-[#E8E8E5] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img src={`${property.image}?auto=format&fit=crop&w=800&q=80`} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-4 top-4 rounded-full bg-[#1D3557] px-3 py-1.5 text-xs font-semibold text-white">{property.type}</span>
        <button type="button" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white"><Heart size={18} /></button>
      </div>
      <div className="p-5">
        <p className="text-xl font-bold">
          {formattedPrice}
          {property.type === "Aluguel" && <span className="text-sm font-normal text-[#666]"> /mês</span>}
        </p>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{property.title}</h3>
        <p className="mt-2 text-sm text-[#666]">{property.neighborhood} · {property.city}, {property.state}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#666]">
          <span className="flex items-center gap-1.5"><Ruler size={16} />{property.area} m²</span>
          <span className="flex items-center gap-1.5"><BedDouble size={16} />{property.bedrooms}</span>
          <span className="flex items-center gap-1.5"><Bath size={16} />{property.bathrooms}</span>
          <span className="flex items-center gap-1.5"><Car size={16} />{property.parking}</span>
        </div>
        <div className="mt-5 border-t border-[#E8E8E5] pt-4 text-sm text-[#666]">
          {property.agent.name} · {property.agent.creci}
        </div>
      </div>
    </Link>
  );
}

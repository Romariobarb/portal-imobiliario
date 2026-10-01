import Header from "@/components/Header";
import { properties } from "@/data/properties";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Car,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  Ruler,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;

  const property = properties.find((item) => item.slug === slug);

  if (!property) {
    notFound();
  }

  const galleryImages = [
    property.image,
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90",
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F8F6]">
        <section className="border-b border-[#E8E8E5] bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/imoveis"
                className="flex items-center gap-2 text-sm font-medium text-[#666] transition hover:text-[#132238]"
              >
                <ArrowLeft size={17} />
                Voltar para imóveis
              </Link>

              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E5] bg-white">
                  <Share2 size={17} />
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E5] bg-white">
                  <Heart size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1280px] px-6 pb-9 pt-7">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-[#1D3557] px-3 py-1.5 text-xs font-semibold text-white">
                    {property.type}
                  </span>

                  <span className="text-sm text-[#777]">
                    Cód. {property.id}
                  </span>
                </div>

                <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.03em] text-[#132238] md:text-5xl">
                  {property.title}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-[#666]">
                  <MapPin size={18} />
                  <span>
                    {property.neighborhood}, {property.city} - {property.state}
                  </span>
                </div>
              </div>

              <div className="lg:text-right">
                <p className="text-sm text-[#777]">
                  {property.type === "Aluguel" ? "Valor mensal" : "Valor do imóvel"}
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-[#132238]">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1280px] gap-3 px-6 pb-12 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-xl">
              <img
                src={galleryImages[0]}
                alt={property.title}
                className="h-[360px] w-full object-cover md:h-[560px]"
              />
            </div>

            <div className="hidden gap-3 lg:grid">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={galleryImages[1]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={galleryImages[2]}
                  alt=""
                  className="h-full w-full object-cover"
                />

                <button className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#132238] shadow-sm">
                  Ver todas as fotos
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div>
            <div className="grid grid-cols-2 gap-3 border-b border-[#E3E3DF] pb-10 md:grid-cols-4">
              <PropertyFeature
                icon={<Ruler size={21} />}
                value={`${property.area} m²`}
                label="Área"
              />

              <PropertyFeature
                icon={<BedDouble size={21} />}
                value={`${property.bedrooms}`}
                label="Quartos"
              />

              <PropertyFeature
                icon={<Bath size={21} />}
                value={`${property.bathrooms}`}
                label="Banheiros"
              />

              <PropertyFeature
                icon={<Car size={21} />}
                value={`${property.parking}`}
                label="Vagas"
              />
            </div>

            <div className="border-b border-[#E3E3DF] py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C89B5A]">
                Sobre o imóvel
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132238]">
                Arquitetura, conforto e localização em uma experiência única.
              </h2>

              <div className="mt-6 max-w-3xl space-y-4 text-[16px] leading-8 text-[#666]">
                <p>
                  Um imóvel pensado para quem busca qualidade de vida sem abrir mão
                  de sofisticação, conforto e funcionalidade.
                </p>

                <p>
                  Os ambientes foram distribuídos para privilegiar iluminação
                  natural, integração e uma experiência de moradia contemporânea.
                </p>
              </div>
            </div>

            <div className="py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C89B5A]">
                Diferenciais
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  "Acabamentos selecionados",
                  "Excelente iluminação natural",
                  "Ambientes integrados",
                  "Localização privilegiada",
                  "Planta funcional",
                  "Região valorizada",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check size={16} className="text-[#C89B5A]" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-xl border border-[#E3E3DF] bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C89B5A]">
                Corretor responsável
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#132238] text-white">
                  <Building2 size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#132238]">
                    {property.agent.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#777]">
                    {property.agent.creci}
                  </p>
                </div>
              </div>

              <form className="mt-7 space-y-3">
                <input
                  placeholder="Seu nome"
                  className="h-12 w-full rounded-lg border border-[#E3E3DF] px-4"
                />

                <input
                  placeholder="Telefone / WhatsApp"
                  className="h-12 w-full rounded-lg border border-[#E3E3DF] px-4"
                />

                <textarea
                  rows={4}
                  defaultValue={`Olá! Tenho interesse no imóvel "${property.title}".`}
                  className="w-full rounded-lg border border-[#E3E3DF] px-4 py-3"
                />

                <button
                  type="button"
                  className="w-full rounded-lg bg-[#1D3557] px-5 py-3.5 font-semibold text-white"
                >
                  Solicitar contato
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1D3557] px-5 py-3.5 font-semibold text-[#1D3557]"
                >
                  <MessageCircle size={18} />
                  Falar pelo WhatsApp
                </button>
              </form>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

function PropertyFeature({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="mb-3 text-[#1D3557]">{icon}</div>
      <p className="text-lg font-semibold text-[#132238]">{value}</p>
      <p className="mt-1 text-sm text-[#777]">{label}</p>
    </div>
  );
}
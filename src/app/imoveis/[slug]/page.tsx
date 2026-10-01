import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
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

  const similarProperties = properties
    .filter((item) => item.slug !== property.slug)
    .slice(0, 3);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F8F6]">
        {/* NAVEGAÇÃO SUPERIOR */}
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
                <button
                  type="button"
                  aria-label="Compartilhar imóvel"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E5] bg-white transition hover:border-[#C89B5A]"
                >
                  <Share2 size={17} />
                </button>

                <button
                  type="button"
                  aria-label="Favoritar imóvel"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E5] bg-white transition hover:border-[#C89B5A]"
                >
                  <Heart size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CABEÇALHO DO IMÓVEL */}
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
                  {property.type === "Aluguel"
                    ? "Valor mensal"
                    : "Valor do imóvel"}
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-[#132238] md:text-4xl">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1280px] gap-3 px-6 pb-12 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={galleryImages[0]}
                alt={property.title}
                className="h-[360px] w-full object-cover transition duration-500 hover:scale-[1.01] md:h-[560px]"
              />
            </div>

            <div className="hidden gap-3 lg:grid">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={galleryImages[1]}
                  alt={`Interior de ${property.title}`}
                  className="h-full min-h-0 w-full object-cover"
                />
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={galleryImages[2]}
                  alt={`Detalhes de ${property.title}`}
                  className="h-full min-h-0 w-full object-cover"
                />

                <button
                  type="button"
                  className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#132238] shadow-sm"
                >
                  Ver todas as fotos
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTEÚDO */}
        <section className="mx-auto grid max-w-[1280px] gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div>
            {/* CARACTERÍSTICAS */}
            <div className="grid grid-cols-2 gap-4 border-b border-[#E3E3DF] pb-10 md:grid-cols-4">
              <PropertyFeature
                icon={<Ruler size={21} />}
                value={`${property.area} m²`}
                label="Área privativa"
              />

              <PropertyFeature
                icon={<BedDouble size={21} />}
                value={`${property.bedrooms}`}
                label="Dormitórios"
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

            {/* SOBRE */}
            <div className="border-b border-[#E3E3DF] py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B5A]">
                Sobre o imóvel
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.02em] text-[#132238] md:text-4xl">
                Um imóvel pensado para quem valoriza arquitetura, conforto e qualidade de vida.
              </h2>

              <div className="mt-7 max-w-3xl space-y-5 text-[16px] leading-8 text-[#666]">
                <p>
                  Este imóvel combina ambientes amplos, iluminação natural e uma
                  distribuição inteligente dos espaços, criando uma experiência
                  de moradia elegante e funcional.
                </p>

                <p>
                  Cada ambiente foi pensado para oferecer conforto no dia a dia,
                  integração entre áreas sociais e uma atmosfera contemporânea.
                </p>

                <p>
                  Localizado em {property.neighborhood}, uma região valorizada de{" "}
                  {property.city}, o imóvel está próximo de serviços, comércio e
                  conveniências importantes.
                </p>
              </div>
            </div>

            {/* DIFERENCIAIS */}
            <div className="border-b border-[#E3E3DF] py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B5A]">
                Diferenciais
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[#132238]">
                Detalhes que fazem diferença no dia a dia.
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  "Acabamentos selecionados",
                  "Excelente iluminação natural",
                  "Ambientes integrados",
                  "Localização privilegiada",
                  "Planta funcional",
                  "Região valorizada",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-4 rounded-xl border border-[#ECECE8] bg-white p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1EEE8] text-[#A77638]">
                      <Check size={16} />
                    </span>

                    <span className="text-[15px] font-medium text-[#444]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B5A]">
                Localização
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[#132238]">
                {property.neighborhood}, {property.city}
              </h2>

              <p className="mt-3 max-w-2xl text-[#666]">
                Uma localização estratégica para quem busca praticidade,
                valorização e qualidade de vida.
              </p>

              <div className="mt-7 flex h-[320px] items-center justify-center rounded-2xl border border-[#E3E3DF] bg-[#ECEDE9]">
                <div className="text-center">
                  <MapPin
                    size={30}
                    className="mx-auto mb-3 text-[#1D3557]"
                  />

                  <p className="font-medium text-[#132238]">
                    Mapa da localização
                  </p>

                  <p className="mt-1 text-sm text-[#777]">
                    Google Maps será integrado nesta etapa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CORRETOR */}
          <aside>
            <div className="sticky top-28 overflow-hidden rounded-2xl border border-[#E3E3DF] bg-white shadow-[0_16px_50px_rgba(19,34,56,0.08)]">
              <div className="bg-[#132238] px-7 py-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D9B77A]">
                  Atendimento exclusivo
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  Fale com o corretor responsável
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Tire dúvidas, solicite informações ou agende uma visita.
                </p>
              </div>

              <div className="p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEE8] text-[#132238]">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#132238]">
                      {property.agent.name}
                    </h4>

                    <p className="mt-1 text-sm text-[#777]">
                      {property.agent.creci}
                    </p>
                  </div>
                </div>

                <div className="my-7 h-px bg-[#ECECE8]" />

                <form className="space-y-3">
                  <input
                    placeholder="Seu nome"
                    className="h-12 w-full rounded-lg border border-[#E3E3DF] px-4 text-sm outline-none transition focus:border-[#1D3557]"
                  />

                  <input
                    type="tel"
                    placeholder="Telefone / WhatsApp"
                    className="h-12 w-full rounded-lg border border-[#E3E3DF] px-4 text-sm outline-none transition focus:border-[#1D3557]"
                  />

                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="h-12 w-full rounded-lg border border-[#E3E3DF] px-4 text-sm outline-none transition focus:border-[#1D3557]"
                  />

                  <textarea
                    rows={4}
                    defaultValue={`Olá! Tenho interesse no imóvel "${property.title}".`}
                    className="w-full resize-none rounded-lg border border-[#E3E3DF] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1D3557]"
                  />

                  <button
                    type="button"
                    className="w-full rounded-lg bg-[#1D3557] px-5 py-3.5 font-semibold text-white transition hover:bg-[#132238]"
                  >
                    Solicitar contato
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1D3557] px-5 py-3.5 font-semibold text-[#1D3557] transition hover:bg-[#F7F7F4]"
                  >
                    <MessageCircle size={18} />
                    Falar pelo WhatsApp
                  </button>
                </form>

                <p className="mt-5 text-center text-xs leading-5 text-[#999]">
                  Seus dados serão enviados apenas ao corretor responsável por
                  este imóvel.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* IMÓVEIS SEMELHANTES */}
        {similarProperties.length > 0 && (
          <section className="border-t border-[#E3E3DF] bg-white">
            <div className="mx-auto max-w-[1280px] px-6 py-16">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B5A]">
                    Você também pode gostar
                  </p>

                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[#132238] md:text-4xl">
                    Imóveis semelhantes
                  </h2>
                </div>

                <Link
                  href="/imoveis"
                  className="text-sm font-semibold text-[#1D3557] transition hover:text-[#132238]"
                >
                  Ver todos os imóveis →
                </Link>
              </div>

              <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {similarProperties.map((item) => (
                  <PropertyCard key={item.id} property={item} />
                ))}
              </div>
            </div>
          </section>
        )}
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
    <div className="rounded-xl border border-[#ECECE8] bg-white p-5 transition hover:border-[#D9D2C6]">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EEE8] text-[#1D3557]">
        {icon}
      </div>

      <p className="text-xl font-semibold text-[#132238]">{value}</p>

      <p className="mt-1 text-sm text-[#777]">{label}</p>
    </div>
  );
}
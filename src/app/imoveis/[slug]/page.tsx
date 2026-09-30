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
        {/* TOPO */}
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
                  aria-label="Compartilhar imóvel"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E5] bg-white transition hover:border-[#C89B5A]"
                >
                  <Share2 size={17} />
                </button>

                <button
                  aria-label="Favoritar imóvel"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E5] bg-white transition hover:border-[#C89B5A]"
                >
                  <Heart size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TÍTULO */}
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

                <p className="mt-1 text-3xl font-semibold tracking-tight text-[#132238]">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1280px] gap-3 px-6 pb-12 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-xl">
              <img
                src={galleryImages[0]}
                alt={property.title}
                className="h-[360px] w-full object-cover transition duration-500 hover:scale-[1.01] md:h-[560px]"
              />
            </div>

            <div className="hidden gap-3 lg:grid">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={galleryImages[1]}
                  alt={`Interior de ${property.title}`}
                  className="h-full min-h-0 w-full object-cover"
                />
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={galleryImages[2]}
                  alt={`Detalhes de ${property.title}`}
                  className="h-full min-h-0 w-full object-cover"
                />

                <button className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#132238] shadow-sm">
                  Ver todas as fotos
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTEÚDO */}
        <section className="mx-auto grid max-w-[1280px] gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div>
            {/* ATRIBUTOS */}
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

            {/* SOBRE */}
            <div className="border-b border-[#E3E3DF] py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C89B5A]">
                Sobre o imóvel
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132238]">
                Arquitetura, conforto e localização em uma experiência única.
              </h2>

              <div className="mt-6 max-w-3xl space-y-4 text-[16px] leading-8 text-[#666]">
                <p>
                  Um imóvel pensado para quem busca qualidade de vida sem abrir
                  mão de sofisticação, conforto e funcionalidade.
                </p>

                <p>
                  Os ambientes foram distribuídos para privilegiar iluminação
                  natural, integração e uma experiência de moradia
                  contemporânea.
                </p>

                <p>
                  Localizado em {property.neighborhood}, uma das regiões mais
                  procuradas de {property.city}, oferece acesso estratégico aos
                  principais serviços, comércio e conveniências da cidade.
                </p>
              </div>
            </div>

            {/* DIFERENCIAIS */}
            <div className="border-b border-[#E3E3DF] py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C89B5A]">
                Diferenciais
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132238]">
                Detalhes que elevam a experiência.
              </h2>

              <div className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
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
                    className="flex items-center gap-3 text-[#444]"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEE9DF] text-[#A77638]">
                      <Check size={15} />
                    </span>

                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C89B5A]">
                Localização
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132238]">
                {property.neighborhood}, {property.city}
              </h2>

              <div className="mt-7 flex h-[320px] items-center justify-center rounded-xl border border-[#E3E3DF] bg-[#ECEDE9]">
                <div className="text-center">
                  <MapPin
                    size={28}
                    className="mx-auto mb-3 text-[#1D3557]"
                  />
                  <p className="font-medium text-[#132238]">
                    Mapa da localização
                  </p>
                  <p className="mt-1 text-sm text-[#777]">
                    Integraremos Google Maps nesta etapa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD DO CORRETOR */}
          <aside>
            <div className="sticky top-28 rounded-xl border border-[#E3E3DF] bg-white p-7 shadow-[0_10px_40px_rgba(19,34,56,0.05)]">
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

              <div className="my-7 h-px bg-[#ECECE8]" />

              <h3 className="text-xl font-semibold text-[#132238]">
                Interesse neste imóvel?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#777]">
                Envie uma mensagem para receber mais informações ou agendar uma
                visita.
              </p>

              <form className="mt-6 space-y-3">
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
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-[#1D3557] px-5 py-3.5 font-semibold text-white transition hover:bg-[#132238]"
                >
                  Solicitar contato
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1D3557] px-5 py-3.5 font-semibold text-[#1D3557] transition hover:bg-[#F5F6F4]"
                >
                  <MessageCircle size={18} />
                  Falar pelo WhatsApp
                </button>
              </form>

              <p className="mt-5 text-center text-xs leading-5 text-[#999]">
                Ao enviar, você concorda em ser contatado pelo corretor
                responsável pelo imóvel.
              </p>
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
    <div className="rounded-lg bg-white p-4 md:bg-transparent md:p-0">
      <div className="mb-3 text-[#1D3557]">{icon}</div>
      <p className="text-lg font-semibold text-[#132238]">{value}</p>
      <p className="mt-1 text-sm text-[#777]">{label}</p>
    </div>
  );
}
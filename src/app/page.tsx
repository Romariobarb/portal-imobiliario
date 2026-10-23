import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import {
  ArrowRight,
  Building2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />

      <main className="overflow-hidden bg-[#F8F8F6]">
        {/* HERO */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-10 sm:px-8 md:pb-16 md:pt-14">
            <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
              {/* ESQUERDA */}
              <div className="relative min-w-0">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#C89B5A]" />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A77638]">
                    Curadoria imobiliária
                  </p>
                </div>

                <h1 className="mt-6 max-w-[540px] text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.12] tracking-[-0.045em] text-[#132238]">
                  O imóvel certo muda mais do que o seu endereço.
                </h1>

                <p className="mt-5 max-w-[440px] text-[17px] leading-8 text-[#666] md:text-lg">
                  Descubra imóveis selecionados e conecte-se diretamente com
                  profissionais do mercado imobiliário.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#666]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-[#C89B5A]" />
                    Corretores profissionais
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 size={17} className="text-[#C89B5A]" />
                    Imóveis selecionados
                  </div>
                </div>
              </div>

              {/* DIREITA */}
              <div className="relative">
                <div className="absolute -right-20 -top-20 hidden h-56 w-56 rounded-full border border-[#EAE6DE] lg:block" />

                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90"
                    alt="Residência contemporânea"
                    fetchPriority="high"
                    className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[560px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-xl border border-white/20 bg-white/95 p-5 backdrop-blur-sm md:bottom-7 md:left-7 md:right-auto md:max-w-[360px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A77638]">
                        Novas oportunidades
                      </p>

                      <p className="mt-2 max-w-[220px] text-lg font-semibold leading-6 text-[#132238]">
                        Descubra imóveis que acabaram de chegar.
                      </p>
                    </div>

                    <Link
                      href="/imoveis"
                      aria-label="Ver imóveis"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#132238] text-white transition hover:bg-[#1D3557]"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>

                <div className="absolute -bottom-4 right-6 hidden rounded-xl border border-[#E6E3DB] bg-[#F4F0E8] px-5 py-4 lg:block">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8B7351]">
                    Seleção
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#132238]">
                    Imóveis com presença
                  </p>
                </div>
              </div>
            </div>
            {/* BUSCA */}
            <div className="mt-6 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] p-4 shadow-[0_12px_32px_rgba(19,34,56,0.04)] sm:p-6 lg:mt-8">
              <div className="mb-3 flex items-center gap-1 border-b border-[#ECECE8] px-1 pb-3">
                <Link
                  href="/imoveis?tipo=compra"
                  className="rounded-lg bg-[#132238] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Comprar
                </Link>

                <Link
                  href="/imoveis?tipo=aluguel"
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-[#666] transition hover:bg-[#F5F5F2] hover:text-[#132238]"
                >
                  Alugar
                </Link>
              </div>

              <form
                action="/imoveis"
                method="GET"
                className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_auto]"
              >
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
                  />

                  <input
                    name="cidade"
                    aria-label="Cidade, bairro ou condomínio"
                    placeholder="Cidade, bairro ou condomínio"
                    className="h-14 w-full rounded-lg border border-[#E6E6E2] bg-[#FAFAF8] pl-11 pr-4 text-sm text-[#171717] outline-none transition placeholder:text-[#999] focus:border-[#1D3557] focus:bg-white"
                  />
                </div>

                <select
                  name="categoria"
                  aria-label="Tipo de imóvel"
                  className="h-14 rounded-lg border border-[#E6E6E2] bg-[#FAFAF8] px-4 text-sm text-[#444] outline-none transition focus:border-[#1D3557] focus:bg-white"
                >
                  <option value="">Tipo de imóvel</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                </select>

                <button
                  type="submit"
                  className="flex h-14 items-center justify-center gap-2 rounded-lg bg-[#1D3557] px-7 text-sm font-semibold text-white transition hover:bg-[#132238]"
                >
                  <Search size={18} />
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAIXA DE POSICIONAMENTO */}
        <section className="border-y border-[#E5E5E1] bg-[#F4F2ED]">
          <div className="mx-auto grid max-w-[1280px] gap-0 divide-y divide-[#DDDAD2] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="py-7 md:pr-8 lg:py-9">
              <span className="mb-4 block text-xs font-medium tracking-[0.2em] text-[#A77638]">01 / HABITARE</span>
              <h2 className="text-2xl font-semibold tracking-tight text-[#132238]">
                Seleção
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[#666]">
                Imóveis apresentados com mais qualidade.
              </p>
            </div>

            <div className="py-7 md:px-8 lg:py-9">
              <span className="mb-4 block text-xs font-medium tracking-[0.2em] text-[#A77638]">02 / HABITARE</span>
              <h2 className="text-2xl font-semibold tracking-tight text-[#132238]">
                Conexão
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[#666]">
                Contato direto com o profissional responsável.
              </p>
            </div>

            <div className="py-7 md:pl-8 lg:py-9">
              <span className="mb-4 block text-xs font-medium tracking-[0.2em] text-[#A77638]">03 / HABITARE</span>
              <h2 className="text-2xl font-semibold tracking-tight text-[#132238]">
                Experiência
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[#666]">
                Uma jornada imobiliária simples e sofisticada.
              </p>
            </div>
          </div>
        </section>

        {/* IMÓVEIS EM DESTAQUE */}
        <section className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 sm:px-8 md:pb-14 md:pt-24">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-[#C89B5A]" />

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A77638]">
                  Seleção em destaque
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#132238] md:text-4xl">
                Imóveis que merecem sua atenção.
              </h2>

              <p className="mt-4 max-w-xl text-[16px] leading-7 text-[#666]">
                Uma seleção de oportunidades publicadas recentemente na
                plataforma.
              </p>
            </div>

            <Link
              href="/imoveis"
              className="group flex items-center gap-2 text-sm font-semibold text-[#1D3557]"
            >
              Ver todos os imóveis
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* MANIFESTO / CTA */}
        <section className="px-5 pb-16 sm:px-8 md:pb-24">
          <div className="mx-auto max-w-[1280px] overflow-hidden rounded-xl bg-[#132238]">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="px-7 py-12 md:px-12 md:py-16 lg:px-16">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9B77A]">
                  Uma nova experiência imobiliária
                </p>

                <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl">
                  Encontrar um imóvel pode ser uma experiência muito melhor.
                </h2>

                <p className="mt-6 max-w-xl text-[16px] leading-8 text-white/65">
                  Imóveis bem apresentados, informações claras e conexão direta
                  com quem realmente conhece cada oportunidade.
                </p>

                <Link
                  href="/imoveis"
                  className="mt-9 inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#132238] transition hover:bg-[#F1EEE8]"
                >
                  Explorar imóveis
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=90"
                  alt="Interior sofisticado"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#132238]/50 to-transparent lg:from-[#132238]/20" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

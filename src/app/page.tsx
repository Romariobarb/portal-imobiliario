import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-white">
          <div className="mx-auto grid min-h-[590px] max-w-[1280px] items-center gap-14 px-6 py-16 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C89B5A]">
                Imóveis selecionados. Corretores verificados.
              </span>
              <h1 className="mt-6 max-w-[600px] text-5xl font-semibold leading-[1.08] tracking-tight text-[#132238] lg:text-6xl">
                Encontre um lugar para chamar de seu.
              </h1>
              <p className="mt-6 max-w-[560px] text-lg leading-8 text-[#666]">
                Explore casas, apartamentos, terrenos e imóveis comerciais anunciados diretamente por corretores da sua região.
              </p>
              <div className="mt-10 rounded-xl border border-[#E8E8E5] bg-white p-3 shadow-sm">
                <div className="mb-3 flex gap-2">
                  <button className="rounded-lg bg-[#132238] px-5 py-2.5 text-sm font-semibold text-white">Comprar</button>
                  <button className="rounded-lg px-5 py-2.5 text-sm font-semibold">Alugar</button>
                </div>
                <div className="flex flex-col gap-3 lg:flex-row">
                  <input placeholder="Cidade, bairro ou condomínio" className="min-h-14 flex-1 rounded-lg border border-[#E8E8E5] px-4 outline-none focus:border-[#1D3557]" />
                  <select className="min-h-14 rounded-lg border border-[#E8E8E5] px-4 outline-none">
                    <option>Todos os imóveis</option>
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Terreno</option>
                  </select>
                  <button className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#1D3557] px-6 font-semibold text-white transition hover:bg-[#132238]">
                    <Search size={18} /> Buscar
                  </button>
                </div>
              </div>
            </div>

            <div className="relative h-[490px] overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Residência contemporânea"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 rounded-lg bg-white px-5 py-4 shadow-lg">
                <p className="text-xs text-[#666]">Novos imóveis</p>
                <p className="mt-1 font-semibold">Descubra as últimas oportunidades</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-[#132238]">Imóveis em destaque</h2>
              <p className="mt-3 text-[#666]">Selecionados entre os anúncios mais recentes da plataforma.</p>
            </div>
            <a href="/imoveis" className="hidden text-sm font-semibold text-[#1D3557] md:block">Ver todos os imóveis →</a>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </section>
      </main>
    </>
  );
}

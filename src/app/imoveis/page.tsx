import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  searchParams: Promise<{
    tipo?: string;
    cidade?: string;
  }>;
};

export default async function ImoveisPage({ searchParams }: Props) {
  const params = await searchParams;

  const filteredProperties = properties.filter((property) => {
    const matchesType =
      !params.tipo ||
      property.type.toLowerCase() ===
        (params.tipo === "compra" ? "venda" : params.tipo.toLowerCase());

    const matchesCity =
      !params.cidade ||
      property.city.toLowerCase().includes(params.cidade.toLowerCase()) ||
      property.neighborhood.toLowerCase().includes(params.cidade.toLowerCase());

    return matchesType && matchesCity;
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F8F6]">
        <section className="border-b border-[#E8E8E5] bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C89B5A]">
              Curadoria imobiliária
            </p>

            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#132238] md:text-5xl">
                  Imóveis selecionados para viver, investir e construir patrimônio.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#666]">
                  Explore oportunidades anunciadas por corretores da plataforma.
                </p>
              </div>

              <p className="text-sm text-[#666]">
                <strong className="text-[#171717]">
                  {filteredProperties.length}
                </strong>{" "}
                imóveis disponíveis
              </p>
            </div>

            <form
              action="/imoveis"
              method="GET"
              className="mt-10 grid gap-3 rounded-xl border border-[#E8E8E5] bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]"
            >
              <input
                name="cidade"
                defaultValue={params.cidade}
                placeholder="Cidade, bairro ou condomínio"
                className="h-14 rounded-lg border border-[#E8E8E5] px-4 outline-none transition focus:border-[#1D3557]"
              />

              <select
                name="tipo"
                defaultValue={params.tipo}
                className="h-14 rounded-lg border border-[#E8E8E5] bg-white px-4 outline-none"
              >
                <option value="">Comprar ou alugar</option>
                <option value="compra">Comprar</option>
                <option value="aluguel">Alugar</option>
              </select>

              <button className="flex h-14 items-center justify-center gap-2 rounded-lg bg-[#1D3557] px-7 font-semibold text-white transition hover:bg-[#132238]">
                <Search size={18} />
                Buscar
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-14">
          <div className="mb-8 flex items-center justify-between">
            <button className="flex items-center gap-2 rounded-lg border border-[#E8E8E5] bg-white px-4 py-3 text-sm font-medium">
              <SlidersHorizontal size={17} />
              Filtros
            </button>

            <select className="rounded-lg border border-[#E8E8E5] bg-white px-4 py-3 text-sm">
              <option>Mais recentes</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
            </select>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E8E8E5] bg-white px-6 py-20 text-center">
              <h2 className="text-2xl font-semibold text-[#132238]">
                Nenhum imóvel encontrado
              </h2>

              <p className="mt-3 text-[#666]">
                Tente outra cidade ou altere os filtros da pesquisa.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
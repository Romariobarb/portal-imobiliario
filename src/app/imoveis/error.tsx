"use client";
export default function CatalogError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-lg px-5 py-16"><h1 className="mb-4 text-2xl font-semibold text-[#0E1E3A]">Não foi possível carregar os imóveis</h1><p className="mb-6 text-[#57544F]">Tente novamente em alguns instantes.</p><button onClick={reset} className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Tentar novamente</button></main>;
}

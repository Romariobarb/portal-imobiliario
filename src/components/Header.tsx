import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E8E5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-bold tracking-[-0.03em] text-[#132238]"
        >
          HABITARE
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/imoveis?tipo=compra"
            className="text-sm font-medium text-[#171717] transition hover:text-[#1D3557]"
          >
            Comprar
          </Link>

          <Link
            href="/imoveis?tipo=aluguel"
            className="text-sm font-medium text-[#171717] transition hover:text-[#1D3557]"
          >
            Alugar
          </Link>

          <Link
            href="/imoveis"
            className="text-sm font-medium text-[#171717] transition hover:text-[#1D3557]"
          >
            Imóveis
          </Link>

          <Link
            href="/corretores"
            className="text-sm font-medium text-[#171717] transition hover:text-[#1D3557]"
          >
            Corretores
          </Link>
        </nav>

        {/* AÇÕES */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[#171717] transition hover:text-[#1D3557]"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="text-sm font-medium text-[#171717] transition hover:text-[#1D3557]"
          >
            Criar conta
          </Link>

          <Link
            href="/dashboard/imoveis/novo"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1D3557] px-5 text-sm font-semibold text-white transition hover:bg-[#132238]"
          >
            Anunciar imóvel
          </Link>
        </div>

        {/* MOBILE */}
        <Link
          href="/imoveis"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1D3557] px-4 text-sm font-semibold text-white md:hidden"
        >
          Ver imóveis
        </Link>
      </div>
    </header>
  );
}
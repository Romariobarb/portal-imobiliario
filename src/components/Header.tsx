import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E8E5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8 lg:flex-nowrap lg:py-5">
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Habitare — início"
          className="border-l-2 border-[#C89B5A] pl-3 text-xl font-semibold tracking-[0.12em] text-[#132238]"
        >
          HABITARE
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav aria-label="Navegação principal" className="order-3 flex w-full items-center justify-between gap-4 border-t border-[#E8E8E5] pt-3 sm:justify-start sm:gap-8 lg:order-none lg:w-auto lg:border-0 lg:pt-0">
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
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-[#171717] transition hover:text-[#1D3557] md:inline-flex"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="hidden text-sm font-medium text-[#171717] transition hover:text-[#1D3557] xl:inline-flex"
          >
            Criar conta
          </Link>

          <Link
            href="/dashboard/imoveis/novo"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#1D3557] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#132238] hover:text-white sm:px-5 sm:text-sm"
          >
            Anunciar imóvel
          </Link>
        </div>

      </div>
    </header>
  );
}

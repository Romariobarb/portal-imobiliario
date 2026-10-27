import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-[#0E1E3A]/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8 xl:flex-nowrap xl:py-3">
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Astro Negócios Imobiliários — início"
          className="shrink-0"
        >
          <BrandLogo />
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav aria-label="Navegação principal" className="order-3 flex w-full items-center justify-between gap-4 whitespace-nowrap overflow-x-auto border-t border-white/15 pt-3 sm:justify-start sm:gap-8 xl:order-none xl:w-auto xl:border-0 xl:pt-0">
          <Link
            href="/imoveis?tipo=compra"
            className="text-sm font-medium text-[#F6F4EF] transition hover:text-[#C89B5A]"
          >
            Comprar
          </Link>

          <Link
            href="/imoveis?tipo=aluguel"
            className="text-sm font-medium text-[#F6F4EF] transition hover:text-[#C89B5A]"
          >
            Alugar
          </Link>

          <Link
            href="/imoveis"
            className="text-sm font-medium text-[#F6F4EF] transition hover:text-[#C89B5A]"
          >
            Imóveis
          </Link>

          <Link
            href="/corretores"
            className="text-sm font-medium text-[#F6F4EF] transition hover:text-[#C89B5A]"
          >
            Corretores
          </Link>
          <Link href="/construtora" className="shrink-0 text-sm font-medium text-[#F6F4EF] hover:text-[#C89B5A]">Construtora</Link>
          <Link href="/solicitar-imovel" className="shrink-0 text-sm font-medium text-[#F6F4EF] hover:text-[#C89B5A]">Solicite um imóvel</Link>
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/login"
            className="inline-flex text-sm font-medium text-[#F6F4EF] transition hover:text-[#C89B5A]"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro/cliente"
            className="hidden text-sm font-medium text-[#F6F4EF] transition hover:text-[#C89B5A] xl:inline-flex"
          >
            Criar conta
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#C89B5A] px-3 text-xs font-semibold text-[#0E1E3A] shadow-sm transition hover:bg-[#F6F4EF] hover:text-[#0E1E3A] sm:px-5 sm:text-sm"
          >
            Anunciar imóvel
          </Link>
        </div>

      </div>
    </header>
  );
}

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#E8E8E5] bg-white">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#132238]">
          HABITARE
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/imoveis?tipo=compra">Comprar</Link>
          <Link href="/imoveis?tipo=aluguel">Alugar</Link>
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/corretores">Corretores</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden text-sm font-medium md:block">Entrar</Link>
          <Link href="/cadastro" className="hidden text-sm font-medium md:block">Criar conta</Link>
          <Link href="/dashboard/imoveis/novo" className="rounded-lg bg-[#1D3557] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#132238]">
            Anunciar imóvel
          </Link>
        </div>
      </div>
    </header>
  );
}

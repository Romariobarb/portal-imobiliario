import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return <footer className="border-t border-white/15 bg-[#0E1E3A] px-5 py-10 sm:px-8"><div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-[1fr_auto]"><div><Link href="/" aria-label="Astro Negócios Imobiliários — início"><BrandLogo /></Link><p className="mt-4 max-w-md text-sm leading-6 text-[#F6F4EF]/75">Encontre imóveis para comprar ou alugar e conheça os corretores da Astro.</p></div><nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#F6F4EF]"><Link href="/imoveis?tipo=compra">Comprar</Link><Link href="/imoveis?tipo=aluguel">Alugar</Link><Link href="/corretores">Corretores</Link><Link href="/construtora">Construtora</Link><Link href="/solicitar-imovel">Solicite um imóvel</Link><Link href="/login">Entrar</Link><Link href="/cadastro">Área do corretor</Link></nav></div><div className="mx-auto mt-8 max-w-[1280px] border-t border-white/15 pt-5 text-xs text-[#F6F4EF]/75">Astro Negócios Imobiliários</div></footer>;
}

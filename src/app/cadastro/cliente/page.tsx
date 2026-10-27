import Header from "@/components/Header";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export const metadata = { title: "Criar conta | Astro Negócios Imobiliários" };
export default function ClientRegistrationPage() {
  return <><Header /><main className="mx-auto max-w-2xl px-5 py-12"><section className="rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-10"><p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C89B5A]">Encontre seu próximo endereço</p><h1 className="mb-3 text-3xl font-semibold text-[#0E1E3A]">Crie sua conta na Astro</h1><p className="mb-8 text-[#57544F]">Cadastre seus dados para acessar sua área de cliente. Você pode explorar o catálogo mesmo sem uma conta.</p><AuthForm mode="client" /><p className="mt-6 text-center text-sm text-[#57544F]">É corretor da equipe? <Link href="/cadastro" className="font-semibold text-[#0E1E3A] underline">Acesse o cadastro profissional</Link></p></section></main></>;
}

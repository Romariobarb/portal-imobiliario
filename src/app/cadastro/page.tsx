import Header from "@/components/Header";
import AuthForm from "@/components/auth/AuthForm";

export default function RegistrationPage() {
  return <><Header /><main className="mx-auto max-w-2xl px-5 py-12"><div className="rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-10"><p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C89B5A]">Sua área Astro</p><h1 className="mb-3 text-3xl font-semibold text-[#0E1E3A]">Cadastro de corretor</h1><p className="mb-8 text-[#57544F]">Você já faz parte da Astro. Complete seu cadastro para acessar sua área profissional. Seu imóvel será analisado antes de ser liberado para anúncio.</p><AuthForm mode="register" /></div></main></>;
}

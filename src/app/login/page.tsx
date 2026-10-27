import Link from "next/link";
import { safeReturnPath } from "@/lib/auth/return-path";
import Header from "@/components/Header";
import AuthForm from "@/components/auth/AuthForm";
import ResendConfirmationForm from "@/components/auth/ResendConfirmationForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; confirmed?: string; next?: string }> }) {
  const params = await searchParams;
  return <><Header /><main className="mx-auto max-w-lg px-5 py-12"><div className="rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-10"><h1 className="mb-3 text-3xl font-semibold text-[#0E1E3A]">Entre na sua conta</h1><p className="mb-8 text-[#57544F]">Acesse sua área Astro para buscar imóveis ou acompanhar seus anúncios.</p>{params.error && <p role="alert" className="mb-5 rounded-md bg-amber-50 p-4 text-amber-900">Não foi possível concluir a entrada pelo link. Se você já confirmou seu email, entre com email e senha. Caso ainda não tenha confirmado, solicite um novo link abaixo.</p>}{params.confirmed && <p role="status" className="mb-5 rounded-md bg-green-50 p-4 text-green-900">Email confirmado. Entre para continuar.</p>}<AuthForm mode="login" returnPath={safeReturnPath(params.next)} /><p className="mt-5 text-center"><Link href="/recuperar-senha" className="text-sm font-semibold underline">Esqueci minha senha</Link></p><ResendConfirmationForm /></div></main></>;
}

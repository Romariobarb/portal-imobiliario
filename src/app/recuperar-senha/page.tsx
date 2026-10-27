import Header from "@/components/Header";
import RecoveryForm from "@/components/auth/RecoveryForm";
import Link from "next/link";
export const metadata={title:"Recuperar senha | Astro"};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){const params=await searchParams;return <><Header/><main className="mx-auto max-w-lg px-5 py-12"><section className="rounded-xl border border-[#DCD8D0] bg-white p-8"><h1 className="text-3xl font-semibold text-[#0E1E3A]">Recupere sua senha</h1><p className="mt-4 text-[#57544F]">Informe o email da sua conta para receber um link de recuperação.</p>{params.error && <p role="alert" className="mt-5 rounded-md bg-amber-50 p-4 text-amber-900">O link não pôde ser validado. Solicite outro e abra neste mesmo navegador.</p>}<RecoveryForm/><Link href="/login" className="mt-6 inline-block text-sm underline">Voltar ao login</Link></section></main></>}

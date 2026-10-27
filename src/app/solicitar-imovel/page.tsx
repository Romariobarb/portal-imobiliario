import Header from "@/components/Header";
import SearchRequestForm from "@/components/SearchRequestForm";
import {getCurrentProfile} from "@/lib/auth/session";
import Link from "next/link";
export const metadata={title:"Solicite um imóvel | Astro"};
export default async function Page(){const profile=await getCurrentProfile();return <><Header/><main className="mx-auto max-w-2xl px-5 py-12"><section className="rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-10"><h1 className="text-3xl font-semibold text-[#0E1E3A]">Qual imóvel você procura?</h1><p className="mt-4 text-[#57544F]">Não encontrou no catálogo? Conte suas preferências para a equipe Astro.</p>{profile?.role==='client'?<SearchRequestForm/>:profile?<p className="mt-6">Esta solicitação é destinada às contas de clientes. Sua conta possui acesso profissional.</p>:<div className="mt-6 space-y-4"><p>Entre para enviar e guardar sua solicitação.</p><Link href="/login?next=%2Fsolicitar-imovel" className="inline-block rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Entrar</Link><p><Link href="/cadastro/cliente" className="underline">Criar conta de cliente</Link></p></div>}</section></main></>}

import Header from "@/components/Header";
import RecoveryForm from "@/components/auth/RecoveryForm";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
export const metadata={title:"Nova senha | Astro"};
export default async function Page(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();return <><Header/><main className="mx-auto max-w-lg px-5 py-12"><section className="rounded-xl border border-[#DCD8D0] bg-white p-8"><h1 className="text-3xl font-semibold text-[#0E1E3A]">Defina uma nova senha</h1>{user?<RecoveryForm reset/>:<p className="mt-5">Abra um link válido enviado ao seu email. <Link href="/recuperar-senha" className="underline">Solicitar novo link</Link></p>}</section></main></>}

import Header from "@/components/Header";
import BrokerProfileForm from "@/components/BrokerProfileForm";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Minha apresentação | Astro Negócios Imobiliários" };
export default async function BrokerProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=%2Fdashboard%2Fperfil");
  const supabase = await createClient();
  const { data: broker, error } = await supabase.from("brokers").select("id,bio,creci,status,updated_at").eq("profile_id", profile.id).maybeSingle();
  if (error) throw new Error("Não foi possível carregar sua apresentação.");
  if (!broker) redirect("/dashboard");
  return <><Header /><main className="mx-auto max-w-2xl px-5 py-12"><Link href="/dashboard" className="text-sm text-[#57544F]">← Minha área</Link><section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-[#805B29]">CRECI {broker.creci}</p><h1 className="mt-3 text-3xl font-semibold text-[#0E1E3A]">Minha apresentação</h1><p className="mt-4 text-[#57544F]">Ajude os clientes a conhecer sua experiência e sua atuação na Astro.</p>{broker.status !== "approved" && <p className="mt-5 rounded-md bg-[#F6F4EF] p-4 text-sm">Você pode preparar sua apresentação agora. Seu perfil aparecerá no site após a aprovação do cadastro profissional.</p>}<BrokerProfileForm bio={broker.bio} updatedAt={broker.updated_at} />{broker.status === "approved" && <Link href={`/corretores/${broker.id}`} className="mt-6 inline-block font-semibold underline">Ver meu perfil público</Link>}</section></main></>;
}

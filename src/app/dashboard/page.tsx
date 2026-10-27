import Header from "@/components/Header";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/auth/actions";

const statuses = {
  pending: ["Aguardando aprovação", "Recebemos seu cadastro. Você poderá anunciar imóveis após a aprovação da equipe Astro."],
  approved: ["Cadastro aprovado", "Cadastre seus imóveis e envie para análise. Cada anúncio será publicado após aprovação da equipe Astro."],
  rejected: ["Cadastro não aprovado", "Seu cadastro não foi aprovado. Entre em contato com a equipe Astro para revisar seus dados."],
  suspended: ["Cadastro suspenso", "Seu acesso para anunciar está suspenso. Entre em contato com a equipe Astro."],
};
export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  const supabase = await createClient();
  const { data: broker, error } = await supabase.from("brokers").select("*").eq("profile_id", profile.id).maybeSingle();
  if (error) throw new Error("Não foi possível consultar seu cadastro profissional.");
  const status = broker ? statuses[broker.status] : profile.role === "admin" ? ["Administrador", "Revise os cadastros e anúncios da plataforma."] : ["Vamos encontrar seu imóvel", "Explore os imóveis disponíveis para compra ou aluguel e conheça os corretores da Astro."];
  return <><Header /><main className="mx-auto max-w-4xl px-5 py-12"><div className="mb-8 flex flex-wrap items-center justify-between gap-5"><div><p className="mb-2 text-sm text-[#57544F]">Sua área Astro</p><h1 className="text-3xl font-semibold text-[#0E1E3A]">Olá, {profile.full_name || "bem-vindo"}</h1></div><form action={logout}><button className="rounded-md border border-[#DCD8D0] bg-white px-5 py-3 text-sm font-semibold">Sair da conta</button></form></div><section className="rounded-xl border border-[#DCD8D0] bg-white p-8"><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#C89B5A]">{profile.role === "client" ? "Sua conta" : "Cadastro profissional"}</p><h2 className="mb-3 text-2xl font-semibold text-[#0E1E3A]">{status[0]}</h2><p className="text-[#57544F]">{status[1]}</p>{broker && <dl className="mt-7 grid gap-5 border-t border-[#DCD8D0] pt-6 sm:grid-cols-2"><div><dt className="text-sm text-[#57544F]">CRECI</dt><dd className="mt-1 font-medium">{broker.creci}</dd></div><div><dt className="text-sm text-[#57544F]">Localidade</dt><dd className="mt-1 font-medium">{[broker.city, broker.state].filter(Boolean).join(" / ") || "Não informada"}</dd></div></dl>}</section><div className="mt-6 flex flex-wrap gap-3">{["client","admin"].includes(profile.role) && <Link href="/dashboard/solicitacoes" className="rounded-md border border-[#DCD8D0] px-5 py-3 font-semibold">Solicitações de imóveis</Link>}{broker && <Link href="/dashboard/perfil" className="rounded-md border border-[#DCD8D0] px-5 py-3 font-semibold">Minha apresentação</Link>}<Link href="/dashboard/contatos" className="rounded-md border border-[#DCD8D0] px-5 py-3 font-semibold">{profile.role === "client" ? "Meus pedidos de contato" : "Contatos recebidos"}</Link>{profile.role === "client" && <><Link href="/imoveis" className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Buscar imóveis</Link><Link href="/corretores" className="rounded-md border border-[#DCD8D0] px-5 py-3 font-semibold">Conhecer corretores</Link></>}{broker?.status === "approved" && <Link href="/dashboard/imoveis" className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Meus imóveis</Link>}{profile.role === "admin" && <Link href="/admin" className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Abrir administração</Link>}</div></main></>;
}

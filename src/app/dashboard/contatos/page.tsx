import FollowupFilter from "@/components/FollowupFilter";
import FollowupForm from "@/components/FollowupForm";
import {followupLabels} from "@/lib/properties/followup";
import Header from "@/components/Header";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Contatos | Astro Negócios Imobiliários" };
export default async function ContactsPage({searchParams}:{searchParams:Promise<{status?:string}>}) {
  const params=await searchParams;
  const filter=typeof params.status==='string' && Object.hasOwn(followupLabels,params.status)?params.status:"all";
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=%2Fdashboard%2Fcontatos");
  const supabase = await createClient();
  // RLS restricts rows to the sender, approved responsible broker, or administrator.
  let query = supabase.from("property_requests").select("id,message,created_at,property_id,client_id,status,updated_at").order("created_at", { ascending: false }).limit(100);
  if(filter!=="all") query=query.eq("status",filter);
  const {data:requests,error}=await query;
  if (error) throw new Error("Não foi possível carregar os contatos.");
  const ids = [...new Set(requests.map(r => r.property_id))];
  const { data: properties, error: propertiesError } = ids.length ? await supabase.from("properties").select("id,title,slug,status").in("id", ids) : { data: [], error: null };
  if (propertiesError) throw new Error("Não foi possível carregar os imóveis dos contatos.");
  return <><Header /><main className="mx-auto max-w-4xl px-5 py-12"><Link href="/dashboard" className="text-sm text-[#57544F]">← Minha área</Link><h1 className="mt-6 text-3xl font-semibold text-[#0E1E3A]">{profile.role === "client" ? "Meus pedidos de contato" : "Contatos recebidos"}</h1><p className="mt-3 text-[#57544F]">Até 100 mensagens mais recentes. Acompanhe a situação de cada pedido. O retorno é combinado pelo contato informado na mensagem.</p><FollowupFilter status={filter} path="/dashboard/contatos"/><div className="mt-8 space-y-5">{requests.map(request => { const property = properties?.find(p => p.id === request.property_id); return <article key={request.id} className="rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="text-xl font-semibold">{property?.title ?? "Anúncio indisponível"}</h2><p className="mt-2 text-sm text-[#57544F]">Enviado em {new Date(request.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p><p className="mt-3 text-sm font-semibold text-[#805B29]">{followupLabels[request.status]} · Atualizado em {new Date(request.updated_at).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}</p><p className="mt-4 whitespace-pre-wrap break-words">{request.message}</p>{property?.status === "approved" && <Link href={`/imoveis/${property.slug}`} className="mt-4 inline-block font-semibold text-[#0E1E3A] underline">Ver imóvel</Link>}{profile.role !== "client" && <FollowupForm key={request.updated_at} kind="contact" id={request.id} status={request.status} updatedAt={request.updated_at}/>}</article>; })}{!requests.length && <div className="rounded-xl border border-[#DCD8D0] bg-white p-8"><h2 className="text-xl font-semibold">Nenhuma mensagem nesta situação</h2><p className="mt-3 text-[#57544F]">{profile.role === "client" ? "Quando você enviar seu interesse em um imóvel, o registro aparecerá aqui." : "As mensagens dos clientes aparecerão aqui conforme as permissões da sua conta."}</p><Link href="/imoveis" className="mt-5 inline-block font-semibold underline">Explorar imóveis</Link></div>}</div></main></>;
}

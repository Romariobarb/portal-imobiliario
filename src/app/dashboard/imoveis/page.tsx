import Link from "next/link";
import Header from "@/components/Header";
import { requireBroker } from "@/lib/properties/access";
import { propertyStatusLabels } from "@/lib/properties/validation";

export default async function MyProperties({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { broker, supabase } = await requireBroker();
  const { data: properties, error } = await supabase.from("properties").select("*").eq("broker_id", broker.id).order("created_at", { ascending: false });
  if (error) throw new Error("Não foi possível carregar seus imóveis.");
  const { saved } = await searchParams;
  return <><Header /><main className="mx-auto max-w-4xl px-5 py-12"><Link href="/dashboard" className="text-sm text-[#57544F]">← Minha área</Link><div className="my-6 flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-semibold text-[#0E1E3A]">Meus imóveis</h1><Link href="/dashboard/imoveis/novo" className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Cadastrar imóvel</Link></div>{saved && <p role="status" className="mb-6 rounded-md bg-green-50 p-4 text-green-900">{saved === "submitted" ? "Imóvel enviado para análise." : "Rascunho salvo."}</p>}<div className="space-y-4">{properties?.map(p => <article key={p.id} className="rounded-xl border border-[#DCD8D0] bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-semibold text-[#0E1E3A]">{p.title}</h2><p className="mt-2 text-sm text-[#57544F]">{p.city} / {p.state} · {propertyStatusLabels[p.status]}</p></div><Link href={`/dashboard/imoveis/${p.id}`} className="font-semibold text-[#0E1E3A] underline">{['draft','changes_requested'].includes(p.status) ? "Editar imóvel" : "Ver imóvel"}</Link></div></article>)}{!properties?.length && <p className="rounded-xl border border-[#DCD8D0] bg-white p-8 text-[#57544F]">Você ainda não cadastrou imóveis.</p>}</div></main></>;
}

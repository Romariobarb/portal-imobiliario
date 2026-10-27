import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PropertyForm from "@/components/PropertyForm";
import { requireBroker } from "@/lib/properties/access";
import { propertyStatusLabels } from "@/lib/properties/validation";

export default async function EditProperty({ params }: { params: Promise<{ id: string }> }) {
  const { broker, supabase } = await requireBroker(); const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: property, error } = await supabase.from("properties").select("*").eq("id", id).eq("broker_id", broker.id).maybeSingle();
  if (error) throw new Error("Não foi possível carregar o imóvel."); if (!property) notFound();
  const [{ data: images, error: imagesError }, { data: history, error: historyError }] = await Promise.all([supabase.from("property_images").select("*").eq("property_id", id).order("position"),supabase.from("moderation_events").select("*").eq("property_id",id).order("created_at",{ascending:false})]);
  if (imagesError || historyError) throw new Error("Não foi possível carregar os detalhes.");
  return <><Header /><main className="mx-auto max-w-3xl px-5 py-12"><Link href="/dashboard/imoveis" className="text-sm text-[#57544F]">← Meus imóveis</Link><h1 className="my-6 text-3xl font-semibold text-[#0E1E3A]">{property.title}</h1><p className="mb-6 text-sm text-[#57544F]">{propertyStatusLabels[property.status]}</p>{history?.length ? <section className="mb-6 rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="mb-3 font-semibold">Histórico de revisão</h2>{history.map(event => <p key={event.id} className="mb-2 text-sm text-[#57544F]">{new Date(event.created_at).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} · {propertyStatusLabels[event.new_status as keyof typeof propertyStatusLabels] ?? event.new_status}{event.reason ? ` — ${event.reason}` : ""}</p>)}</section> : null}<section className="rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-8">{['draft','changes_requested'].includes(property.status) ? <PropertyForm property={property} images={images ?? []} /> : <><p className="mb-4 text-[#57544F]">{property.status === 'pending' ? 'Seu imóvel está em análise. A edição ficará disponível se forem solicitados ajustes.' : 'Este imóvel não está disponível para edição.'}</p><p className="whitespace-pre-line">{property.description}</p>{property.status === 'approved' && <Link className="mt-5 inline-block font-semibold text-[#0E1E3A] underline" href={`/imoveis/${property.slug}`}>Ver anúncio</Link>}</>}</section></main></>;
}

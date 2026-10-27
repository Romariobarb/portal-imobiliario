import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ModerationForm from "@/components/ModerationForm";
import { requireAdmin } from "@/lib/properties/access";
import { displayPhotos } from "@/lib/properties/photo-display";
import { propertyStatusLabels } from "@/lib/properties/validation";
const money = (value: number | null) => value === null ? "Não informado" : new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(value);
const date = (value: string) => new Date(value).toLocaleString("pt-BR", {timeZone:"America/Sao_Paulo"});
export default async function ReviewProperty({params}: {params: Promise<{id:string}>}) {
 const {id}=await params;
 const {supabase}=await requireAdmin(`/admin/imoveis/${id}`);
 if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
 const {data:property,error}=await supabase.from("properties").select("*").eq("id",id).maybeSingle();
 if (error) throw new Error("Não foi possível carregar o imóvel para revisão.");
 if (!property) notFound();
 const [brokerResult,imagesResult,historyResult]=await Promise.all([
  supabase.from("brokers").select("*").eq("id",property.broker_id).single(),
  supabase.from("property_images").select("*").eq("property_id",id).order("position"),
  supabase.from("moderation_events").select("*").eq("property_id",id).order("created_at",{ascending:false}),
 ]);
 if(brokerResult.error || imagesResult.error || historyResult.error) throw new Error("Não foi possível carregar os detalhes da revisão.");
 const broker=brokerResult.data;
 const {data:profiles,error:profilesError}=await supabase.from("profiles").select("*").in("id",[broker.profile_id,...(historyResult.data??[]).map(event=>event.actor_id)]);
 if(profilesError) throw new Error("Não foi possível carregar os responsáveis.");
 const owner=profiles?.find(profile=>profile.id===broker.profile_id);
 const photos=await displayPhotos(supabase,imagesResult.data??[]);
 const facts=[["Finalidade",property.operation_type==="sale"?"Venda":"Aluguel"],["Tipo",property.property_type],["Preço",money(property.price)],["Área",`${property.area} m²`],["Quartos",property.bedrooms],["Suítes",property.suites],["Banheiros",property.bathrooms],["Vagas",property.parking_spaces],["Condomínio mensal",money(property.condominium_fee)],["IPTU anual",money(property.property_tax)]];
 return <><Header/><main className="mx-auto max-w-5xl px-5 py-10">
  <Link href="/admin" className="text-sm text-[#57544F]">← Voltar para administração</Link>
  <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[#805B29]">Revisão do anúncio</p>
  <h1 className="mt-3 text-3xl font-semibold text-[#0E1E3A]">{property.title}</h1>
  <p className="mt-3 text-sm text-[#57544F]">{propertyStatusLabels[property.status]} · Cadastrado em {date(property.created_at)}</p>
  <section className="mt-8 rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="text-xl font-semibold">Fotos do imóvel</h2>
   <div className="mt-5 grid gap-4 sm:grid-cols-2">{photos.map((photo,index)=><a href={photo.url} key={photo.id} target="_blank" rel="noreferrer" className="block"><img src={photo.url} alt={photo.alt||`Foto ${index+1} de ${property.title}`} loading={index===0?"eager":"lazy"} className="h-64 w-full rounded-md object-cover"/><p className="mt-2 text-sm text-[#57544F]">{index===0?"Capa do anúncio":`Foto ${index+1}`} · Abrir foto</p></a>)}</div>
   {!photos.length && <p className="mt-4 text-[#57544F]">Nenhuma foto cadastrada. O anúncio precisa de uma foto para ser aprovado.</p>}
  </section>
  <section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="text-xl font-semibold">Dados do imóvel</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{facts.map(([label,value])=><div key={label}><dt className="text-sm text-[#57544F]">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl><h3 className="mb-2 mt-6 font-semibold">Localização</h3><p>{property.neighborhood} · {property.city} / {property.state}</p><p className="mt-2 text-sm text-[#57544F]">{property.address||"Endereço não informado"}</p><h3 className="mb-2 mt-6 font-semibold">Descrição</h3><p className="whitespace-pre-line leading-7">{property.description}</p><h3 className="mb-2 mt-6 font-semibold">Características</h3><p>{property.features.join(", ")||"Nenhuma característica adicional informada"}</p></section>
  <section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="text-xl font-semibold">Corretor responsável</h2><p className="mt-3">{owner?.full_name||"Corretor"} · CRECI {broker.creci}</p><p className="mt-2 text-sm text-[#57544F]">{[broker.city,broker.state].filter(Boolean).join(" / ")}{owner?.phone?` · Telefone: ${owner.phone}`:""}</p>{broker.status!=="approved"&&<p role="alert" className="mt-4 rounded-md bg-amber-50 p-3 text-amber-900">O corretor não está aprovado. Confira o cadastro antes de publicar este imóvel.</p>}</section>
  <section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="text-xl font-semibold">Decisão da revisão</h2>{["pending","approved"].includes(property.status)?<ModerationForm key={property.status} entity="property" id={id} status={property.status} canApprove={broker.status==="approved"&&photos.length>0}/>:<p className="mt-4 text-[#57544F]">Este anúncio está em {propertyStatusLabels[property.status].toLowerCase()} e não está disponível para uma nova decisão de revisão.</p>}{property.status==="approved"&&<Link href={`/imoveis/${property.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#0E1E3A] underline">Ver anúncio publicado</Link>}</section>
  <section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-6"><h2 className="text-xl font-semibold">Histórico de revisão</h2>{historyResult.data?.length?<ol className="mt-4 space-y-4">{historyResult.data.map(event=><li key={event.id} className="border-l-2 border-[#C89B5A] pl-4"><p className="text-sm font-medium">{propertyStatusLabels[event.new_status as keyof typeof propertyStatusLabels]??event.new_status} · {date(event.created_at)}</p><p className="mt-1 text-sm text-[#57544F]">Por {profiles?.find(profile=>profile.id===event.actor_id)?.full_name||"Administrador"}</p>{event.reason&&<p className="mt-2 whitespace-pre-line text-sm">{event.reason}</p>}</li>)}</ol>:<p className="mt-4 text-[#57544F]">Este imóvel ainda não recebeu uma decisão de revisão.</p>}</section>
 </main></>;
}

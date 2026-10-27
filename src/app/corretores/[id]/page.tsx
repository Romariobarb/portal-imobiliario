import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { createClient } from "@/lib/supabase/server";
import { getPublicProperties } from "@/lib/properties/catalog";
export const metadata: Metadata = {title:"Imóveis do corretor | Astro Negócios Imobiliários"};
export default async function BrokerPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
 const supabase=await createClient();
 const {data:broker,error}=await supabase.from("brokers").select("id,creci,city,state,bio").eq("id",id).eq("status","approved").maybeSingle();
 if(error) throw new Error("Não foi possível carregar o corretor.");
 if(!broker) notFound();
 const properties=await getPublicProperties(broker.id);
 return <><Header/><main className="mx-auto max-w-6xl px-5 py-12"><Link href="/corretores" className="text-sm text-[#57544F]">← Todos os corretores</Link><section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-7"><p className="text-xs font-semibold uppercase tracking-widest text-[#805B29]">Corretor Astro</p><h1 className="mt-3 text-3xl font-semibold text-[#0E1E3A]">CRECI {broker.creci}</h1><p className="mt-3 text-[#57544F]">{[broker.city,broker.state].filter(Boolean).join(" / ")||"Localidade não informada"}</p>{broker.bio&&<p className="mt-5 whitespace-pre-line leading-7 text-[#57544F]">{broker.bio}</p>}</section><section className="mt-10"><h2 className="mb-5 text-2xl font-semibold">Imóveis deste corretor</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{properties.map(property=><PropertyCard key={property.id} property={property}/>)}</div>{!properties.length&&<p className="rounded-xl border border-[#DCD8D0] bg-white p-7 text-[#57544F]">Este corretor ainda não possui imóveis publicados. Novos anúncios aparecerão aqui após a aprovação.</p>}</section></main></>;
}

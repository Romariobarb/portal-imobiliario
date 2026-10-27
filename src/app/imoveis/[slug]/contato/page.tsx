import Header from "@/components/Header";
import PropertyContactForm from "@/components/PropertyContactForm";
import { getPublicProperties } from "@/lib/properties/catalog";
import { getCurrentProfile } from "@/lib/auth/session";
import { notFound } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Tenho interesse | Astro Negócios Imobiliários" };
export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = (await getPublicProperties()).find(p => p.slug === slug);
  if (!property) notFound();
  const profile = await getCurrentProfile();
  return <><Header /><main className="mx-auto max-w-2xl px-5 py-12"><Link href={`/imoveis/${property.slug}`} className="text-sm text-[#57544F]">← Voltar ao imóvel</Link><section className="mt-6 rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-10"><h1 className="text-3xl font-semibold text-[#0E1E3A]">Tenho interesse</h1><p className="mt-3 text-[#57544F]">{property.title} · {property.city} / {property.state}</p>{profile?.role === "client" ? <PropertyContactForm propertyId={property.id} /> : profile ? <p className="mt-6">O envio de interesse é destinado às contas de clientes. Sua conta tem acesso profissional.</p> : <div className="mt-6 space-y-4"><p>Entre para enviar uma mensagem e guardar seu pedido na sua área. A consulta do anúncio continua livre.</p><Link href={`/login?next=${encodeURIComponent(`/imoveis/${slug}/contato`)}`} className="inline-block rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white">Entrar para enviar</Link><p><Link href="/cadastro/cliente" className="font-semibold underline">Criar conta de cliente</Link></p></div>}</section></main></>;
}

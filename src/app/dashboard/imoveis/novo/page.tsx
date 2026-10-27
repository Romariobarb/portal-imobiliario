import Link from "next/link";
import Header from "@/components/Header";
import PropertyForm from "@/components/PropertyForm";
import { requireBroker } from "@/lib/properties/access";

export default async function NewProperty() {
  await requireBroker();
  return <><Header /><main className="mx-auto max-w-3xl px-5 py-12"><Link href="/dashboard/imoveis" className="text-sm text-[#57544F]">← Meus imóveis</Link><h1 className="my-6 text-3xl font-semibold text-[#0E1E3A]">Cadastrar imóvel</h1><section className="rounded-xl border border-[#DCD8D0] bg-white p-6 sm:p-8"><PropertyForm /></section></main></>;
}

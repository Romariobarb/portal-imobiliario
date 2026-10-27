"use client";

import { useActionState, useState } from "react";
import { saveListing } from "@/lib/properties/actions";
import { brazilStates, propertyTypes } from "@/lib/properties/validation";
import PropertyPhotos from "@/components/PropertyPhotos";
import type { Property, PropertyImage } from "@/types/domain";

const inputClass = "mt-2 w-full rounded-md border border-[#DCD8D0] bg-white px-4 py-3";
export default function PropertyForm({ property, images = [] }: { property?: Property; images?: PropertyImage[] }) {
  const [state, action, pending] = useActionState(saveListing, {});
  const [uploading, setUploading] = useState(false);
  const initial: Record<string, string> = property ? Object.fromEntries(Object.entries(property).map(([key,value]) => [key, Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value)])) : {};
  initial.images = images.map(image => image.url).join("\n");
  const val = (key: string, fallback = "") => state.values?.[key] ?? initial[key] ?? fallback;
  const textFields = [["title", "Título do imóvel", 150], ["city", "Cidade", 100], ["neighborhood", "Bairro", 100], ["address", "Endereço (opcional)", 300]] as const;
  const numbers = [["price", "Preço (R$)", false], ["area", "Área (m²)", false], ["bedrooms", "Quartos", true], ["suites", "Suítes", true], ["bathrooms", "Banheiros", true], ["parking_spaces", "Vagas", true], ["condominium_fee", "Condomínio mensal (R$, opcional)", false], ["property_tax", "IPTU anual (R$, opcional)", false]] as const;
  return <form action={action} className="space-y-6">
    {state.error && <p role="alert" className="rounded-md bg-red-50 p-4 text-red-800">{state.error}</p>}
    <input type="hidden" name="id" value={property?.id ?? ""} /><input type="hidden" name="updated_at" value={property?.updated_at ?? ""} />
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Finalidade<select name="operation_type" defaultValue={val("operation_type", "sale")} className={inputClass}><option value="sale">Venda</option><option value="rent">Aluguel</option></select></label>
      <label className="text-sm font-medium">Tipo de imóvel<select name="property_type" defaultValue={val("property_type", "Apartamento")} className={inputClass}>{propertyTypes.map(type => <option key={type}>{type}</option>)}</select></label>
      {textFields.map(([key,label,max]) => <label key={key} className="text-sm font-medium">{label}<input name={key} defaultValue={val(key)} required={key !== "address"} maxLength={max} className={inputClass} /></label>)}
      <label className="text-sm font-medium">Estado<select name="state" required defaultValue={val("state")} className={inputClass}><option value="" disabled>Selecione a UF</option>{brazilStates.map(uf => <option key={uf}>{uf}</option>)}</select></label>
      {numbers.map(([key,label,integer]) => <label key={key} className="text-sm font-medium">{label}<input name={key} type="number" step={integer ? "1" : "0.01"} min="0" max={integer ? "100" : undefined} defaultValue={val(key, integer ? "0" : "")} required={!['condominium_fee','property_tax'].includes(key)} className={inputClass} /></label>)}
    </div>
    <label className="block text-sm font-medium">Descrição<textarea name="description" rows={5} required minLength={10} maxLength={10000} defaultValue={val("description")} className={inputClass} /></label>
    <label className="block text-sm font-medium">Características<input name="features" defaultValue={val("features")} placeholder="Varanda, piscina, elevador" className={inputClass} /><span className="mt-1 block text-xs text-[#57544F]">Separe as características por vírgulas.</span></label>
    <PropertyPhotos initialUrls={val("images").split(/\r?\n/).filter(Boolean)} onBusy={setUploading} />
    <p className="text-sm text-[#57544F]">Seu imóvel será analisado antes de ser liberado para anúncio.</p>
    <div className="flex flex-wrap gap-3"><button name="intent" value="draft" disabled={pending || uploading} className="rounded-md border border-[#DCD8D0] bg-white px-5 py-3 font-semibold disabled:opacity-50">Salvar rascunho</button><button name="intent" value="submit" disabled={pending || uploading} className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending ? "Salvando…" : "Enviar para análise"}</button></div>
  </form>;
}

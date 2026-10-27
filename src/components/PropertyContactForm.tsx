"use client";
import { useActionState } from "react";
import { sendPropertyInterest } from "@/lib/properties/contact-actions";

export default function PropertyContactForm({ propertyId }: { propertyId: string }) {
  const [state, action, pending] = useActionState(sendPropertyInterest, {});
  return <form action={action} className="mt-6 space-y-5"><input type="hidden" name="property_id" value={propertyId} />{state.error && <p role="alert" className="rounded-md bg-red-50 p-4 text-red-800">{state.error}</p>}{state.message ? <p role="status" className="rounded-md bg-green-50 p-4 text-green-900">{state.message}</p> : <><label className="block font-medium" htmlFor="message">Sua mensagem<textarea id="message" name="message" required minLength={10} maxLength={5000} rows={6} className="mt-2 w-full rounded-md border border-[#DCD8D0] p-4" placeholder="Conte suas dúvidas ou interesse em visitar este imóvel." /></label><p className="text-sm text-[#57544F]">A mensagem será compartilhada com o corretor responsável e a administração. Inclua o telefone ou email pelo qual deseja receber o retorno.</p><button disabled={pending} className="w-full rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Enviando…" : "Enviar interesse"}</button></>}</form>;
}

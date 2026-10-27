"use client";
import { useActionState, useState } from "react";
import { saveBrokerBio } from "@/lib/properties/profile-actions";

export default function BrokerProfileForm({ bio, updatedAt }: { bio: string | null; updatedAt: string }) {
  const [state, action, pending] = useActionState(saveBrokerBio, {});
  const [text, setText] = useState(bio ?? "");
  return <form action={action} className="mt-7 space-y-5"><input type="hidden" name="updated_at" value={state.updatedAt ?? updatedAt} />{state.error && <p role="alert" className="rounded-md bg-red-50 p-4 text-red-800">{state.error}</p>}{state.message && <p role="status" className="rounded-md bg-green-50 p-4 text-green-900">{state.message}</p>}<label htmlFor="bio" className="block font-medium">Sua apresentação<textarea id="bio" name="bio" rows={7} maxLength={2000} value={text} onChange={event => setText(event.target.value)} disabled={pending} className="mt-2 w-full rounded-md border border-[#DCD8D0] p-4 disabled:opacity-60" placeholder="Conte sobre sua experiência, regiões atendidas e tipos de imóveis com que trabalha." /></label><p className="text-sm text-[#57544F]">{text.length} / 2.000 caracteres. Esse texto será público. Para retirar a apresentação, deixe o campo vazio e salve.</p><button disabled={pending} className="rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Salvando…" : "Salvar apresentação"}</button></form>;
}

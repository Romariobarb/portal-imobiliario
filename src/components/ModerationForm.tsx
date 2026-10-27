"use client";
import { useActionState } from "react";
import { moderateListing } from "@/lib/properties/actions";

export default function ModerationForm({ entity, id, status, canApprove = true }: { entity: "broker" | "property"; id: string; status: string; canApprove?: boolean }) {
  const [state, action, pending] = useActionState(moderateListing, {});
  const choices = entity === "broker" ? [["approved", "Aprovar"], ["rejected", "Não aprovar"], ["suspended", "Suspender"]].filter(([value]) => value !== status) : status === "approved" ? [["archived", "Arquivar anúncio"]] : [["approved", "Aprovar anúncio"], ["changes_requested", "Solicitar ajustes"], ["rejected", "Não aprovar"]];
  return <form action={action} className="mt-5 space-y-3"><input type="hidden" name="entity" value={entity} /><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={status} />
    {state.error && <p role="alert" className="text-sm text-red-800">{state.error}</p>}{state.message && <p role="status" className="text-sm text-green-800">{state.message}</p>}
    <label className="block text-sm">Motivo da revisão<textarea name="reason" maxLength={2000} rows={2} className="mt-2 w-full rounded-md border border-[#DCD8D0] px-3 py-2" placeholder="Obrigatório para ajustes, recusa ou suspensão" /></label>
    <div className="flex flex-wrap gap-3">{choices.map(([value,label]) => <button key={value} name="decision" value={value} disabled={pending || (value === "approved" && !canApprove)} className={`rounded-md border px-4 py-2 text-sm font-semibold disabled:opacity-50 ${value === "approved" ? "border-[#0E1E3A] bg-[#0E1E3A] text-white" : "border-[#DCD8D0] bg-white"}`}>{pending ? "Aguarde…" : label}</button>)}</div>
  </form>;
}

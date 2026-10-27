"use client";
import { useActionState } from "react";
import { recordCreciCheck } from "@/lib/properties/creci-actions";
import { brazilStates } from "@/lib/properties/validation";
export default function CreciCheckForm({ id, updatedAt, fullName }: { id: string; updatedAt: string; fullName: string }) {
 const [state,action,pending]=useActionState(recordCreciCheck,{});
 return <details className="mt-4 rounded-md border border-[#DCD8D0] p-4"><summary className="cursor-pointer text-sm font-semibold">Registrar conferência do CRECI</summary><form action={action} className="mt-4 space-y-4">
  <input type="hidden" name="id" value={id}/><input type="hidden" name="updated_at" value={updatedAt}/><input type="hidden" name="full_name" value={fullName}/>
  <p className="text-sm text-[#57544F]">Confira número, nome e situação cadastral no conselho da UF de inscrição. Este registro é uma conferência manual feita pela equipe Astro.</p>
  {state.error && <p role="alert" className="text-sm text-red-800">{state.error}</p>}{state.message && <p role="status" className="text-sm text-green-800">{state.message}</p>}
  <label className="block text-sm">UF de inscrição no CRECI<select name="registration_state" required defaultValue="" className="mt-2 block w-full rounded-md border border-[#DCD8D0] p-3"><option value="" disabled>Selecione a UF do registro</option>{brazilStates.map(uf=><option key={uf}>{uf}</option>)}</select></label>
  <label className="block text-sm">Resultado<select name="result" required defaultValue="" className="mt-2 block w-full rounded-md border border-[#DCD8D0] p-3"><option value="" disabled>Selecione o resultado</option><option value="confirmed">Número, nome e situação conferidos</option><option value="not_found">Registro não localizado</option><option value="mismatch">Dados divergentes ou situação incompatível</option></select></label>
  <label className="block text-sm">Detalhes da consulta<textarea name="notes" required minLength={10} maxLength={2000} rows={3} placeholder="Informe a fonte consultada e a situação encontrada. Não inclua CPF ou documentos pessoais." className="mt-2 block w-full rounded-md border border-[#DCD8D0] p-3"/></label>
  <label className="flex gap-2 text-sm"><input type="checkbox" name="attestation" required/>Consultei a fonte oficial e conferi os dados acima.</label>
  <button disabled={pending} className="rounded-md bg-[#0E1E3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending?"Salvando…":"Registrar conferência"}</button>
 </form></details>;
}

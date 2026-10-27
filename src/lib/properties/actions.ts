"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireBroker } from "./access";
import { validateListing } from "./validation";
import { storedPhotoPath } from "./photos";

export type ListingState = { error?: string; message?: string; values?: Record<string, string> };
export async function saveListing(_: ListingState, form: FormData): Promise<ListingState> {
  const { supabase, profile } = await requireBroker();
  const values = Object.fromEntries(Array.from(form.entries()).filter(([key]) => !key.startsWith("$")).map(([key, value]) => [key, String(value)]));
  let payload;
  try { payload = validateListing(form); } catch (error) { return { error: (error as Error).message, values }; }
  if (payload.images.some(url => { const path = storedPhotoPath(url); return path !== null && !path.startsWith(`${profile.id}/`); })) return { error: "Use apenas fotos enviadas pela sua conta.", values };
  const submit = form.get("intent") === "submit";
  if (submit && !payload.images.length) return { error: "Adicione pelo menos uma foto antes de enviar para análise.", values };
  const id = String(form.get("id") ?? "") || null;
  const timestamp = String(form.get("updated_at") ?? "") || null;
  const { data, error } = await supabase.rpc("save_listing", { payload, listing_id: id, submit_review: submit, expected_updated_at: timestamp });
  if (error || !data) return { error: error?.code === "40001" ? "O imóvel foi atualizado em outra aba. Recarregue a página antes de salvar." : "Não foi possível salvar. Confira seus dados e seu status de aprovação; tente novamente.", values };
  revalidatePath("/dashboard/imoveis");
  redirect(`/dashboard/imoveis?saved=${submit ? "submitted" : "draft"}`);
}

export async function moderateListing(_: ListingState, form: FormData): Promise<ListingState> {
  const { supabase } = await requireAdmin();
  const entity = String(form.get("entity") ?? ""), target_id = String(form.get("id") ?? ""), expected_status = String(form.get("status") ?? ""), decision = String(form.get("decision") ?? ""), reason = String(form.get("reason") ?? "").trim();
  if (!["broker", "property"].includes(entity) || reason.length > 2000 || (["rejected", "changes_requested", "suspended"].includes(decision) && !reason)) return { error: "Informe um motivo para solicitar ajustes, recusar ou suspender." };
  const { error } = await supabase.rpc("moderate_listing", { entity, target_id, expected_status, decision, reason });
  if (error) return { error: error.code === "23514" && entity === "broker" && decision === "approved" ? "Registre uma conferência válida do CRECI com os dados atuais antes de aprovar." : "Não foi possível concluir a revisão. Confira o status atual e atualize a página." };
  if (entity === "property") revalidatePath(`/admin/imoveis/${target_id}`);
  revalidatePath("/dashboard"); revalidatePath("/admin"); revalidatePath("/imoveis"); revalidatePath("/");
  return { message: "Revisão salva." };
}

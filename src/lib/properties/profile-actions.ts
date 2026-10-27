"use server";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; message?: string; updatedAt?: string };
export async function saveBrokerBio(_: ProfileState, form: FormData): Promise<ProfileState> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Entre novamente para salvar sua apresentação." };
  const raw = form.get("bio");
  if (typeof raw !== "string" || raw.trim().length > 2000) return { error: "Use até 2.000 caracteres na apresentação.", updatedAt: _.updatedAt };
  const expected = String(form.get("updated_at") ?? "");
  if (!expected || !Number.isFinite(Date.parse(expected))) return { error: "Recarregue a página antes de salvar." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("brokers").update({ bio: raw.trim() || null }).eq("profile_id", profile.id).eq("updated_at", expected).select("id,updated_at").maybeSingle();
  if (error) return { error: "Não foi possível salvar sua apresentação. Tente novamente mais tarde.", updatedAt: expected };
  if (!data) return { error: "Seu cadastro mudou ou não está disponível. Recarregue a página para atualizar os dados.", updatedAt: expected };
  revalidatePath(`/corretores/${data.id}`);
  revalidatePath("/corretores");
  revalidatePath("/dashboard/perfil");
  return { message: "Apresentação salva. Ela fica visível ao público quando seu cadastro de corretor está aprovado.", updatedAt: data.updated_at };
}

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type ContactState = { error?: string; message?: string };
export async function sendPropertyInterest(_: ContactState, form: FormData): Promise<ContactState> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "client") return { error: "Entre com uma conta de cliente para enviar seu interesse." };
  const propertyId = String(form.get("property_id") ?? "");
  const message = String(form.get("message") ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId) || message.length < 10 || message.length > 5000) return { error: "Escreva uma mensagem de 10 a 5.000 caracteres." };
  const supabase = await createClient();
  // RLS checks client ownership and current publication/broker status atomically.
  const { error } = await supabase.from("property_requests").insert({ property_id: propertyId, client_id: profile.id, message });
  if (error) return { error: "Não foi possível enviar. O anúncio pode ter sido retirado. Tente novamente mais tarde." };
  revalidatePath("/dashboard/contatos");
  return { message: "Interesse enviado. O corretor responsável e a equipe Astro podem consultar sua mensagem. Acompanhe o registro na sua área." };
}

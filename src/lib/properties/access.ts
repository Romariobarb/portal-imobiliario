import "server-only";
import { safeReturnPath } from "@/lib/auth/return-path";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function requireBroker() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  const supabase = await createClient();
  const { data: broker, error } = await supabase.from("brokers").select("*").eq("profile_id", profile.id).maybeSingle();
  if (error) throw new Error("Não foi possível consultar seu cadastro.");
  if (!broker || broker.status !== "approved") redirect("/dashboard");
  return { profile, broker, supabase };
}

export async function requireAdmin(returnPath = "/admin") {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(safeReturnPath(returnPath))}`);
  if (profile.role !== "admin") redirect("/dashboard");
  return { profile, supabase: await createClient() };
}

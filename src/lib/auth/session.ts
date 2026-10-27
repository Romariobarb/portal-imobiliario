import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Validates identity with Auth, then reads the role from the RLS-protected table. */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    if (error.status === 400 || error.status === 401 || error.status === 403) return null;
    throw error;
  }
  if (!user) return null;
  const { data, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profileError) throw profileError;
  return data;
}

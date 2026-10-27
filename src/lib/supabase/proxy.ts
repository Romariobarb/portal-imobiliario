import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnvironment, hasSupabaseEnvironment } from "./env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!hasSupabaseEnvironment()) return response;
  const { url, key } = getSupabaseEnvironment();
  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  const { error } = await supabase.auth.getUser();
  if (error && error.status !== 400 && error.status !== 401 && error.status !== 403) throw error;
  return response;
}

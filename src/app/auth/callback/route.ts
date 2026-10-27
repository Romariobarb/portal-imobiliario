import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  // Email confirmation must also work outside the browser that started signup.
  // Only signup tokens are accepted; OAuth/PKCE keeps its separate code flow.
  if (tokenHash && type === "signup") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "signup" });
    if (!error) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.redirect(new URL("/login?error=confirmation", request.url));
  }
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.redirect(new URL("/login?error=confirmation", request.url));
}

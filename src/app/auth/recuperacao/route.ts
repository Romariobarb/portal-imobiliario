import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
export async function GET(request:NextRequest){
 const supabase=await createClient();
 const hash=request.nextUrl.searchParams.get("token_hash"),type=request.nextUrl.searchParams.get("type"),code=request.nextUrl.searchParams.get("code");
 if(hash && type==="recovery"){const {error}=await supabase.auth.verifyOtp({token_hash:hash,type:"recovery"});if(!error)return NextResponse.redirect(new URL("/nova-senha",request.url));}
 else if(code){const {error}=await supabase.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL("/nova-senha",request.url));}
 return NextResponse.redirect(new URL("/recuperar-senha?error=link",request.url));
}

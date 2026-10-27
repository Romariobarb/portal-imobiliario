"use server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
export type RecoveryState = { error?: string; message?: string };
export async function requestRecovery(_: RecoveryState, form: FormData): Promise<RecoveryState> {
 const email=String(form.get("email")??"").trim();
 if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {error:"Informe um email válido."};
 const origin=(await headers()).get("origin");
 if(!origin) return {error:"Recarregue a página e tente novamente."};
 const supabase=await createClient();
 const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${origin}/auth/recuperacao`});
 if(error && (error.status===429 || error.code==="over_email_send_rate_limit")) return {error:"Aguarde alguns minutos antes de solicitar outro link."};
 if(error && error.status && error.status>=500) return {error:"Não foi possível enviar agora. Tente novamente mais tarde."};
 return {message:"Se esse email possui uma conta, você receberá um link para definir uma nova senha. Abra o link neste mesmo navegador."};
}
export async function updatePassword(_:RecoveryState,form:FormData):Promise<RecoveryState>{
 const password=String(form.get("password")??"");
 if(password.length<8 || password.length>128) return {error:"Use uma senha de 8 a 128 caracteres."};
 if(password!==String(form.get("confirm_password")??"")) return {error:"As senhas não coincidem."};
 const supabase=await createClient();
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError || !user) return {error:"Seu acesso expirou. Solicite um novo link de recuperação."};
 const {error}=await supabase.auth.updateUser({password});
 if(error) return {error:error.code==="weak_password"?"Escolha uma senha mais forte.":"Não foi possível alterar a senha. Solicite um novo link ou tente novamente."};
 return {message:"Senha alterada. Você já pode acessar sua área."};
}

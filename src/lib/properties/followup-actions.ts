"use server";
import {getCurrentProfile} from "@/lib/auth/session";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
export type FollowupState={error?:string;message?:string};
export async function updateFollowup(_:FollowupState,form:FormData):Promise<FollowupState>{
 const profile=await getCurrentProfile();if(!profile||profile.role==='client')return {error:"Sua conta não pode atualizar este atendimento."};
 const kind=String(form.get('kind')??''),target_id=String(form.get('id')??''),decision=String(form.get('status')??''),expected_updated_at=String(form.get('updated_at')??'');
 if(!['search','contact'].includes(kind)||!['new','in_progress','completed'].includes(decision)||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target_id)||!Number.isFinite(Date.parse(expected_updated_at)))return {error:"Recarregue a página e confira a situação selecionada."};
 const supabase=await createClient();const {error}=await supabase.rpc('update_request_followup',{kind,target_id,expected_updated_at,decision});
 if(error)return {error:error.code==='40001'?"Este atendimento mudou em outra aba. Recarregue a página antes de atualizar.":"Não foi possível atualizar. Confira sua permissão e tente novamente."};
 revalidatePath('/dashboard/contatos');revalidatePath('/dashboard/solicitacoes');revalidatePath('/admin');return {message:"Atendimento atualizado."};
}
